"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Upload, CheckCircle2, AlertCircle, FileSpreadsheet, X } from "lucide-react";
import { Carta } from "@/types";
import { parseBRLToFloat, calcularTaxaMensal } from "@/utils/finance";
import { useStore } from "@/store/useStore";

export function UploadArea() {
  const setEstoqueDia = useStore((s) => s.setEstoqueDia);
  const clearSelected = useStore((s) => s.clearSelected);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");

  const processFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];

          const cartas: Carta[] = rows.map((row) => {
            const credito = parseBRLToFloat(row["Crédito"] ?? row["Credito"]);
            const entrada = parseBRLToFloat(row["Entrada"]);
            const parcela = parseBRLToFloat(row["Parcela"]);
            const prazo = Number(row["Prazo"]);
            const dn = credito - entrada;
            const porcentagem_entrada = credito > 0 ? (entrada / credito) * 100 : 0;
            const custo_financeiro = calcularTaxaMensal(prazo, parcela, -dn);

            return {
              id: uuidv4(),
              grupo: Number(row["Grupo"]),
              credito,
              entrada,
              parcela,
              prazo,
              dn,
              porcentagem_entrada,
              custo_financeiro,
              is_fixa: false,
            };
          });

          setEstoqueDia(cartas);
          clearSelected();
          setStatus("success");
          setMessage(`${cartas.length} carta(s) processada(s)`);
        } catch {
          setStatus("error");
          setMessage("Formato inválido. Verifique a planilha.");
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [setEstoqueDia, clearSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) processFile(accepted[0]);
    },
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
    setMessage("");
    setFileName("");
    setEstoqueDia([]);
    clearSelected();
  };

  return (
    <div
      {...getRootProps()}
      className={`
        group relative flex items-center gap-4 rounded-xl border px-5 py-4 cursor-pointer
        transition-all duration-200 select-none
        ${isDragActive
          ? "border-red-500 bg-red-950/20 shadow-[0_0_0_1px_#dc2626]"
          : status === "success"
          ? "border-green-700/50 bg-green-950/10 hover:border-green-600/60"
          : status === "error"
          ? "border-red-700/50 bg-red-950/10 hover:border-red-500"
          : "border-white/5 bg-[#111113] hover:border-red-800/60 hover:bg-red-950/10"
        }
      `}
    >
      <input {...getInputProps()} />

      {/* Icon */}
      <div className={`
        flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg
        ${isDragActive ? "bg-red-700" : status === "success" ? "bg-green-900/50" : "bg-zinc-800 group-hover:bg-red-900/40"}
        transition-colors
      `}>
        {status === "success"
          ? <FileSpreadsheet size={20} className="text-green-400" />
          : <Upload size={20} className={isDragActive ? "text-white" : "text-zinc-400 group-hover:text-red-400"} />
        }
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {status === "idle" && !isDragActive && (
          <>
            <p className="text-sm font-medium text-zinc-300">
              Importar planilha de estoque
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">
              Arraste o arquivo .xlsx aqui ou clique para selecionar
            </p>
          </>
        )}
        {isDragActive && (
          <p className="text-sm font-medium text-red-300">Solte o arquivo aqui...</p>
        )}
        {status === "success" && (
          <>
            <p className="text-sm font-medium text-green-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              {message}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5 truncate">{fileName}</p>
          </>
        )}
        {status === "error" && (
          <p className="text-sm font-medium text-red-400 flex items-center gap-1.5">
            <AlertCircle size={14} />
            {message}
          </p>
        )}
      </div>

      {/* Clear button */}
      {status === "success" && (
        <button
          onClick={handleClear}
          className="flex-shrink-0 p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          title="Limpar"
        >
          <X size={14} />
        </button>
      )}

      {/* Drag overlay text */}
      {!isDragActive && status === "idle" && (
        <span className="hidden md:block text-xs text-zinc-700 border border-zinc-800 rounded px-2 py-1 flex-shrink-0">
          .xlsx
        </span>
      )}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/store/useStore";
import { formatBRL, formatPercent } from "@/utils/finance";
import { FileText, TrendingUp, Wallet, CreditCard, CheckSquare } from "lucide-react";
import { gerarPDF } from "@/utils/pdf";

export function ResumoPanel() {
  const { estoqueDia, bancoFixo, selectedIds } = useStore();

  const allCartas = useMemo(
    () => [...estoqueDia, ...bancoFixo],
    [estoqueDia, bancoFixo]
  );

  const selecionadas = useMemo(
    () => allCartas.filter((c) => selectedIds.has(c.id)),
    [allCartas, selectedIds]
  );

  const totais = useMemo(() => {
    return selecionadas.reduce(
      (acc, c) => ({
        credito: acc.credito + c.credito,
        entrada: acc.entrada + c.entrada,
        parcela: acc.parcela + c.parcela,
      }),
      { credito: 0, entrada: 0, parcela: 0 }
    );
  }, [selecionadas]);

  const isEmpty = selecionadas.length === 0;

  return (
    <div className="flex flex-col gap-3">

      {/* Summary cards */}
      <div className="rounded-xl border border-white/5 bg-[#111113] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-red-500" />
            <span className="text-sm font-semibold text-white">Resumo</span>
          </div>
          {!isEmpty && (
            <span className="text-xs bg-red-950 text-red-400 px-2 py-0.5 rounded-full">
              {selecionadas.length} cota{selecionadas.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 divide-y divide-white/5">
          {[
            { icon: CreditCard, label: "Crédito Total", value: formatBRL(totais.credito), accent: "text-white" },
            { icon: Wallet, label: "Entrada Total", value: formatBRL(totais.entrada), accent: "text-red-400" },
            { icon: TrendingUp, label: "Parcela Total", value: formatBRL(totais.parcela), accent: "text-zinc-300" },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-zinc-400" />
                </div>
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
              <span className={`font-mono text-sm font-semibold tabular-nums ${accent} ${isEmpty ? "text-zinc-700" : ""}`}>
                {isEmpty ? "—" : value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate PDF button */}
      <button
        onClick={() => gerarPDF(selecionadas, totais)}
        disabled={isEmpty}
        className="
          flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
          text-sm font-semibold transition-all duration-200
          disabled:bg-zinc-800/50 disabled:text-zinc-600 disabled:cursor-not-allowed
          enabled:bg-red-700 enabled:text-white enabled:hover:bg-red-600
          enabled:shadow-[0_1px_0_0_rgba(0,0,0,0.5)] enabled:hover:shadow-[0_0_12px_rgba(220,38,38,0.25)]
        "
      >
        <FileText size={15} />
        Gerar PDF do Orçamento
      </button>

      {/* Selected cards table */}
      <div className="rounded-xl border border-white/5 bg-[#111113] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <CheckSquare size={15} className="text-red-500" />
          <span className="text-sm font-semibold text-white">Cotas Selecionadas</span>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
              <CheckSquare size={18} className="text-zinc-700" />
            </div>
            <p className="text-xs text-zinc-600 text-center max-w-[180px]">
              Marque cartas na tabela ao lado para compor o orçamento
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  {["Grp", "Crédito", "Entrada", "Parcela", "DN"].map((col) => (
                    <TableHead key={col} className="text-zinc-600 text-xs font-medium uppercase tracking-wide whitespace-nowrap first:pl-4">
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selecionadas.map((carta) => (
                  <TableRow key={carta.id} className="border-white/[0.03] hover:bg-white/[0.02]">
                    <TableCell className="font-mono text-xs text-zinc-500 tabular-nums pl-4">
                      {carta.grupo}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-200 tabular-nums whitespace-nowrap">
                      {formatBRL(carta.credito)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-400 tabular-nums whitespace-nowrap">
                      {formatBRL(carta.entrada)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-zinc-400 tabular-nums whitespace-nowrap">
                      {formatBRL(carta.parcela)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-red-400 tabular-nums whitespace-nowrap font-medium">
                      {formatBRL(carta.dn)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

    </div>
  );
}

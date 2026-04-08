"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Carta } from "@/types";
import { formatBRL, formatPercent } from "@/utils/finance";
import { useStore } from "@/store/useStore";
import { Star, Trash2, Loader2, DatabaseZap, CalendarDays } from "lucide-react";
import { insertCartaSalva, deleteCartaSalva } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface Props {
  cartas: Carta[];
  mode: "dia" | "fixo";
}

export function CartaTable({ cartas, mode }: Props) {
  const { selectedIds, toggleSelected, addToBancoFixo, removeFromBancoFixo } = useStore();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const setLoading = (id: string, val: boolean) =>
    setLoadingIds((prev) => {
      const next = new Set(prev);
      val ? next.add(id) : next.delete(id);
      return next;
    });

  const handleSave = async (carta: Carta) => {
    setLoading(carta.id, true);
    try {
      const saved = await insertCartaSalva({
        grupo: carta.grupo,
        credito: carta.credito,
        entrada: carta.entrada,
        parcela: carta.parcela,
        prazo: carta.prazo,
        dn: carta.dn,
        porcentagem_entrada: carta.porcentagem_entrada,
        custo_financeiro: carta.custo_financeiro,
      });
      addToBancoFixo({ ...saved, id: saved.id ?? uuidv4() });
    } catch (e) {
      console.error("Erro ao salvar:", e);
    } finally {
      setLoading(carta.id, false);
    }
  };

  const handleDelete = async (carta: Carta) => {
    setLoading(carta.id, true);
    try {
      await deleteCartaSalva(carta.id);
      removeFromBancoFixo(carta.id);
    } catch (e) {
      console.error("Erro ao deletar:", e);
    } finally {
      setLoading(carta.id, false);
    }
  };

  if (cartas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        {mode === "dia" ? (
          <CalendarDays size={32} className="text-zinc-700" />
        ) : (
          <DatabaseZap size={32} className="text-zinc-700" />
        )}
        <p className="text-zinc-600 text-sm">
          {mode === "dia"
            ? "Importe uma planilha para ver o estoque"
            : "Nenhuma carta salva no banco fixo"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="w-10 text-zinc-600 text-xs font-medium uppercase tracking-wide pl-4">
              <span className="sr-only">Selecionar</span>
            </TableHead>
            {["Grupo", "Crédito", "Entrada", "%", "Parcela", "Prazo", "C.F a.m", "DN"].map((col) => (
              <TableHead key={col} className="text-zinc-500 text-xs font-medium uppercase tracking-wide whitespace-nowrap">
                {col}
              </TableHead>
            ))}
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartas.map((carta, i) => {
            const isSelected = selectedIds.has(carta.id);
            const isLoading = loadingIds.has(carta.id);
            return (
              <TableRow
                key={carta.id}
                onClick={() => toggleSelected(carta.id)}
                className={`
                  border-white/[0.03] cursor-pointer transition-colors
                  ${isSelected
                    ? "bg-red-950/30 hover:bg-red-950/40"
                    : i % 2 === 0
                    ? "bg-transparent hover:bg-white/[0.02]"
                    : "bg-white/[0.01] hover:bg-white/[0.03]"
                  }
                `}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelected(carta.id)}
                    className="accent-red-600 cursor-pointer w-3.5 h-3.5"
                  />
                </TableCell>
                <TableCell className="font-mono text-sm text-zinc-400 tabular-nums">
                  {carta.grupo}
                </TableCell>
                <TableCell className="font-mono text-sm text-zinc-200 tabular-nums whitespace-nowrap font-medium">
                  {formatBRL(carta.credito)}
                </TableCell>
                <TableCell className="font-mono text-sm text-zinc-300 tabular-nums whitespace-nowrap">
                  {formatBRL(carta.entrada)}
                </TableCell>
                <TableCell className="font-mono text-sm tabular-nums">
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                    {formatPercent(carta.porcentagem_entrada)}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-zinc-300 tabular-nums whitespace-nowrap">
                  {formatBRL(carta.parcela)}
                </TableCell>
                <TableCell className="font-mono text-sm text-zinc-400 tabular-nums">
                  {carta.prazo}
                  <span className="text-zinc-600 text-xs">x</span>
                </TableCell>
                <TableCell className="font-mono text-sm tabular-nums">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${carta.custo_financeiro < 1 ? "bg-green-950 text-green-400" : "bg-zinc-800 text-zinc-400"}`}>
                    {formatPercent(carta.custo_financeiro)}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-red-400 tabular-nums whitespace-nowrap font-medium">
                  {formatBRL(carta.dn)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin text-zinc-500" />
                  ) : mode === "dia" ? (
                    <button
                      onClick={() => handleSave(carta)}
                      title="Salvar no Banco Fixo"
                      className="p-1 rounded text-zinc-600 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                    >
                      <Star size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(carta)}
                      title="Remover do Banco Fixo"
                      className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

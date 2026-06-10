"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Printer } from "lucide-react";

const TAXA_JUROS = 0.01;
const PERCENTUAL_TAXA = 0.0075;

function calcularPMT(pv: number, n: number, i: number): number {
  if (pv <= 0) return 0;
  return pv * (i / (1 - Math.pow(1 + i, -n)));
}

function formatarMoeda(v: number): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Fase {
  numero: number;
  credito: number;
  entrada: number;
  parcela: number;
  taxa: number;
  liquido: number;
  prazo: number;
}

function criarFase(credito: number, prazo: number, numero: number): Fase {
  const entrada = credito * 0.5;
  return {
    numero,
    credito,
    entrada,
    parcela: calcularPMT(credito - entrada, prazo, TAXA_JUROS),
    taxa: credito * PERCENTUAL_TAXA,
    liquido: credito - entrada,
    prazo,
  };
}

export default function SimuladorPage() {
  const [iniciado, setIniciado] = useState(false);
  const [creditoInicial, setCreditoInicial] = useState("700000");
  const [prazoInicial, setPrazoInicial] = useState("190");
  const [fases, setFases] = useState<Fase[]>([]);
  const [novoCredito, setNovoCredito] = useState("");

  const iniciar = useCallback(() => {
    const credito = parseFloat(creditoInicial);
    const prazo = parseInt(prazoInicial);
    if (isNaN(credito) || isNaN(prazo)) return;
    setFases([criarFase(credito, prazo, 1)]);
    setIniciado(true);
  }, [creditoInicial, prazoInicial]);

  const adicionarFase = useCallback(() => {
    const credito = parseFloat(novoCredito.replace(/\./g, "").replace(",", "."));
    if (isNaN(credito) || fases.length === 0) return;
    setFases((prev) => [...prev, criarFase(credito, prev[0].prazo, prev.length + 1)]);
    setNovoCredito("");
  }, [novoCredito, fases]);

  const removerUltima = useCallback(() => {
    setFases((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const atualizarLiquido = useCallback((idx: number, valor: string) => {
    const n = parseFloat(valor.replace(/\./g, "").replace(",", "."));
    if (isNaN(n)) return;
    setFases((prev) => prev.map((f, i) => (i === idx ? { ...f, liquido: n } : f)));
  }, []);

  const totalParcela = fases.reduce((acc, f) => acc + f.parcela, 0);
  const totalTaxas = fases.reduce((acc, f) => acc + f.taxa, 0);
  const liquidoFinal = fases.length > 0 ? fases[fases.length - 1].liquido : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur border-b border-white/5 print:hidden">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Ademicon" width={32} height={22} />
          <div>
            <span className="text-white font-bold text-base tracking-wide">ADEMICON</span>
            <span className="ml-2 text-xs text-zinc-500 uppercase tracking-widest">Consórcio</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-full px-3 py-1 transition-colors"
          >
            <ArrowLeft size={12} />
            Voltar
          </Link>
        </div>
      </header>

      {/* Page title */}
      <div className="px-6 pt-6 pb-4 border-b border-white/5 print:hidden">
        <h1 className="text-xl font-semibold text-white">Simulador de Alavancagem</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Projeto Alavancagem de Crédito — Uso interno</p>
      </div>

      <div className="flex-1 p-6 max-w-4xl w-full mx-auto">

        {/* Print header (only visible on print) */}
        <div className="hidden print:flex items-center justify-between mb-6 border-b-2 border-red-700 pb-3">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Ademicon" width={36} height={25} className="grayscale brightness-0" />
            <span className="font-bold text-lg text-red-900">ADEMICON</span>
          </div>
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Joinville — Simulação Financeira</span>
        </div>

        <h2 className="hidden print:block text-center text-red-700 font-bold text-2xl uppercase mb-6">
          Projeto Alavancagem de Crédito
        </h2>

        {/* Setup form */}
        {!iniciado && (
          <div className="rounded-xl border border-white/5 bg-[#111113] p-6 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-2">Crédito 1ª Fase (R$)</label>
              <input
                type="number"
                value={creditoInicial}
                onChange={(e) => setCreditoInicial(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-zinc-400 mb-2">Prazo Médio (Meses)</label>
              <input
                type="number"
                value={prazoInicial}
                onChange={(e) => setPrazoInicial(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
              />
            </div>
            <button
              onClick={iniciar}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white text-sm font-bold uppercase rounded-lg transition-colors"
            >
              Gerar Proposta
            </button>
          </div>
        )}

        {/* Dashboard */}
        {iniciado && (
          <div className="flex flex-col gap-4">

            {/* Fases */}
            {fases.map((fase, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-[#111113] p-5 print:border print:border-zinc-300 print:rounded-none print:bg-white">
                <p className="text-red-500 font-bold text-sm mb-3 print:text-red-700">{fase.numero}ª Fase</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 print:border-black">
                        {["Créditos", "Entrada", "Prazo", "Parcela", "Taxa Transf."].map((h) => (
                          <th key={h} className="text-left text-xs text-zinc-500 font-semibold uppercase pb-2 pr-4 print:text-red-800 print:border print:border-black print:p-2 print:bg-zinc-100">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 pr-4 text-white print:border print:border-black print:p-2 print:font-bold print:text-black">R$ {formatarMoeda(fase.credito)}</td>
                        <td className="py-3 pr-4 text-white print:border print:border-black print:p-2 print:font-bold print:text-black">R$ {formatarMoeda(fase.entrada)}</td>
                        <td className="py-3 pr-4 text-white print:border print:border-black print:p-2 print:font-bold print:text-black">{fase.prazo}</td>
                        <td className="py-3 pr-4 text-white print:border print:border-black print:p-2 print:font-bold print:text-black">R$ {formatarMoeda(fase.parcela)}</td>
                        <td className="py-3 pr-4 text-white print:border print:border-black print:p-2 print:font-bold print:text-black">R$ {formatarMoeda(fase.taxa)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-zinc-500 mb-1.5 print:text-zinc-600">*Valor líquido para utilizar R$</p>
                  <input
                    type="text"
                    defaultValue={formatarMoeda(fase.liquido)}
                    onBlur={(e) => atualizarLiquido(idx, e.target.value)}
                    className="w-full bg-black border border-red-700 rounded-lg px-3 py-2 text-white text-right font-medium text-sm focus:outline-none focus:border-red-500 print:border-black print:bg-zinc-50 print:text-black print:font-bold"
                  />
                </div>
              </div>
            ))}

            {/* Adicionar fase */}
            <div className="rounded-xl border border-white/5 bg-[#111113] p-4 flex gap-3 items-end print:hidden">
              <div className="flex-1">
                <label className="block text-xs text-zinc-400 mb-2">Próximo Crédito (R$)</label>
                <input
                  type="text"
                  value={novoCredito}
                  onChange={(e) => setNovoCredito(e.target.value)}
                  placeholder="Ex: 1.400.000"
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <button
                onClick={adicionarFase}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors"
              >
                <Plus size={14} /> Incluir Fase
              </button>
              <button
                onClick={removerUltima}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-bold rounded-lg transition-colors"
              >
                <Trash2 size={14} /> Remover Última
              </button>
            </div>

            {/* Resumo */}
            <div className="rounded-xl border-2 border-red-900 bg-gradient-to-b from-zinc-900 to-black p-5 print:border print:border-black print:bg-white print:rounded-none">
              <h3 className="text-red-500 font-bold text-base mb-1 print:text-red-700">RESUMO DA OPERAÇÃO</h3>
              <p className="text-xs text-zinc-500 mb-4 print:text-black print:font-bold">C.F. por tranche 1% a.m. + INCC a.a</p>
              <div className="flex flex-wrap gap-6 items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400 mb-1 print:text-zinc-600">Crédito Líquido</p>
                  <p className="text-2xl font-bold text-white print:text-black">R$ {formatarMoeda(liquidoFinal)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-1 print:text-zinc-600">Valor da Parcela</p>
                  <p className="text-2xl font-bold text-white print:text-black">R$ {formatarMoeda(totalParcela)}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-1 print:text-zinc-600">Total de Taxas</p>
                  <p className="text-2xl font-bold text-white print:text-black">R$ {formatarMoeda(totalTaxas)}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="print:hidden flex items-center gap-1.5 px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white text-sm font-bold uppercase rounded-lg transition-colors"
                >
                  <Printer size={14} /> Imprimir PDF
                </button>
              </div>
            </div>

            {/* Print footer */}
            <div className="hidden print:block mt-10 border-t-2 border-red-700 pt-4 text-right">
              <p className="font-bold text-black">Anderson L. Marini</p>
              <p className="text-sm text-zinc-600">Sócio gerente</p>
              <p className="text-sm text-zinc-600">Unidade Joinville - América | Unidade SP - Jardins</p>
              <p className="text-sm text-zinc-600">(41) 98802-8545</p>
              <p className="text-sm text-blue-700">anderson.marini@licenciadoademicon.com.br</p>
            </div>

          </div>
        )}
      </div>

      <footer className="print:hidden mt-auto px-6 py-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-700">
        <span>Ademicon — Sistema Interno</span>
        <span>anderson.marini@licenciadoademicon.com.br</span>
      </footer>
    </div>
  );
}

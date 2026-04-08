"use client";

export const dynamic = "force-dynamic";

import { useStore } from "@/store/useStore";
import { UploadArea } from "@/components/UploadArea";
import { CartaTable } from "@/components/CartaTable";
import { ResumoPanel } from "@/components/ResumoPanel";
import { BancoFixoLoader } from "@/components/BancoFixoLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LayoutDashboard } from "lucide-react";

export default function Home() {
  const { estoqueDia, bancoFixo, isLoadingBancoFixo } = useStore();

  return (
    <>
      <BancoFixoLoader />
      <div className="min-h-screen flex flex-col bg-[#09090b]">

        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-red-700">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-wide">ADEMICON</span>
              <span className="ml-2 text-xs text-zinc-500 uppercase tracking-widest">Consórcio</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-600 border border-zinc-800 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Sistema Operacional
          </div>
        </header>

        {/* Page title */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <h1 className="text-xl font-semibold text-white">
            Gerador de Orçamentos
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Cartas de consórcio contempladas — Uso interno
          </p>
        </div>

        <div className="flex flex-col gap-5 p-6 flex-1">

          {/* Upload */}
          <UploadArea />

          {/* Two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5 items-start">

            {/* Left: Tables */}
            <div className="rounded-xl border border-white/5 bg-[#111113] overflow-hidden">
              <Tabs defaultValue="dia">
                <div className="border-b border-white/5 px-4 pt-3 pb-0 flex items-center justify-between">
                  <TabsList className="bg-transparent p-0 gap-1 h-auto">
                    <TabsTrigger
                      value="dia"
                      className="
                        relative px-4 py-2.5 text-sm font-medium text-zinc-500 rounded-none bg-transparent
                        data-[state=active]:text-white data-[state=active]:bg-transparent
                        data-[state=active]:shadow-none
                        after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
                        after:bg-transparent data-[state=active]:after:bg-red-600
                        hover:text-zinc-300 transition-colors
                      "
                    >
                      Estoque do Dia
                      <span className="ml-2 text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
                        {estoqueDia.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="fixo"
                      className="
                        relative px-4 py-2.5 text-sm font-medium text-zinc-500 rounded-none bg-transparent
                        data-[state=active]:text-white data-[state=active]:bg-transparent
                        data-[state=active]:shadow-none
                        after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
                        after:bg-transparent data-[state=active]:after:bg-red-600
                        hover:text-zinc-300 transition-colors
                      "
                    >
                      Banco Fixo
                      {isLoadingBancoFixo ? (
                        <Loader2 size={11} className="ml-2 animate-spin text-zinc-500" />
                      ) : (
                        <span className="ml-2 text-xs bg-red-950 text-red-400 px-1.5 py-0.5 rounded-full">
                          {bancoFixo.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="dia" className="p-0 m-0">
                  <CartaTable cartas={estoqueDia} mode="dia" />
                </TabsContent>

                <TabsContent value="fixo" className="p-0 m-0">
                  {isLoadingBancoFixo ? (
                    <div className="flex justify-center items-center py-16">
                      <Loader2 size={28} className="animate-spin text-red-600" />
                    </div>
                  ) : (
                    <CartaTable cartas={bancoFixo} mode="fixo" />
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Summary */}
            <div className="sticky top-[65px]">
              <ResumoPanel />
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto px-6 py-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-700">
          <span>Ademicon — Sistema Interno</span>
          <span>anderson.marini@licenciadoademicon.com.br</span>
        </footer>
      </div>
    </>
  );
}

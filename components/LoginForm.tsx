"use client";

import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { signIn } from "@/lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError("E-mail ou senha incorretos.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.svg" alt="Ademicon" width={64} height={45} className="mb-4" />
          <h1 className="text-white font-bold text-xl tracking-wide">ADEMICON</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerador de Orçamentos</p>
        </div>

        {/* Card */}
        <div className="bg-[#111113] border border-white/5 rounded-xl p-6">
          <h2 className="text-white font-semibold text-base mb-5">Entrar</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="
                  bg-[#18181b] border border-white/5 rounded-lg px-3 py-2.5
                  text-sm text-white placeholder-zinc-600
                  focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700
                  transition-colors
                "
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400 font-medium">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="
                  bg-[#18181b] border border-white/5 rounded-lg px-3 py-2.5
                  text-sm text-white placeholder-zinc-600
                  focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700
                  transition-colors
                "
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                flex items-center justify-center gap-2
                bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed
                text-white text-sm font-medium rounded-lg px-4 py-2.5
                transition-colors mt-1
              "
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-5">
          Acesso restrito — Uso interno Ademicon
        </p>
      </div>
    </div>
  );
}

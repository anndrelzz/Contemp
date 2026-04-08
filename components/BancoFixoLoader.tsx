"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { fetchCartasSalvas } from "@/lib/supabase";

export function BancoFixoLoader() {
  const { setBancoFixo, setIsLoadingBancoFixo } = useStore();

  useEffect(() => {
    setIsLoadingBancoFixo(true);
    fetchCartasSalvas()
      .then((cartas) => setBancoFixo(cartas))
      .catch((e) => console.error("Erro ao carregar banco fixo:", e))
      .finally(() => setIsLoadingBancoFixo(false));
  }, [setBancoFixo, setIsLoadingBancoFixo]);

  return null;
}

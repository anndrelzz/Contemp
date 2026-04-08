import { create } from "zustand";
import { Carta } from "@/types";

interface StoreState {
  // Estoque do dia (from uploaded spreadsheet)
  estoqueDia: Carta[];
  setEstoqueDia: (cartas: Carta[]) => void;

  // Banco fixo (from Supabase)
  bancoFixo: Carta[];
  setBancoFixo: (cartas: Carta[]) => void;
  addToBancoFixo: (carta: Carta) => void;
  removeFromBancoFixo: (id: string) => void;

  // Selected cards (the "cart")
  selectedIds: Set<string>;
  toggleSelected: (id: string) => void;
  clearSelected: () => void;

  // Loading states
  isLoadingBancoFixo: boolean;
  setIsLoadingBancoFixo: (v: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  estoqueDia: [],
  setEstoqueDia: (cartas) => set({ estoqueDia: cartas }),

  bancoFixo: [],
  setBancoFixo: (cartas) => set({ bancoFixo: cartas }),
  addToBancoFixo: (carta) =>
    set((state) => ({ bancoFixo: [...state.bancoFixo, carta] })),
  removeFromBancoFixo: (id) =>
    set((state) => ({
      bancoFixo: state.bancoFixo.filter((c) => c.id !== id),
      selectedIds: (() => {
        const next = new Set(state.selectedIds);
        next.delete(id);
        return next;
      })(),
    })),

  selectedIds: new Set(),
  toggleSelected: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      next.has(id) ? next.delete(id) : next.add(id);
      return { selectedIds: next };
    }),
  clearSelected: () => set({ selectedIds: new Set() }),

  isLoadingBancoFixo: false,
  setIsLoadingBancoFixo: (v) => set({ isLoadingBancoFixo: v }),
}));

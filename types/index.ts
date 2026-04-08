export interface CartaRaw {
  Credito: string;
  Grupo: number;
  Prazo: number;
  Entrada: string;
  Parcela: string;
}

export interface Carta {
  id: string;
  grupo: number;
  credito: number;
  entrada: number;
  parcela: number;
  prazo: number;
  dn: number;
  porcentagem_entrada: number;
  custo_financeiro: number;
  created_at?: string;
  is_fixa: boolean;
}

import { Carta } from "@/types";

// Cartas vindas da planilha recebem um uuid novo a cada importação, então nunca
// batem com o id das linhas já salvas no Supabase. Para saber se uma carta do
// estoque do dia já está no banco fixo, identificamos pelos valores que definem
// a cota, arredondados em centavos para absorver ruído de ponto flutuante.
export function cartaKey(carta: Carta): string {
  const cents = (n: number) => Math.round(n * 100);
  return [
    carta.grupo,
    cents(carta.credito),
    cents(carta.entrada),
    cents(carta.parcela),
    carta.prazo,
  ].join("|");
}

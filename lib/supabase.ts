import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";
import { Carta } from "@/types";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local"
    );
  }
  _client = createClient(url, key);
  return _client;
}

// Auth
export async function signIn(email: string, password: string) {
  const { data, error } = await getClient().auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  await getClient().auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await getClient().auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  return getClient().auth.onAuthStateChange((_event, session) => callback(session));
}

const TABLE = "cartas_salvas";

export async function fetchCartasSalvas(): Promise<Carta[]> {
  const { data, error } = await getClient()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    grupo: row.grupo,
    credito: Number(row.credito),
    entrada: Number(row.entrada),
    parcela: Number(row.parcela),
    prazo: row.prazo,
    dn: Number(row.dn),
    porcentagem_entrada: Number(row.porcentagem_entrada),
    custo_financeiro: Number(row.custo_financeiro),
    created_at: row.created_at,
    is_fixa: true,
  }));
}

export async function insertCartaSalva(
  carta: Omit<Carta, "id" | "created_at" | "is_fixa">
): Promise<Carta> {
  const { data, error } = await getClient()
    .from(TABLE)
    .insert([carta])
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    credito: Number(data.credito),
    entrada: Number(data.entrada),
    parcela: Number(data.parcela),
    dn: Number(data.dn),
    porcentagem_entrada: Number(data.porcentagem_entrada),
    custo_financeiro: Number(data.custo_financeiro),
    is_fixa: true,
  };
}

export async function deleteCartaSalva(id: string): Promise<void> {
  const { error } = await getClient().from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

import { supabase } from "../lib/supabaseClient";
import { Poliza } from "../models/Poliza";

export async function getPolizas(): Promise<Poliza[]> {
  const { data, error } = await supabase.from("polizas").select("*");
  if (error) throw error;
  return data || [];
}

export async function addPoliza(
  poliza: Omit<Poliza, "id_poliza">
): Promise<Poliza | null> {
  const { data, error } = await supabase
    .from("polizas")
    .insert([poliza])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updatePoliza(
  id: number,
  poliza: Partial<Poliza>
): Promise<Poliza | null> {
  const { data, error } = await supabase
    .from("polizas")
    .update(poliza)
    .eq("id_poliza", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deletePoliza(id: number): Promise<void> {
  const { error } = await supabase.from("polizas").delete().eq("id_poliza", id);
  if (error) throw error;
}

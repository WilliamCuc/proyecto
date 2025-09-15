import { supabase } from "../lib/supabaseClient";
import { Aseguradora } from "../models/Aseguradora";

export async function getAseguradoras(): Promise<Aseguradora[]> {
  const { data, error } = await supabase.from("aseguradoras").select("*");
  if (error) throw error;
  return data || [];
}

export async function addAseguradora(
  aseguradora: Omit<Aseguradora, "id_aseguradora">
): Promise<Aseguradora | null> {
  const { data, error } = await supabase
    .from("aseguradoras")
    .insert([aseguradora])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updateAseguradora(
  id: number,
  aseguradora: Partial<Aseguradora>
): Promise<Aseguradora | null> {
  const { data, error } = await supabase
    .from("aseguradoras")
    .update(aseguradora)
    .eq("id_aseguradora", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deleteAseguradora(id: number): Promise<void> {
  const { error } = await supabase
    .from("aseguradoras")
    .delete()
    .eq("id_aseguradora", id);
  if (error) throw error;
}

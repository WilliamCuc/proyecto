import { supabase } from "../lib/supabaseClient";
import { Seguimiento } from "../models/Seguimiento";

export async function getSeguimientos(): Promise<Seguimiento[]> {
  const { data, error } = await supabase.from("seguimientos").select("*");
  if (error) throw error;
  return data || [];
}

export async function addSeguimiento(
  seguimiento: Omit<Seguimiento, "id_seguimiento">
): Promise<Seguimiento | null> {
  const { data, error } = await supabase
    .from("seguimientos")
    .insert([seguimiento])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updateSeguimiento(
  id: number,
  seguimiento: Partial<Seguimiento>
): Promise<Seguimiento | null> {
  const { data, error } = await supabase
    .from("seguimientos")
    .update(seguimiento)
    .eq("id_seguimiento", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deleteSeguimiento(id: number): Promise<void> {
  const { error } = await supabase
    .from("seguimientos")
    .delete()
    .eq("id_seguimiento", id);
  if (error) throw error;
}

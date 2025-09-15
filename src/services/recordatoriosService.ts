import { supabase } from "../lib/supabaseClient";
import { Recordatorio } from "../models/Recordatorio";

export async function getRecordatorios(): Promise<Recordatorio[]> {
  const { data, error } = await supabase.from("recordatorios").select("*");
  if (error) throw error;
  return data || [];
}

export async function addRecordatorio(
  recordatorio: Omit<Recordatorio, "id_recordatorio">
): Promise<Recordatorio | null> {
  const { data, error } = await supabase
    .from("recordatorios")
    .insert([recordatorio])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updateRecordatorio(
  id: number,
  recordatorio: Partial<Recordatorio>
): Promise<Recordatorio | null> {
  const { data, error } = await supabase
    .from("recordatorios")
    .update(recordatorio)
    .eq("id_recordatorio", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deleteRecordatorio(id: number): Promise<void> {
  const { error } = await supabase
    .from("recordatorios")
    .delete()
    .eq("id_recordatorio", id);
  if (error) throw error;
}

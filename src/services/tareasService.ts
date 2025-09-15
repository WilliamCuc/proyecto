import { supabase } from "../lib/supabaseClient";
import { Tarea } from "../models/Tarea";

export async function getTareas(): Promise<Tarea[]> {
  const { data, error } = await supabase.from("tareas").select("*");
  if (error) throw error;
  return data || [];
}

export async function addTarea(
  tarea: Omit<Tarea, "id_tarea">
): Promise<Tarea | null> {
  const { data, error } = await supabase
    .from("tareas")
    .insert([tarea])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updateTarea(
  id: number,
  tarea: Partial<Tarea>
): Promise<Tarea | null> {
  const { data, error } = await supabase
    .from("tareas")
    .update(tarea)
    .eq("id_tarea", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deleteTarea(id: number): Promise<void> {
  const { error } = await supabase.from("tareas").delete().eq("id_tarea", id);
  if (error) throw error;
}

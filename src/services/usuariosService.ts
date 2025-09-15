import { supabase } from "../lib/supabaseClient";
import { Usuario } from "../models/Usuario";

export async function getUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) throw error;
  return data || [];
}

export async function addUsuario(
  usuario: Omit<Usuario, "id_usuario">
): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from("usuarios")
    .insert([usuario])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updateUsuario(
  id: number,
  usuario: Partial<Usuario>
): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from("usuarios")
    .update(usuario)
    .eq("id_usuario", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deleteUsuario(id: number): Promise<void> {
  const { error } = await supabase
    .from("usuarios")
    .delete()
    .eq("id_usuario", id);
  if (error) throw error;
}

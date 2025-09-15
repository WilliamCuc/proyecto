import { supabase } from "../lib/supabaseClient";
import { Cliente } from "../models/Cliente";

export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase.from("clientes").select("*");
  if (error) throw error;
  return data || [];
}

export async function addCliente(
  cliente: Omit<Cliente, "id_cliente">
): Promise<Cliente | null> {
  const { data, error } = await supabase
    .from("clientes")
    .insert([cliente])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updateCliente(
  id: number,
  cliente: Partial<Cliente>
): Promise<Cliente | null> {
  const { data, error } = await supabase
    .from("clientes")
    .update(cliente)
    .eq("id_cliente", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deleteCliente(id: number): Promise<void> {
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id_cliente", id);
  if (error) throw error;
}

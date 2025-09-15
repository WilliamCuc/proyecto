import { supabase } from "../lib/supabaseClient";
import { Documento } from "../models/Documento";

export async function getDocumentos(): Promise<Documento[]> {
  const { data, error } = await supabase.from("documentos").select("*");
  if (error) throw error;
  return data || [];
}

export async function addDocumento(
  documento: Omit<Documento, "id_documento">
): Promise<Documento | null> {
  const { data, error } = await supabase
    .from("documentos")
    .insert([documento])
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function updateDocumento(
  id: number,
  documento: Partial<Documento>
): Promise<Documento | null> {
  const { data, error } = await supabase
    .from("documentos")
    .update(documento)
    .eq("id_documento", id)
    .select();
  if (error) throw error;
  return data ? data[0] : null;
}

export async function deleteDocumento(id: number): Promise<void> {
  const { error } = await supabase
    .from("documentos")
    .delete()
    .eq("id_documento", id);
  if (error) throw error;
}

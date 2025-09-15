import { supabase } from "../lib/supabaseClient";
import { EstadoUsuario } from "../models/EstadoUsuario";

export async function getEstadosUsuario(): Promise<EstadoUsuario[]> {
  const { data, error } = await supabase.from("estados_usuario").select("*");
  if (error) throw error;
  return data || [];
}

import { supabase } from "../lib/supabaseClient";
import { Rol } from "../models/Rol";

export async function getRoles(): Promise<Rol[]> {
  const { data, error } = await supabase.from("roles").select("*");
  if (error) throw error;
  return data || [];
}

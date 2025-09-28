import { supabase } from "../lib/supabaseClient";
import { Seguimiento } from "../models/Seguimiento";

export class SeguimientosService {
  static async getAll(
    page: number = 1,
    limit: number = 25
  ): Promise<{
    seguimientos: Seguimiento[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("seguimientos")
        .select("*", { count: "exact" })
        .order("fecha", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching seguimientos:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No seguimientos found in database");
        return {
          seguimientos: [],
          total: 0,
          totalPages: 0,
          currentPage: page,
        };
      }

      console.log(`Found ${data.length} seguimientos in database`);

      const seguimientosConNombres: Seguimiento[] = [];

      for (const item of data) {
        if (!item || !item.id_seguimiento) {
          continue;
        }

        let clienteNombre = "";
        let usuarioNombre = "";

        // Obtener nombre del cliente
        if (item.id_cliente) {
          const { data: clienteData } = await supabase
            .from("clientes")
            .select("primer_nombre, primer_apellido")
            .eq("id_cliente", item.id_cliente)
            .single();

          if (clienteData) {
            clienteNombre = `${clienteData.primer_nombre} ${clienteData.primer_apellido}`;
          }
        }

        // Obtener nombre del usuario
        if (item.id_usuario) {
          const { data: usuarioData } = await supabase
            .from("usuarios")
            .select("primer_nombre, primer_apellido")
            .eq("id_usuario", item.id_usuario)
            .single();

          if (usuarioData) {
            usuarioNombre = `${usuarioData.primer_nombre} ${usuarioData.primer_apellido}`;
          }
        }

        seguimientosConNombres.push({
          id_seguimiento: item.id_seguimiento,
          id_cliente: item.id_cliente || 0,
          id_usuario: item.id_usuario || 0,
          fecha: item.fecha || "",
          nota: item.nota || "",
          cliente_nombre: clienteNombre,
          usuario_nombre: usuarioNombre,
        });
      }

      return {
        seguimientos: seguimientosConNombres,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error in SeguimientosService.getAll:", error);
      throw error;
    }
  }

  static async create(
    seguimientoData: Omit<
      Seguimiento,
      "id_seguimiento" | "cliente_nombre" | "usuario_nombre"
    >
  ): Promise<Seguimiento> {
    try {
      const { data: insertData, error: insertError } = await supabase
        .from("seguimientos")
        .insert([
          {
            id_cliente: seguimientoData.id_cliente,
            id_usuario: seguimientoData.id_usuario,
            fecha: seguimientoData.fecha,
            nota: seguimientoData.nota,
          },
        ])
        .select("*")
        .single();

      if (insertError) {
        console.error("Error inserting seguimiento:", insertError);
        throw insertError;
      }

      if (!insertData) {
        throw new Error("No data returned from insert");
      }

      return {
        id_seguimiento: insertData.id_seguimiento,
        id_cliente: insertData.id_cliente,
        id_usuario: insertData.id_usuario,
        fecha: insertData.fecha,
        nota: insertData.nota,
        cliente_nombre: "",
        usuario_nombre: "",
      };
    } catch (error) {
      console.error("Error in SeguimientosService.create:", error);
      throw error;
    }
  }

  static async update(
    id: number,
    seguimientoData: Partial<
      Omit<Seguimiento, "id_seguimiento" | "cliente_nombre" | "usuario_nombre">
    >
  ): Promise<Seguimiento | null> {
    const updateData: Record<string, string | number> = {};

    if (seguimientoData.id_cliente !== undefined)
      updateData.id_cliente = seguimientoData.id_cliente;
    if (seguimientoData.id_usuario !== undefined)
      updateData.id_usuario = seguimientoData.id_usuario;
    if (seguimientoData.fecha !== undefined)
      updateData.fecha = seguimientoData.fecha;
    if (seguimientoData.nota !== undefined)
      updateData.nota = seguimientoData.nota;

    const { data, error } = await supabase
      .from("seguimientos")
      .update(updateData)
      .eq("id_seguimiento", id)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id_seguimiento: data.id_seguimiento,
      id_cliente: data.id_cliente,
      id_usuario: data.id_usuario,
      fecha: data.fecha,
      nota: data.nota,
      cliente_nombre: "",
      usuario_nombre: "",
    };
  }

  static async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("seguimientos")
      .delete()
      .eq("id_seguimiento", id);
    if (error) throw error;
    return true;
  }
}

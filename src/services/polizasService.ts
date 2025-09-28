import { supabase } from "../lib/supabaseClient";
import { Poliza } from "../models/Poliza";

export class PolizasService {
  static async getAll(
    page: number = 1,
    limit: number = 25
  ): Promise<{
    polizas: Poliza[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("polizas")
        .select("*", { count: "exact" })
        .range(from, to);

      if (error) {
        console.error("Error fetching polizas:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No polizas found in database");
        return {
          polizas: [],
          total: 0,
          totalPages: 0,
          currentPage: page,
        };
      }

      console.log(`Found ${data.length} polizas in database`);

      const polizasConNombres: Poliza[] = [];

      for (const item of data) {
        if (!item || !item.id_poliza) {
          continue;
        }

        let clienteNombre = "";
        let aseguradoraNombre = "";

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

        // Obtener nombre de la aseguradora
        if (item.id_aseguradora) {
          const { data: aseguradoraData } = await supabase
            .from("aseguradoras")
            .select("nombre")
            .eq("id_aseguradora", item.id_aseguradora)
            .single();

          if (aseguradoraData) {
            aseguradoraNombre = aseguradoraData.nombre;
          }
        }

        let tipoSeguroNombre = "";
        let estadoNombre = "";

        // Obtener nombre del tipo de seguro
        if (item.id_tipo_seguro) {
          const { data: tipoSeguroData } = await supabase
            .from("tipos_seguro")
            .select("nombre")
            .eq("id_tipo_seguro", item.id_tipo_seguro)
            .single();

          if (tipoSeguroData) {
            tipoSeguroNombre = tipoSeguroData.nombre;
          }
        }

        // Obtener nombre del estado
        if (item.id_estado) {
          const { data: estadoData } = await supabase
            .from("estados_poliza")
            .select("nombre")
            .eq("id_estado", item.id_estado)
            .single();

          if (estadoData) {
            estadoNombre = estadoData.nombre;
          }
        }

        polizasConNombres.push({
          id_poliza: item.id_poliza,
          numero_poliza: item.numero_poliza || "",
          id_cliente: item.id_cliente || 0,
          id_aseguradora: item.id_aseguradora || 0,
          id_tipo_seguro: item.id_tipo_seguro || 0,
          fecha_inicio: item.fecha_inicio || "",
          fecha_fin: item.fecha_fin || "",
          monto: item.monto || 0,
          id_estado: item.id_estado || 0,
          fecha_registro: item.fecha_registro || "",
          cliente_nombre: clienteNombre,
          aseguradora_nombre: aseguradoraNombre,
          tipo_seguro_nombre: tipoSeguroNombre,
          estado_nombre: estadoNombre,
        });
      }

      return {
        polizas: polizasConNombres,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error in PolizasService.getAll:", error);
      throw error;
    }
  }

  static async create(
    polizaData: Omit<
      Poliza,
      | "id_poliza"
      | "fecha_registro"
      | "cliente_nombre"
      | "aseguradora_nombre"
      | "tipo_seguro_nombre"
      | "estado_nombre"
    >
  ): Promise<Poliza> {
    try {
      const { data: insertData, error: insertError } = await supabase
        .from("polizas")
        .insert([
          {
            numero_poliza: polizaData.numero_poliza,
            id_cliente: polizaData.id_cliente,
            id_aseguradora: polizaData.id_aseguradora,
            id_tipo_seguro: polizaData.id_tipo_seguro,
            fecha_inicio: polizaData.fecha_inicio,
            fecha_fin: polizaData.fecha_fin,
            monto: polizaData.monto,
            id_estado: polizaData.id_estado,
            fecha_registro: new Date().toISOString(),
          },
        ])
        .select("*")
        .single();

      if (insertError) {
        console.error("Error inserting poliza:", insertError);
        throw insertError;
      }

      if (!insertData) {
        throw new Error("No data returned from insert");
      }

      return {
        id_poliza: insertData.id_poliza,
        numero_poliza: insertData.numero_poliza,
        id_cliente: insertData.id_cliente,
        id_aseguradora: insertData.id_aseguradora,
        id_tipo_seguro: insertData.id_tipo_seguro,
        fecha_inicio: insertData.fecha_inicio,
        fecha_fin: insertData.fecha_fin,
        monto: insertData.monto,
        id_estado: insertData.id_estado,
        fecha_registro: insertData.fecha_registro,
        cliente_nombre: "",
        aseguradora_nombre: "",
        tipo_seguro_nombre: "",
        estado_nombre: "",
      };
    } catch (error) {
      console.error("Error in PolizasService.create:", error);
      throw error;
    }
  }

  static async update(
    id: number,
    polizaData: Partial<
      Omit<
        Poliza,
        | "id_poliza"
        | "fecha_registro"
        | "cliente_nombre"
        | "aseguradora_nombre"
        | "tipo_seguro_nombre"
        | "estado_nombre"
      >
    >
  ): Promise<Poliza | null> {
    const updateData: Record<string, string | number> = {};

    if (polizaData.numero_poliza !== undefined)
      updateData.numero_poliza = polizaData.numero_poliza;
    if (polizaData.id_cliente !== undefined)
      updateData.id_cliente = polizaData.id_cliente;
    if (polizaData.id_aseguradora !== undefined)
      updateData.id_aseguradora = polizaData.id_aseguradora;
    if (polizaData.id_tipo_seguro !== undefined)
      updateData.id_tipo_seguro = polizaData.id_tipo_seguro;
    if (polizaData.fecha_inicio !== undefined)
      updateData.fecha_inicio = polizaData.fecha_inicio;
    if (polizaData.fecha_fin !== undefined)
      updateData.fecha_fin = polizaData.fecha_fin;
    if (polizaData.monto !== undefined) updateData.monto = polizaData.monto;
    if (polizaData.id_estado !== undefined)
      updateData.id_estado = polizaData.id_estado;

    const { data, error } = await supabase
      .from("polizas")
      .update(updateData)
      .eq("id_poliza", id)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id_poliza: data.id_poliza,
      numero_poliza: data.numero_poliza,
      id_cliente: data.id_cliente,
      id_aseguradora: data.id_aseguradora,
      id_tipo_seguro: data.id_tipo_seguro,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      monto: data.monto,
      id_estado: data.id_estado,
      fecha_registro: data.fecha_registro,
      cliente_nombre: "",
      aseguradora_nombre: "",
      tipo_seguro_nombre: "",
      estado_nombre: "",
    };
  }

  static async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("polizas")
      .delete()
      .eq("id_poliza", id);
    if (error) throw error;
    return true;
  }

  static async getTiposSeguros() {
    try {
      const { data, error } = await supabase
        .from("tipos_seguro")
        .select("id_tipo_seguro, nombre")
        .eq("activo", true)
        .order("nombre");

      if (error) {
        console.error("Error fetching tipos seguros:", error);
        // Fallback a datos hardcoded si hay error
        return [
          { id_tipo_seguro: 1, nombre: "Vida" },
          { id_tipo_seguro: 2, nombre: "Automóvil" },
          { id_tipo_seguro: 3, nombre: "Hogar" },
          { id_tipo_seguro: 4, nombre: "Empresarial" },
          { id_tipo_seguro: 5, nombre: "Salud" },
        ];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getTiposSeguros:", error);
      return [
        { id_tipo_seguro: 1, nombre: "Vida" },
        { id_tipo_seguro: 2, nombre: "Automóvil" },
        { id_tipo_seguro: 3, nombre: "Hogar" },
        { id_tipo_seguro: 4, nombre: "Empresarial" },
        { id_tipo_seguro: 5, nombre: "Salud" },
      ];
    }
  }

  static async getEstados() {
    try {
      const { data, error } = await supabase
        .from("estados_poliza")
        .select("id_estado, nombre")
        .order("nombre");

      if (error) {
        console.error("Error fetching estados:", error);
        // Fallback a datos hardcoded si hay error
        return [
          { id_estado: 1, nombre: "Vigente" },
          { id_estado: 2, nombre: "Por Vencer" },
          { id_estado: 3, nombre: "Vencida" },
          { id_estado: 4, nombre: "Cancelada" },
        ];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getEstados:", error);
      return [
        { id_estado: 1, nombre: "Vigente" },
        { id_estado: 2, nombre: "Por Vencer" },
        { id_estado: 3, nombre: "Vencida" },
        { id_estado: 4, nombre: "Cancelada" },
      ];
    }
  }
}

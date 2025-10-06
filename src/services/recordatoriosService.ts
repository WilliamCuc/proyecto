import { supabase } from "../lib/supabaseClient";
import { Recordatorio } from "@/models/Recordatorio";

export const recordatoriosService = {
  // Método de debugging para verificar tablas
  async testTables() {
    try {
      // Verificar tabla recordatorios
      const { data: recordatoriosData, error: recordatoriosError } =
        await supabase.from("recordatorios").select("*").limit(1);

      console.log("Test recordatorios table:", {
        data: recordatoriosData,
        error: recordatoriosError,
      });

      // Verificar tabla polizas
      const { data: polizasData, error: polizasError } = await supabase
        .from("polizas")
        .select("*")
        .limit(1);

      console.log("Test polizas table:", {
        data: polizasData,
        error: polizasError,
      });

      // Verificar tabla clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from("clientes")
        .select("*")
        .limit(1);

      console.log("Test clientes table:", {
        data: clientesData,
        error: clientesError,
      });

      return { recordatoriosData, polizasData, clientesData };
    } catch (error) {
      console.error("Error testing tables:", error);
      throw error;
    }
  },
  // Obtener todos los recordatorios con información de póliza y cliente
  async getAll(page: number = 1, limit: number = 25) {
    try {
      const offset = (page - 1) * limit;

      console.log("Obteniendo recordatorios...");

      // Primero obtenemos los recordatorios
      const {
        data: recordatoriosData,
        error: recordatoriosError,
        count,
      } = await supabase
        .from("recordatorios")
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1)
        .order("id_recordatorio", { ascending: false });

      if (recordatoriosError) {
        console.error("Error obteniendo recordatorios:", recordatoriosError);
        throw recordatoriosError;
      }

      console.log("Recordatorios obtenidos:", recordatoriosData?.length);

      // Si no hay recordatorios, retornar vacío
      if (!recordatoriosData || recordatoriosData.length === 0) {
        return {
          recordatorios: [],
          currentPage: page,
          totalPages: 0,
          total: 0,
        };
      }

      // Obtener los IDs únicos de las pólizas
      const polizaIds = [...new Set(recordatoriosData.map((r) => r.id_poliza))];
      console.log("IDs de pólizas a buscar:", polizaIds);

      // Consultar las pólizas
      const { data: polizasData, error: polizasError } = await supabase
        .from("polizas")
        .select("id_poliza, numero_poliza, id_cliente")
        .in("id_poliza", polizaIds);

      if (polizasError) {
        console.error("Error obteniendo pólizas:", polizasError);
      } else {
        console.log("Pólizas obtenidas:", polizasData?.length);
      }

      // Obtener los IDs únicos de los clientes de las pólizas
      const clienteIds = polizasData
        ? [
            ...new Set(
              polizasData.map((p) => p.id_cliente).filter((id) => id !== null)
            ),
          ]
        : [];
      console.log("IDs de clientes a buscar:", clienteIds);

      // Consultar los clientes
      let clientesData = null;
      if (clienteIds.length > 0) {
        const { data, error: clientesError } = await supabase
          .from("clientes")
          .select("id_cliente, primer_nombre, primer_apellido")
          .in("id_cliente", clienteIds);

        if (clientesError) {
          console.error("Error obteniendo clientes:", clientesError);
        } else {
          clientesData = data;
          console.log("Clientes obtenidos:", clientesData?.length);
        }
      }

      // Mapear los datos combinando toda la información
      const recordatorios = recordatoriosData.map((record) => {
        const poliza = polizasData?.find(
          (p) => p.id_poliza === record.id_poliza
        );
        const cliente = clientesData?.find(
          (c) => c.id_cliente === poliza?.id_cliente
        );

        return {
          ...record,
          poliza_numero: poliza?.numero_poliza || "N/A",
          cliente_nombre: cliente
            ? `${cliente.primer_nombre} ${cliente.primer_apellido}`
            : "Cliente no encontrado",
        };
      });

      console.log("Datos finales mapeados:", recordatorios.length);

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        recordatorios,
        currentPage: page,
        totalPages,
        total: count || 0,
      };
    } catch (error) {
      console.error("Error general en getAll:", error);
      throw error;
    }
  },

  // Crear un nuevo recordatorio
  async create(
    recordatorioData: Omit<
      Recordatorio,
      "id_recordatorio" | "poliza_numero" | "cliente_nombre"
    >
  ) {
    try {
      const { data, error } = await supabase
        .from("recordatorios")
        .insert([recordatorioData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating recordatorio:", error);
      throw error;
    }
  },

  // Actualizar un recordatorio
  async update(
    id: number,
    recordatorioData: Partial<
      Omit<Recordatorio, "id_recordatorio" | "poliza_numero" | "cliente_nombre">
    >
  ) {
    try {
      const { data, error } = await supabase
        .from("recordatorios")
        .update(recordatorioData)
        .eq("id_recordatorio", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating recordatorio:", error);
      throw error;
    }
  },

  // Eliminar un recordatorio
  async delete(id: number) {
    try {
      const { error } = await supabase
        .from("recordatorios")
        .delete()
        .eq("id_recordatorio", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting recordatorio:", error);
      throw error;
    }
  },

  // Marcar recordatorio como enviado
  async markAsSent(id: number) {
    try {
      const { data, error } = await supabase
        .from("recordatorios")
        .update({
          enviado: true,
          fecha_envio: new Date().toISOString(),
        })
        .eq("id_recordatorio", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error marking recordatorio as sent:", error);
      throw error;
    }
  },
};

// Mantener funciones legacy para compatibilidad
export async function getRecordatorios(): Promise<Recordatorio[]> {
  const result = await recordatoriosService.getAll();
  return result.recordatorios;
}

export async function addRecordatorio(
  recordatorio: Omit<Recordatorio, "id_recordatorio">
): Promise<Recordatorio | null> {
  return await recordatoriosService.create(recordatorio);
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

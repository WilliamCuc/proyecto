export interface Poliza {
  id_poliza: number;
  id_cliente: number;
  id_aseguradora: number;
  id_tipo_seguro: number;
  numero_poliza: string;
  fecha_inicio: string;
  fecha_fin: string;
  monto: number;
  id_estado: number;
  fecha_registro: string;

  // Campos relacionados para mostrar nombres
  cliente_nombre?: string;
  aseguradora_nombre?: string;
  tipo_seguro_nombre?: string;
  estado_nombre?: string;
}

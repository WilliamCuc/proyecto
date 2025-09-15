export interface Tarea {
  id_tarea: number;
  id_usuario: number;
  id_cliente: number;
  descripcion: string;
  fecha_programada: string;
  completada: boolean;
  fecha_completada?: string;
}

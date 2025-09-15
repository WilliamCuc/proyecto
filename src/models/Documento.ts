export interface Documento {
  id_documento: number;
  id_cliente: number;
  nombre_archivo: string;
  ruta_archivo: string;
  fecha_subida: string;
  subido_por: number;
}

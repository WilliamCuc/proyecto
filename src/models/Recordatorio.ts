export interface Recordatorio {
  id_recordatorio: number;
  id_poliza: number;
  dias_antes: number;
  enviado: boolean;
  fecha_envio: string | null;
  // Campos adicionales para mostrar información relacionada
  poliza_numero?: string;
  cliente_nombre?: string;
}

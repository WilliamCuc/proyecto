export interface Recordatorio {
  id_recordatorio: number;
  id_poliza: number;
  dias_antes: number;
  enviado: boolean;
  fecha_envio: string;
}

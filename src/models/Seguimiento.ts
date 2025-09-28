export interface Seguimiento {
  id_seguimiento: number;
  id_cliente: number;
  id_usuario: number;
  fecha: string;
  nota: string;
  cliente_nombre?: string;
  usuario_nombre?: string;
}

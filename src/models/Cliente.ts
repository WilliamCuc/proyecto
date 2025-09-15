export interface Cliente {
  id_cliente: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  documento_identificacion: string;
  correo: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
}

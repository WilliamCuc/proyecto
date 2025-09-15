export interface Usuario {
  id_usuario: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  usuario: string;
  contrasena: string;
  id_rol: number;
  id_estado: number;
  fecha_creacion: string;
}

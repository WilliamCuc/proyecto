import { supabase } from "../lib/supabaseClient";

export interface Usuario {
  id_usuario: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  usuario: string;
  id_rol: number;
  id_estado: number;
}

export interface LoginResponse {
  success: boolean;
  user?: Usuario;
  message?: string;
}

export class AuthService {
  static async login(
    usuario: string,
    contrasena: string
  ): Promise<LoginResponse> {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("usuario", usuario)
        .eq("contrasena", contrasena)
        .eq("id_estado", 1) // Asumiendo que 1 es "activo"
        .single();

      if (error || !data) {
        return {
          success: false,
          message: "Usuario o contraseña incorrectos",
        };
      }

      // Guardar en localStorage
      localStorage.setItem("currentUser", JSON.stringify(data));

      return {
        success: true,
        user: data,
      };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Error de conexión",
      };
    }
  }

  static logout(): void {
    localStorage.removeItem("currentUser");
  }

  static getCurrentUser(): Usuario | null {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export { AuthService as default };

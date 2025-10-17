export interface LoginRequest {
  correoPrincipal: string;
  contraseña: string;
}

export interface RolInfo {
  idRol: number;
  nombreRol: string;
  descripcionRol: string;
}

export interface UsuarioInfo {
  idUsuario: number;
  nombreUsuario: string;
  correoPrincipal: string;
  tipoUsuario: string;
  nombreCompleto: string;
  roles: RolInfo[];
  rolPrincipal: string;
  idCliente?: number;
  idTecnico?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  usuario?: UsuarioInfo;
}

const BASE_URL = "https://be-pfst-production.up.railway.app/service/Autex_M1/auth";

/**
 * Inicia sesión con correo y contraseña
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    console.log("📤 Intentando login...");
    
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("📥 Respuesta del login:", result);

    return result;
    
  } catch (error) {
    console.error("💥 Error en login:", error);
    return {
      success: false,
      message: "Error de conexión con el servidor",
    };
  }
}

/**
 * Guarda el token y la información del usuario
 */
export function saveAuth(token: string, usuario: UsuarioInfo): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }
}

/**
 * Obtiene el token guardado
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

/**
 * Obtiene la información del usuario guardada
 */
export function getUsuario(): UsuarioInfo | null {
  if (typeof window !== "undefined") {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      try {
        return JSON.parse(usuarioStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Cierra sesión
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
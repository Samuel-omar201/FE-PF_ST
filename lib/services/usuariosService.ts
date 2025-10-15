export interface CrearUsuarioData {
  // Datos del Usuario
  nombreUsuario: string;
  correoPrincipal: string;
  correoSecundario?: string;
  contraseña: string;
  
  // Tipo de usuario
  tipoUsuario: "cliente" | "tecnico";
  
  // Datos del Cliente
  clientePrimerNombre?: string;
  clienteSegundoNombre?: string;
  clientePrimerApellido?: string;
  clienteSegundoApellido?: string;
  clienteFechaNacimiento?: string;
  clienteTelefono?: number;
  clienteDireccion?: string;
  clienteDpi?: number;
  
  // Datos del Técnico
  tecnicoPrimerNombre?: string;
  tecnicoSegundoNombre?: string;
  tecnicoPrimerApellido?: string;
  tecnicoSegundoApellido?: string;
  tecnicoCarnetEmpleado?: string;
  tecnicoTelefono?: number;
  tecnicoDpi?: number;
}

export interface CrearUsuarioResponse {
  success: boolean;
  message: string;
  idUsuario?: number;
  nombreUsuario?: string;
}

const BASE_URL = "http://localhost:8090/service/Autex_M1/ttUsuario";

/**
 * Crea un nuevo usuario (Cliente o Técnico)
 */
export async function crearUsuario(data: CrearUsuarioData): Promise<CrearUsuarioResponse> {
  try {
    console.log("📤 Enviando datos para crear usuario:", data);
    
    const response = await fetch(`${BASE_URL}/crearUsuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("📡 Status de respuesta:", response.status);

    const result = await response.json();
    console.log("📥 Respuesta del servidor:", result);

    if (!response.ok) {
      throw new Error(result.message || "Error al crear el usuario");
    }

    return result;
    
  } catch (error) {
    console.error("💥 Error en crearUsuario:", error);
    throw error;
  }
}
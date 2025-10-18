export interface SeguimientoTrabajo {
  idSeguimientoTrabajo: number;
  nombreSeguimiento: string;
  descripcionSeguimiento: string;
  notasTecnicas: string | null;
  fechaRegistro: string;
  estadoRegistro: string;
  estadoNombre: string | null;
  estadoDescripcion: string | null;
}

export interface EstadoSeguimiento {
  idEstadoSeguimientoTrabajo: number;
  nombreEstadoSeguimiento: string;
  descripcionEstadoSeguimiento: string;
}

export interface CrearSeguimientoData {
  ttOrdenTrabajoIdOrdenTrabajo: number;
  tcEstadoSeguimientoTrabajoIdEstadoSeguimientoTrabajo: number;
  nombreSeguimiento: string;
  descripcionSeguimiento: string;
  notasTecnicas?: string;
}

const BASE_URL = "http://localhost:8090/service/Autex_M1/ttSeguimientoTrabajo";
const ESTADOS_URL = "http://localhost:8090/service/Autex_M1/estado-seguimiento";

/**
 * Obtiene los seguimientos de una orden de trabajo específica
 */
export async function getSeguimientosByOrden(idOrden: number): Promise<SeguimientoTrabajo[]> {
  try {
    console.log("🔍 Obteniendo seguimientos de orden:", idOrden);
    
    const response = await fetch(`${BASE_URL}/getByOrdenTrabajo/${idOrden}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Seguimientos obtenidos:", data);
    
    return data;
    
  } catch (error) {
    console.error("💥 Error en getSeguimientosByOrden:", error);
    throw error;
  }
}

/**
 * Obtiene todos los estados de seguimiento disponibles
 */
export async function getEstadosSeguimiento(): Promise<EstadoSeguimiento[]> {
  try {
    const response = await fetch(`${ESTADOS_URL}/getAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("💥 Error en getEstadosSeguimiento:", error);
    throw error;
  }
}

/**
 * Crea un nuevo seguimiento
 */
export async function crearSeguimiento(data: CrearSeguimientoData): Promise<any> {
  try {
    console.log("📤 Creando seguimiento:", data);
    
    const response = await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al crear el seguimiento");
    }

    console.log("✅ Seguimiento creado:", result);
    return result;
    
  } catch (error) {
    console.error("💥 Error en crearSeguimiento:", error);
    throw error;
  }
}
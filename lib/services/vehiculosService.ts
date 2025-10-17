export interface VehiculoDetallado {
  idVehiculo: number;
  placa: string | null;
  marca: string | null;
  modelo: string | null;
  color: string | null;
  anioModelo: string | null;
  descripcion: string | null;
  fechaRegistro: string;
  estadoRegistro: string;
  idCliente: number | null;
  clienteNombre: string;
}

export interface Cliente {
  idCliente: number;
  primerNombre: string;
  primerApellido: string;
}

export interface CrearVehiculoData {
  ttClienteIdCliente: number;
  placa?: string;
  marca?: string;
  modelo?: string;
  color?: string;
  anioModelo?: string;
  descripcion?: string;
}

export interface ActualizarVehiculoData extends CrearVehiculoData {
  idVehiculo: number;
  estadoRegistro?: string;
}

const BASE_URL = "https://be-pfst-production.up.railway.app/service/Autex_M1/ttVehiculo";
const CLIENTES_URL = "https://be-pfst-production.up.railway.app/service/Autex_M1/ttCliente";

/**
 * Obtiene todos los vehículos con información del cliente
 */
export async function getVehiculosDetallados(): Promise<VehiculoDetallado[]> {
  try {
    console.log("🔍 Obteniendo vehículos de:", `${BASE_URL}/getAllDetailed`);
    
    const response = await fetch(`${BASE_URL}/getAllDetailed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error("La respuesta no es un arreglo válido.");
    }

    console.log(`✅ Total de vehículos: ${data.length}`);
    return data;
    
  } catch (error) {
    console.error("💥 Error en getVehiculosDetallados:", error);
    throw error;
  }
}

/**
 * Obtiene la lista de clientes para el select
 */
export async function getClientes(): Promise<Cliente[]> {
  try {
    const response = await fetch(`${CLIENTES_URL}/getAll`, {
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
    console.error("💥 Error en getClientes:", error);
    throw error;
  }
}

/**
 * Crea un nuevo vehículo
 */
export async function crearVehiculo(data: CrearVehiculoData): Promise<any> {
  try {
    console.log("📤 Creando vehículo:", data);
    console.log("📤 Creando vehículo:", JSON.stringify(data));
    const response = await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al crear el vehículo");
    }

    console.log("✅ Vehículo creado:", result);
    return result;
    
  } catch (error) {
    console.error("💥 Error en crearVehiculo:", error);
    throw error;
  }
}

/**
 * Actualiza un vehículo existente
 */
export async function actualizarVehiculo(data: ActualizarVehiculoData): Promise<any> {
  try {
    console.log("📤 Actualizando vehículo:", data);
    
    const response = await fetch(`${BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al actualizar el vehículo");
    }

    console.log("✅ Vehículo actualizado:", result);
    return result;
    
  } catch (error) {
    console.error("💥 Error en actualizarVehiculo:", error);
    throw error;
  }
}

/**
 * Desactiva un vehículo (eliminación lógica)
 */
export async function desactivarVehiculo(idVehiculo: number): Promise<void> {
  try {
    console.log("🗑️ Desactivando vehículo ID:", idVehiculo);
    
    const response = await fetch(`${BASE_URL}/desactivar/${idVehiculo}`, {
      method: "PUT",
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Error al desactivar el vehículo");
    }

    console.log("✅ Vehículo desactivado correctamente");
    
  } catch (error) {
    console.error("💥 Error en desactivarVehiculo:", error);
    throw error;
  }
}
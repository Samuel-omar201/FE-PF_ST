// reparacionesService.ts - Archivo completo actualizado

export interface ReparacionDetallada {
  idOrdenTrabajo: number;
  descripcionOrden: string;
  costoFinal: string;
  fechaRegistro: string;
  estadoRegistro: string;
  clienteNombre: string | null;
  vehiculoDescripcion: string | null;
  estadoOrden: string | null;
  fechaInicioOrden: string | null;
  fechaFinOrden: string | null;
  // Campos adicionales necesarios para la actualización
  tcEstadoOrdenTrabajoIdEstadoOrdenTrabajo?: number;
  ttClienteIdCliente?: number;
  ttVehiculoIdVehiculo?: number;
}

const BASE_URL = "https://be-pfst-production.up.railway.app/service/Autex_M1/ttOrdenTrabajo";

/**
 * Obtiene todas las reparaciones detalladas (con cliente, vehículo y estado)
 */
export async function getReparacionesDetalladas(): Promise<ReparacionDetallada[]> {
  try {
    console.log("🔍 Intentando obtener datos de:", `${BASE_URL}/getAllDetailed`);
    
    const response = await fetch(`${BASE_URL}/getAllDetailed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("📡 Status de respuesta:", response.status);
    console.log("📡 Response OK:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error del servidor:", errorText);
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Datos recibidos:", data);
    console.log("📊 Tipo de datos:", typeof data);
    console.log("📊 Es array?:", Array.isArray(data));

    // Asegurar que sea un array
    if (!Array.isArray(data)) {
      console.error("❌ La respuesta no es un arreglo:", data);
      throw new Error("La respuesta no es un arreglo válido.");
    }

    console.log(`✅ Total de reparaciones: ${data.length}`);
    return data;
    
  } catch (error) {
    console.error("💥 Error en getReparacionesDetalladas:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("🌐 Error de conexión: Verifica que el backend esté corriendo en", BASE_URL);
    }
    throw error;
  }
}

/**
 * Elimina una reparación por su ID
 */
export async function eliminarReparacion(idOrdenTrabajo: number): Promise<void> {
  try {
    console.log("🗑️ Eliminando reparación ID:", idOrdenTrabajo);
    
    const response = await fetch(`${BASE_URL}/delete/${idOrdenTrabajo}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al eliminar:", errorText);
      throw new Error(`Error HTTP al eliminar: ${response.status} - ${errorText}`);
    }

    console.log("✅ Reparación eliminada correctamente");
    
  } catch (error) {
    console.error("💥 Error eliminando reparación:", error);
    throw error;
  }
}

/**
 * Actualiza una reparación existente
 */
export async function actualizarReparacion(
  idOrden: number,
  datosActualizados: Partial<ReparacionDetallada>
): Promise<any> {
  try {
    console.log("📤 Actualizando reparación:", idOrden, datosActualizados);

    // Construir el objeto según el formato esperado por el backend
    const payload = {
      idOrdenTrabajo: idOrden,
      descripcionOrden: datosActualizados.descripcionOrden,
      costoFinal: datosActualizados.costoFinal,
      fechaInicioOrden: datosActualizados.fechaInicioOrden,
      fechaFinOrden: datosActualizados.fechaFinOrden,
      tcEstadoOrdenTrabajoIdEstadoOrdenTrabajo: datosActualizados.tcEstadoOrdenTrabajoIdEstadoOrdenTrabajo,
      ttClienteIdCliente: datosActualizados.ttClienteIdCliente,
      ttVehiculoIdVehiculo: datosActualizados.ttVehiculoIdVehiculo,
      estadoRegistro: "1", // Mantener activo
    };

    const response = await fetch(`${BASE_URL}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Reparación actualizada:", data);

    return data;
  } catch (error) {
    console.error("💥 Error en actualizarReparacion:", error);
    throw error;
  }
}
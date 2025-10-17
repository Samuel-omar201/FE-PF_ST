export interface FacturaDetallada {
  idFactura: number;
  noFactura: string;
  fechaFactura: string;
  totalFactura: number;
  descripcionFactura: string;
  fechaRegistro: string;
  estadoRegistro: string;
  idOrdenTrabajo: number | null;
  descripcionOrden: string | null;
  clienteNombre: string | null;
  vehiculoDescripcion: string | null;
  vehiculoPlaca: string | null;
  vehiculoMarca: string | null;
  vehiculoModelo: string | null;
  estadoOrden: string | null;
}

const BASE_URL = "https://be-pfst-production.up.railway.app/service/Autex_M1/ttFactura";

/**
 * Obtiene todas las facturas con información detallada
 */
export async function getFacturasDetalladas(): Promise<FacturaDetallada[]> {
  try {
    console.log("🔍 Intentando obtener facturas de:", `${BASE_URL}/getAllDetailed`);
    
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

    if (!Array.isArray(data)) {
      console.error("❌ La respuesta no es un arreglo:", data);
      throw new Error("La respuesta no es un arreglo válido.");
    }

    console.log(`✅ Total de facturas: ${data.length}`);
    return data;
    
  } catch (error) {
    console.error("💥 Error en getFacturasDetalladas:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("🌐 Error de conexión: Verifica que el backend esté corriendo en", BASE_URL);
    }
    throw error;
  }
}

/**
 * Elimina una factura por su ID
 */
export async function eliminarFactura(idFactura: number): Promise<void> {
  try {
    console.log("🗑️ Eliminando factura ID:", idFactura);
    
    const response = await fetch(`${BASE_URL}/delete/${idFactura}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error al eliminar:", errorText);
      throw new Error(`Error HTTP al eliminar: ${response.status} - ${errorText}`);
    }

    console.log("✅ Factura eliminada correctamente");
    
  } catch (error) {
    console.error("💥 Error eliminando factura:", error);
    throw error;
  }
}
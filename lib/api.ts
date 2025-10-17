// /lib/api.ts

const BASE_URL = "https://be-pfst-production.up.railway.app/service/Autex_M1";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Función genérica para consumir la API del backend.
 * @param endpoint Ruta específica del servicio (ej: "ttOrdenTrabajo/getAll")
 * @param options Opciones adicionales para la solicitud
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
}

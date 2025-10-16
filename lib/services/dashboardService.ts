export interface EstadisticasAdmin {
  reparacionesActivas: number;
  articulosStock: number;
  serviciosMes: number;
  ingresosMes: number;
}

export interface VehiculoCliente {
  idVehiculo: number;
  marca: string;
  modelo: string;
  placa: string;
  estadoReparacion: string | null;
  diasEstimados: number | null;
  servicioActual: string | null;
  tecnicoAsignado: string | null;
  ultimoServicio: string | null;
}

export interface ReparacionTecnico {
  idOrdenTrabajo: number;
  vehiculo: string;
  placa: string;
  descripcion: string;
  estado: string;
  progreso: number;
  horaInicio: string | null;
}

export interface HistorialServicio {
  idFactura: number;
  fecha: string;
  vehiculo: string;
  servicio: string;
  monto: number;
}

const BASE_URL = "http://localhost:8090/service/Autex_M1";

/**
 * Obtiene estadísticas generales para el dashboard de administrador
 */
export async function getEstadisticasAdmin(): Promise<EstadisticasAdmin> {
  try {
    // Por ahora datos mock, después conectar con endpoints reales
    return {
      reparacionesActivas: 12,
      articulosStock: 248,
      serviciosMes: 45,
      ingresosMes: 24500,
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    throw error;
  }
}

/**
 * Obtiene los vehículos de un cliente específico con su estado
 */
export async function getVehiculosCliente(idCliente: number): Promise<VehiculoCliente[]> {
  try {
    console.log("🚗 Obteniendo vehículos del cliente:", idCliente);
    
    // Obtener vehículos del cliente
    const responseVehiculos = await fetch(`${BASE_URL}/ttVehiculo/getAllDetailed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!responseVehiculos.ok) {
      throw new Error("Error al obtener vehículos");
    }

    const todosVehiculos = await responseVehiculos.json();
    
    // Filtrar solo los vehículos del cliente
    const vehiculosCliente = todosVehiculos.filter(
      (v: any) => v.idCliente === idCliente
    );

    // Obtener órdenes de trabajo para saber el estado
    const responseOrdenes = await fetch(`${BASE_URL}/ttOrdenTrabajo/getAllDetailed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    let ordenes = [];
    if (responseOrdenes.ok) {
      ordenes = await responseOrdenes.json();
    }

    // Mapear vehículos con su estado actual
    const vehiculosConEstado: VehiculoCliente[] = vehiculosCliente.map((v: any) => {
      // Buscar si hay una orden activa para este vehículo
      const ordenActiva = ordenes.find(
        (o: any) => o.idVehiculo === v.idVehiculo && 
                   o.estadoOrden !== "Completado" &&
                   o.estadoRegistro === "1"
      );

      // Buscar la última orden completada
      const ultimaOrden = ordenes
        .filter((o: any) => o.idVehiculo === v.idVehiculo && o.estadoOrden === "Completado")
        .sort((a: any, b: any) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())[0];

      return {
        idVehiculo: v.idVehiculo,
        marca: v.marca || "N/A",
        modelo: v.modelo || "N/A",
        placa: v.placa || "N/A",
        estadoReparacion: ordenActiva ? ordenActiva.estadoOrden : null,
        diasEstimados: ordenActiva ? calcularDiasEstimados(ordenActiva.fechaFinOrden) : null,
        servicioActual: ordenActiva ? ordenActiva.descripcionOrden : null,
        tecnicoAsignado: ordenActiva ? "Técnico Asignado" : null,
        ultimoServicio: ultimaOrden ? formatearFechaRelativa(ultimaOrden.fechaFinOrden) : null,
      };
    });

    console.log("✅ Vehículos del cliente obtenidos:", vehiculosConEstado);
    return vehiculosConEstado;

  } catch (error) {
    console.error("💥 Error en getVehiculosCliente:", error);
    throw error;
  }
}

/**
 * Obtiene las reparaciones asignadas a un técnico
 */
export async function getReparacionesTecnico(idTecnico: number): Promise<ReparacionTecnico[]> {
  try {
    console.log("🔧 Obteniendo reparaciones del técnico:", idTecnico);
    
    const response = await fetch(`${BASE_URL}/ttOrdenTrabajo/getAllDetailed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Error al obtener reparaciones");
    }

    const todasOrdenes = await response.json();

    // TODO: Filtrar por técnico asignado cuando implementes la relación
    // Por ahora devolvemos las órdenes activas
    const reparaciones: ReparacionTecnico[] = todasOrdenes
      .filter((o: any) => o.estadoOrden !== "Completado" && o.estadoRegistro === "1")
      .slice(0, 5) // Limitar a 5 para el dashboard
      .map((o: any) => ({
        idOrdenTrabajo: o.idOrdenTrabajo,
        vehiculo: `${o.vehiculoDescripcion || "Vehículo"}`,
        placa: "N/A", // Agregar cuando tengas la placa en el detalle
        descripcion: o.descripcionOrden,
        estado: o.estadoOrden,
        progreso: calcularProgreso(o.estadoOrden),
        horaInicio: o.fechaInicioOrden,
      }));

    console.log("✅ Reparaciones del técnico obtenidas:", reparaciones);
    return reparaciones;

  } catch (error) {
    console.error("💥 Error en getReparacionesTecnico:", error);
    throw error;
  }
}

/**
 * Obtiene el historial de servicios de un cliente
 */
export async function getHistorialCliente(idCliente: number): Promise<HistorialServicio[]> {
  try {
    console.log("📋 Obteniendo historial del cliente:", idCliente);
    
    const response = await fetch(`${BASE_URL}/ttFactura/getAllDetailed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Error al obtener historial");
    }

    const todasFacturas = await response.json();

    // Filtrar facturas del cliente
    const facturasCliente = todasFacturas
      .filter((f: any) => f.idCliente === idCliente)
      .sort((a: any, b: any) => new Date(b.fechaFactura).getTime() - new Date(a.fechaFactura).getTime())
      .slice(0, 5); // Últimas 5

    const historial: HistorialServicio[] = facturasCliente.map((f: any) => ({
      idFactura: f.idFactura,
      fecha: f.fechaFactura,
      vehiculo: f.vehiculoDescripcion || "Vehículo",
      servicio: f.descripcionFactura || f.descripcionOrden || "Servicio",
      monto: parseFloat(f.totalFactura) || 0,
    }));

    console.log("✅ Historial del cliente obtenido:", historial);
    return historial;

  } catch (error) {
    console.error("💥 Error en getHistorialCliente:", error);
    throw error;
  }
}

/**
 * Calcula los días estimados hasta una fecha
 */
function calcularDiasEstimados(fechaFin: string | null): number | null {
  if (!fechaFin) return null;
  
  const fin = new Date(fechaFin);
  const hoy = new Date();
  const diferencia = fin.getTime() - hoy.getTime();
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  
  return dias > 0 ? dias : 0;
}

/**
 * Formatea una fecha de manera relativa (hace X días/meses)
 */
function formatearFechaRelativa(fecha: string | null): string {
  if (!fecha) return "N/A";
  
  const fechaPasada = new Date(fecha);
  const hoy = new Date();
  const diferencia = hoy.getTime() - fechaPasada.getTime();
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Hace 1 día";
  if (dias < 30) return `Hace ${dias} días`;
  
  const meses = Math.floor(dias / 30);
  if (meses === 1) return "Hace 1 mes";
  return `Hace ${meses} meses`;
}

/**
 * Calcula el progreso según el estado
 */
function calcularProgreso(estado: string): number {
  const estadoLower = estado?.toLowerCase() || "";
  
  if (estadoLower.includes("completado")) return 100;
  if (estadoLower.includes("proceso")) return 60;
  if (estadoLower.includes("pendiente")) return 20;
  
  return 0;
}
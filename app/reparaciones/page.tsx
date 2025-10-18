"use client";

import { useEffect, useState } from "react";
import {
  getReparacionesDetalladas,
  eliminarReparacion,
  ReparacionDetallada,
} from "@/lib/services/reparacionesService";
///import { SeguimientoDrawer } from "@/components/seguimientoDrawer";
import { SeguimientoDrawer } from "@/components/SeguimientoDrawer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, User, Car, Plus, Trash2, Eye, Edit } from "lucide-react";

const estadoColors: Record<string, string> = {
  completado: "bg-green-500/10 text-green-500 border-green-500/20",
  "en proceso": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "en-proceso": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pendiente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  default: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const getEstadoColor = (estado: string | null): string => {
  if (!estado) return estadoColors.default;
  const estadoLower = estado.toLowerCase();
  return estadoColors[estadoLower] || estadoColors.default;
};

const calcularProgreso = (estado: string | null): number => {
  if (!estado) return 0;
  const estadoLower = estado.toLowerCase();
  
  if (estadoLower.includes("completado")) return 100;
  if (estadoLower.includes("proceso")) return 60;
  if (estadoLower.includes("pendiente")) return 20;
  return 0;
};

const calcularDiasTranscurridos = (fechaInicio: string | null): number => {
  if (!fechaInicio) return 0;
  const inicio = new Date(fechaInicio);
  const hoy = new Date();
  const diferencia = hoy.getTime() - inicio.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
};

export default function ReparacionesPage() {
  const [reparaciones, setReparaciones] = useState<ReparacionDetallada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el drawer de seguimiento
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState<ReparacionDetallada | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Iniciando carga de datos...");
      const data = await getReparacionesDetalladas();
      console.log("✅ Datos cargados exitosamente:", data);
      
      setReparaciones(data);
      
    } catch (err) {
      console.error("❌ Error capturado en cargarDatos:", err);
      
      if (err instanceof Error) {
        setError(`Error al cargar los datos: ${err.message}`);
      } else {
        setError("Error desconocido al cargar los datos");
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta reparación?")) return;
    
    try {
      await eliminarReparacion(id);
      setReparaciones((prev) => prev.filter((r) => r.idOrdenTrabajo !== id));
      alert("✅ Reparación eliminada correctamente");
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("❌ Error al eliminar la reparación");
    }
  };

  const handleVerDetalles = (reparacion: ReparacionDetallada) => {
    console.log("📋 Abriendo seguimiento para orden:", reparacion.idOrdenTrabajo);
    setReparacionSeleccionada(reparacion);
    setDrawerOpen(true);
  };

  // Cálculos de estadísticas
  const totalActivas = reparaciones.filter(
    (r) => r.estadoOrden?.toLowerCase() !== "completado"
  ).length;

  const completadasHoy = reparaciones.filter((r) => {
    if (!r.fechaFinOrden) return false;
    const hoy = new Date().toISOString().split("T")[0];
    return r.fechaFinOrden === hoy;
  }).length;

  const tiempoPromedio = reparaciones
    .filter((r) => r.fechaInicioOrden && r.fechaFinOrden)
    .reduce((acc, r) => {
      const inicio = new Date(r.fechaInicioOrden!);
      const fin = new Date(r.fechaFinOrden!);
      const dias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
      return acc + dias;
    }, 0);

  const promedioFinal = reparaciones.length > 0 ? (tiempoPromedio / reparaciones.length).toFixed(1) : "0";

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="container flex h-16 items-center justify-between px-6">
            <h1 className="text-2xl font-bold">Reparaciones de Vehículos</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={cargarDatos}>
                🔄 Recargar
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Reparación
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Estadísticas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalActivas}</div>
                <p className="text-xs text-muted-foreground">Reparaciones en curso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completadasHoy}</div>
                <p className="text-xs text-muted-foreground">Vehículos listos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{promedioFinal} días</div>
                <p className="text-xs text-muted-foreground">Por reparación</p>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">⏳ Cargando reparaciones...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="py-6">
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-700 font-semibold">❌ {error}</p>
                  <p className="text-sm text-red-600 mt-2">
                    Verifica la consola del navegador para más detalles.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && reparaciones.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    📋 No hay reparaciones registradas.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Reparaciones */}
          {!loading && !error && reparaciones.length > 0 && (
            <div className="space-y-4">
              {reparaciones.map((reparacion) => {
                const progreso = calcularProgreso(reparacion.estadoOrden);
                const diasTranscurridos = calcularDiasTranscurridos(reparacion.fechaInicioOrden);

                return (
                  <Card key={reparacion.idOrdenTrabajo}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">
                              {reparacion.vehiculoDescripcion || "Vehículo sin descripción"}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={getEstadoColor(reparacion.estadoOrden)}
                            >
                              {reparacion.estadoOrden || "Sin estado"}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <Car className="h-3 w-3" />
                            Orden #{reparacion.idOrdenTrabajo}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerDetalles(reparacion)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEliminar(reparacion.idOrdenTrabajo)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Cliente:</span>
                            <span className="font-medium">
                              {reparacion.clienteNombre || "Sin asignar"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Costo:</span>
                            <span className="font-medium text-green-600">
                              ${reparacion.costoFinal || "0.00"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Ingreso:</span>
                            <span className="font-medium">
                              {reparacion.fechaInicioOrden || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Entrega estimada:</span>
                            <span className="font-medium">
                              {reparacion.fechaFinOrden || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            {reparacion.descripcionOrden || "Sin descripción"}
                          </span>
                          <span className="text-muted-foreground">{progreso}%</span>
                        </div>
                        <Progress value={progreso} className="h-2" />
                        {diasTranscurridos > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {diasTranscurridos} día{diasTranscurridos !== 1 ? "s" : ""} desde el ingreso
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drawer de Seguimiento */}
      {reparacionSeleccionada && (
        <SeguimientoDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          idOrdenTrabajo={reparacionSeleccionada.idOrdenTrabajo}
          vehiculoDescripcion={reparacionSeleccionada.vehiculoDescripcion || "Vehículo sin descripción"}
        />
      )}
    </>
  );
}
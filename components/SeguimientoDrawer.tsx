"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSeguimientosByOrden,
  getEstadosSeguimiento,
  crearSeguimiento,
  SeguimientoTrabajo,
  EstadoSeguimiento,
} from "@/lib/services/seguimientoService";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle, Plus, AlertCircle } from "lucide-react";

interface SeguimientoDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idOrdenTrabajo: number;
  vehiculoDescripcion: string;
}

export function SeguimientoDrawer({
  open,
  onOpenChange,
  idOrdenTrabajo,
  vehiculoDescripcion,
}: SeguimientoDrawerProps) {
  const { usuario } = useAuth();
  const [seguimientos, setSeguimientos] = useState<SeguimientoTrabajo[]>([]);
  const [estados, setEstados] = useState<EstadoSeguimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Formulario
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");
  const [nombreSeguimiento, setNombreSeguimiento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Verificar si el usuario puede agregar seguimientos
  const puedeAgregar = usuario && ["Administrador", "Recepcionista", "Tecnico"].includes(usuario.rolPrincipal);

  useEffect(() => {
    if (open) {
      cargarDatos();
    }
  }, [open, idOrdenTrabajo]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const [seguimientosData, estadosData] = await Promise.all([
        getSeguimientosByOrden(idOrdenTrabajo),
        getEstadosSeguimiento(),
      ]);

      setSeguimientos(seguimientosData);
      setEstados(estadosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!estadoSeleccionado || !nombreSeguimiento || !descripcion) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setGuardando(true);

      await crearSeguimiento({
        ttOrdenTrabajoIdOrdenTrabajo: idOrdenTrabajo,
        tcEstadoSeguimientoTrabajoIdEstadoSeguimientoTrabajo: parseInt(estadoSeleccionado),
        nombreSeguimiento,
        descripcionSeguimiento: descripcion,
        notasTecnicas: notas || undefined,
      });

      alert("✅ Seguimiento agregado correctamente");
      
      // Limpiar formulario
      setEstadoSeleccionado("");
      setNombreSeguimiento("");
      setDescripcion("");
      setNotas("");
      setMostrarFormulario(false);

      // Recargar seguimientos
      cargarDatos();

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al agregar el seguimiento");
    } finally {
      setGuardando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString("es-GT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIconoEstado = (estadoNombre: string | null) => {
    if (!estadoNombre) return <Clock className="h-5 w-5" />;
    
    const nombreLower = estadoNombre.toLowerCase();
    if (nombreLower.includes("finalizado") || nombreLower.includes("completado")) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (nombreLower.includes("pausado") || nombreLower.includes("espera")) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    return <Clock className="h-5 w-5 text-blue-500" />;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Seguimiento de Reparación</SheetTitle>
          <SheetDescription>
            {vehiculoDescripcion} • Orden #{idOrdenTrabajo}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Botón para agregar seguimiento */}
          {puedeAgregar && !mostrarFormulario && (
            <Button
              onClick={() => setMostrarFormulario(true)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Seguimiento
            </Button>
          )}

          {/* Formulario para agregar seguimiento */}
          {mostrarFormulario && (
            <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4 bg-accent/50">
              <h3 className="font-semibold">Nuevo Seguimiento</h3>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select value={estadoSeleccionado} onValueChange={setEstadoSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem
                        key={estado.idEstadoSeguimientoTrabajo}
                        value={estado.idEstadoSeguimientoTrabajo.toString()}
                      >
                        {estado.nombreEstadoSeguimiento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Seguimiento *</Label>
                <Input
                  id="nombre"
                  value={nombreSeguimiento}
                  onChange={(e) => setNombreSeguimiento(e.target.value)}
                  placeholder="Ej: Revisión inicial"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe el avance o hallazgo"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas Técnicas</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Detalles técnicos adicionales (opcional)"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando} className="flex-1">
                  {guardando ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          )}

          {/* Timeline de seguimientos */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando seguimientos...</p>
            </div>
          ) : seguimientos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No hay seguimientos registrados para esta orden
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Historial de Seguimiento
              </h3>
              
              {/* Timeline */}
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border">
                {seguimientos.map((seguimiento, index) => (
                  <div key={seguimiento.idSeguimientoTrabajo} className="relative flex items-start gap-4">
                    {/* Icono */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border-2 border-border">
                      {getIconoEstado(seguimiento.estadoNombre)}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 space-y-1 pt-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{seguimiento.nombreSeguimiento}</p>
                        {seguimiento.estadoNombre && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {seguimiento.estadoNombre}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {seguimiento.descripcionSeguimiento}
                      </p>

                      {seguimiento.notasTecnicas && (
                        <div className="mt-2 p-2 rounded bg-accent/50 text-sm">
                          <p className="font-medium text-xs text-muted-foreground">Notas técnicas:</p>
                          <p>{seguimiento.notasTecnicas}</p>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        {formatearFecha(seguimiento.fechaRegistro)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
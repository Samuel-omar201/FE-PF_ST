"use client";

import { useEffect, useState } from "react";
import { ReparacionDetallada } from "@/lib/services/reparacionesService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";

interface EditarReparacionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reparacion: ReparacionDetallada | null;
  onGuardar: (reparacionActualizada: Partial<ReparacionDetallada>) => Promise<void>;
}

interface EstadoOrden {
  idEstadoOrdenTrabajo: number;
  nombreEstadoOrden: string;
  descripcionEstadoOrden: string;
}

export function EditarReparacionDialog({
  open,
  onOpenChange,
  reparacion,
  onGuardar,
}: EditarReparacionDialogProps) {
  const [guardando, setGuardando] = useState(false);
  const [estados, setEstados] = useState<EstadoOrden[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(false);

  // Estados del formulario
  const [descripcion, setDescripcion] = useState("");
  const [costoFinal, setCostoFinal] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoId, setEstadoId] = useState("");

  // Cargar estados disponibles
  useEffect(() => {
    if (open) {
      cargarEstados();
    }
  }, [open]);

  // Inicializar formulario con datos de la reparación
  useEffect(() => {
    if (reparacion) {
      setDescripcion(reparacion.descripcionOrden || "");
      setCostoFinal(reparacion.costoFinal || "");
      setFechaInicio(reparacion.fechaInicioOrden || "");
      setFechaFin(reparacion.fechaFinOrden || "");
      setEstadoId(reparacion.tcEstadoOrdenTrabajoIdEstadoOrdenTrabajo?.toString() || "");
    }
  }, [reparacion]);

  const cargarEstados = async () => {
    try {
      setLoadingEstados(true);
      const response = await fetch("https://be-pfst-production.up.railway.app/service/Autex_M1/estado-orden/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Error al cargar estados");
      }

      const data = await response.json();
      setEstados(data);
    } catch (error) {
      console.error("Error cargando estados:", error);
      alert("❌ Error al cargar los estados disponibles");
    } finally {
      setLoadingEstados(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descripcion || !costoFinal || !fechaInicio || !fechaFin || !estadoId) {
      alert("⚠️ Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setGuardando(true);

      const reparacionActualizada: Partial<ReparacionDetallada> = {
        idOrdenTrabajo: reparacion?.idOrdenTrabajo,
        descripcionOrden: descripcion,
        costoFinal: costoFinal,
        fechaInicioOrden: fechaInicio,
        fechaFinOrden: fechaFin,
        tcEstadoOrdenTrabajoIdEstadoOrdenTrabajo: parseInt(estadoId),
        // Mantener datos existentes
        ttClienteIdCliente: reparacion?.ttClienteIdCliente,
        ttVehiculoIdVehiculo: reparacion?.ttVehiculoIdVehiculo,
      };

      await onGuardar(reparacionActualizada);
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al actualizar la reparación");
    } finally {
      setGuardando(false);
    }
  };

  if (!reparacion) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Reparación</DialogTitle>
          <DialogDescription>
            Orden #{reparacion.idOrdenTrabajo} - {reparacion.vehiculoDescripcion}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información del Cliente y Vehículo (Solo lectura) */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente</p>
                <p className="font-medium">{reparacion.clienteNombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Vehículo</p>
                <p className="font-medium">{reparacion.vehiculoDescripcion}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción de la Reparación *</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el trabajo a realizar"
              rows={3}
              required
            />
          </div>

          {/* Costo Final */}
          <div className="space-y-2">
            <Label htmlFor="costo">Costo Final *</Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              min="0"
              value={costoFinal}
              onChange={(e) => setCostoFinal(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha de Entrega *</Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado de la Orden *</Label>
            {loadingEstados ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando estados...
              </div>
            ) : (
              <Select value={estadoId} onValueChange={setEstadoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem
                      key={estado.idEstadoOrdenTrabajo}
                      value={estado.idEstadoOrdenTrabajo.toString()}
                    >
                      {estado.nombreEstadoOrden}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
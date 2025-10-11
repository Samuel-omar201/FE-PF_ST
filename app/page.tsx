"use client";

import { useEffect, useState } from "react";
import {
  getReparacionesDetalladas,
  eliminarReparacion,
  ReparacionDetallada,
} from "@/lib/services/reparacionesService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReparacionesPage() {
  const [reparaciones, setReparaciones] = useState<ReparacionDetallada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getReparacionesDetalladas();
      setReparaciones(data); // ✅ Ahora coincide el tipo
    } catch (err) {
      console.error(err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Deseas eliminar esta reparación?")) return;
    try {
      await eliminarReparacion(id);
      setReparaciones((prev) => prev.filter((r) => r.idOrdenTrabajo !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la reparación");
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Gestión de Reparaciones</CardTitle>
        </CardHeader>

        <CardContent>
          {loading && <p>Cargando reparaciones...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && reparaciones.length === 0 && <p>No hay reparaciones registradas.</p>}

          {!loading && reparaciones.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Cliente</th>
                    <th className="border p-2 text-left">Vehículo</th>
                    <th className="border p-2 text-left">Descripción</th>
                    <th className="border p-2 text-left">Costo Final</th>
                    <th className="border p-2 text-left">Estado</th>
                    <th className="border p-2 text-left">Fecha Inicio</th>
                    <th className="border p-2 text-left">Fecha Fin</th>
                    <th className="border p-2 text-left">Registro</th>
                    <th className="border p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reparaciones.map((rep) => (
                    <tr key={rep.idOrdenTrabajo} className="hover:bg-gray-50">
                      <td className="border p-2">{rep.idOrdenTrabajo}</td>
                      <td className="border p-2">{rep.clienteNombre}</td>
                      <td className="border p-2">{rep.vehiculoDescripcion}</td>
                      <td className="border p-2">{rep.descripcionOrden}</td>
                      <td className="border p-2">{rep.costoFinal}</td>
                      <td className="border p-2">{rep.estadoOrden}</td>
                      <td className="border p-2">{rep.fechaInicioOrden}</td>
                      <td className="border p-2">{rep.fechaFinOrden}</td>
                      <td className="border p-2">{new Date(rep.fechaRegistro).toLocaleString()}</td>
                      <td className="border p-2 text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEliminar(rep.idOrdenTrabajo)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

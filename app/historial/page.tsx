"use client";

import { useEffect, useState } from "react";
import { getFacturasDetalladas, FacturaDetallada } from "@/lib/services/facturasService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, DollarSign, Calendar, CoinsIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const estadoColors = {
  "1": "bg-green-500/10 text-green-500 border-green-500/20",
  "0": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

const estadoLabels = {
  "1": "Activo",
  "0": "Inactivo",
};

export default function HistorialPage() {
  const [facturas, setFacturas] = useState<FacturaDetallada[]>([]);
  const [facturasFiltradas, setFacturasFiltradas] = useState<FacturaDetallada[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarFacturas();
  }, [busqueda, facturas]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Cargando facturas...");
      const data = await getFacturasDetalladas();
      console.log("✅ Facturas cargadas:", data);
      
      setFacturas(data);
      setFacturasFiltradas(data);
      
    } catch (err) {
      console.error("❌ Error al cargar facturas:", err);
      if (err instanceof Error) {
        setError(`Error al cargar los datos: ${err.message}`);
      } else {
        setError("Error desconocido al cargar los datos");
      }
    } finally {
      setLoading(false);
    }
  };

  const filtrarFacturas = () => {
    if (!busqueda.trim()) {
      setFacturasFiltradas(facturas);
      return;
    }

    const busquedaLower = busqueda.toLowerCase();
    const filtradas = facturas.filter((factura) =>
      factura.noFactura?.toLowerCase().includes(busquedaLower) ||
      factura.clienteNombre?.toLowerCase().includes(busquedaLower) ||
      factura.vehiculoPlaca?.toLowerCase().includes(busquedaLower) ||
      factura.descripcionFactura?.toLowerCase().includes(busquedaLower)
    );
    setFacturasFiltradas(filtradas);
  };

  // Cálculos de estadísticas
  const totalFacturado = facturasFiltradas
    .filter((f) => f.estadoRegistro === "1")
    .reduce((sum, f) => sum + (f.totalFactura || 0), 0);

  const facturasActivas = facturasFiltradas.filter((f) => f.estadoRegistro === "1").length;
  
  const ticketPromedio = facturasActivas > 0 ? totalFacturado / facturasActivas : 0;

  const exportarReporte = () => {
    // Implementar lógica de exportación (CSV, PDF, etc.)
    console.log("📄 Exportando reporte...");
    alert("Función de exportación en desarrollo");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Historial de Servicios</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CoinsIcon className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">{totalFacturado.toFixed(2)} Q</div>
              </div>
              <p className="text-xs text-muted-foreground">Facturas activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{facturasFiltradas.length}</div>
              </div>
              <p className="text-xs text-muted-foreground">Registradas en el sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Facturas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">{facturasActivas}</div>
              </div>
              <p className="text-xs text-muted-foreground">Estado activo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{ticketPromedio.toFixed(2)} Q</div>
              </div>
              <p className="text-xs text-muted-foreground">Por factura</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de facturas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registro de Facturas</CardTitle>
                <CardDescription>Historial completo de servicios facturados</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar factura..."
                    className="w-64 pl-8"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={cargarDatos}>
                  🔄 Recargar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-8">
                <p className="text-lg">⏳ Cargando facturas...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 my-4">
                <p className="text-red-700 font-semibold">❌ {error}</p>
              </div>
            )}

            {!loading && !error && facturasFiltradas.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                📋 No hay facturas registradas.
              </p>
            )}

            {!loading && !error && facturasFiltradas.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facturasFiltradas.map((factura) => (
                    <TableRow key={factura.idFactura}>
                      <TableCell className="font-mono text-sm font-medium">
                        {factura.noFactura}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {factura.fechaFactura || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {factura.clienteNombre || "Sin cliente"}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            {factura.vehiculoMarca} {factura.vehiculoModelo}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {factura.vehiculoPlaca || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs text-sm text-muted-foreground">
                          {factura.descripcionFactura || factura.descripcionOrden || "Sin descripción"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {(factura.totalFactura || 0).toFixed(2)} Q
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {factura.estadoOrden || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={estadoColors[factura.estadoRegistro as keyof typeof estadoColors]}
                        >
                          {estadoLabels[factura.estadoRegistro as keyof typeof estadoLabels] || "Desconocido"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
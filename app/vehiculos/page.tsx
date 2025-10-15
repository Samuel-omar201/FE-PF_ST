"use client";

import { useEffect, useState } from "react";
import {
  getVehiculosDetallados,
  getClientes,
  crearVehiculo,
  actualizarVehiculo,
  desactivarVehiculo,
  VehiculoDetallado,
  Cliente,
} from "@/lib/services/vehiculosService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<VehiculoDetallado[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState<VehiculoDetallado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados del formulario
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoEditando, setVehiculoEditando] = useState<VehiculoDetallado | null>(null);
  
  // Campos del formulario
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [anioModelo, setAnioModelo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarVehiculos();
  }, [busqueda, vehiculos]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [vehiculosData, clientesData] = await Promise.all([
        getVehiculosDetallados(),
        getClientes(),
      ]);
      
      setVehiculos(vehiculosData);
      setVehiculosFiltrados(vehiculosData);
      setClientes(clientesData);
      
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(err instanceof Error ? err.message : "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const filtrarVehiculos = () => {
    if (!busqueda.trim()) {
      setVehiculosFiltrados(vehiculos);
      return;
    }

    const busquedaLower = busqueda.toLowerCase();
    const filtrados = vehiculos.filter((v) =>
      v.placa?.toLowerCase().includes(busquedaLower) ||
      v.marca?.toLowerCase().includes(busquedaLower) ||
      v.modelo?.toLowerCase().includes(busquedaLower) ||
      v.clienteNombre?.toLowerCase().includes(busquedaLower)
    );
    setVehiculosFiltrados(filtrados);
  };

  const abrirDialogNuevo = () => {
    limpiarFormulario();
    setModoEdicion(false);
    setVehiculoEditando(null);
    setDialogOpen(true);
  };

  const abrirDialogEditar = (vehiculo: VehiculoDetallado) => {
    setModoEdicion(true);
    setVehiculoEditando(vehiculo);
    setClienteSeleccionado(vehiculo.idCliente?.toString() || "");
    setPlaca(vehiculo.placa || "");
    setMarca(vehiculo.marca || "");
    setModelo(vehiculo.modelo || "");
    setColor(vehiculo.color || "");
    setAnioModelo(vehiculo.anioModelo || "");
    setDescripcion(vehiculo.descripcion || "");
    setDialogOpen(true);
  };

  const limpiarFormulario = () => {
    setClienteSeleccionado("");
    setPlaca("");
    setMarca("");
    setModelo("");
    setColor("");
    setAnioModelo("");
    setDescripcion("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteSeleccionado) {
      alert("Por favor selecciona un cliente");
      return;
    }

    try {
      const data = {
        ttClienteIdCliente: parseInt(clienteSeleccionado),
        placa: placa || undefined,
        marca: marca || undefined,
        modelo: modelo || undefined,
        color: color || undefined,
        anioModelo: anioModelo || undefined,
        descripcion: descripcion || undefined,
      };

      if (modoEdicion && vehiculoEditando) {
        await actualizarVehiculo({
          ...data,
          idVehiculo: vehiculoEditando.idVehiculo,
          estadoRegistro: vehiculoEditando.estadoRegistro,
        });
        alert("✅ Vehículo actualizado correctamente");
      } else {
        await crearVehiculo(data);
        alert("✅ Vehículo creado correctamente");
      }

      setDialogOpen(false);
      limpiarFormulario();
      cargarDatos();
      
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Error al guardar el vehículo");
    }
  };

  const handleDesactivar = async (idVehiculo: number) => {
    if (!confirm("¿Estás seguro de desactivar este vehículo?")) return;

    try {
      await desactivarVehiculo(idVehiculo);
      alert("✅ Vehículo desactivado correctamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al desactivar:", error);
      alert("❌ Error al desactivar el vehículo");
    }
  };

  // Estadísticas
  const totalActivos = vehiculosFiltrados.filter((v) => v.estadoRegistro === "1").length;
  const totalInactivos = vehiculosFiltrados.filter((v) => v.estadoRegistro === "0").length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Gestión de Vehículos</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={abrirDialogNuevo}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Vehículo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {modoEdicion ? "Editar Vehículo" : "Nuevo Vehículo"}
                </DialogTitle>
                <DialogDescription>
                  {modoEdicion
                    ? "Actualiza la información del vehículo"
                    : "Completa los datos del nuevo vehículo"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select value={clienteSeleccionado} onValueChange={setClienteSeleccionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.idCliente} value={cliente.idCliente.toString()}>
                          {cliente.primerNombre} {cliente.primerApellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value)}
                      placeholder="ABC-123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      placeholder="Toyota, Honda, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      placeholder="Corolla, Civic, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anioModelo">Año</Label>
                    <Input
                      id="anioModelo"
                      value={anioModelo}
                      onChange={(e) => setAnioModelo(e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Rojo, Azul, Negro, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Información adicional del vehículo"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {modoEdicion ? "Actualizar" : "Crear"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehiculosFiltrados.length}</div>
              <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Vehículos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalActivos}</div>
              <p className="text-xs text-muted-foreground">Estado activo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Vehículos Inactivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalInactivos}</div>
              <p className="text-xs text-muted-foreground">Estado inactivo</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Vehículos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Vehículos</CardTitle>
                <CardDescription>Gestiona todos los vehículos registrados</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por placa, marca, modelo..."
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
                <p className="text-lg">⏳ Cargando vehículos...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 my-4">
                <p className="text-red-700 font-semibold">❌ {error}</p>
              </div>
            )}

            {!loading && !error && vehiculosFiltrados.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                📋 No hay vehículos registrados.
              </p>
            )}

            {!loading && !error && vehiculosFiltrados.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculosFiltrados.map((vehiculo) => (
                    <TableRow key={vehiculo.idVehiculo}>
                      <TableCell className="font-medium">{vehiculo.idVehiculo}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {vehiculo.placa || "N/A"}
                      </TableCell>
                      <TableCell>{vehiculo.marca || "N/A"}</TableCell>
                      <TableCell>{vehiculo.modelo || "N/A"}</TableCell>
                      <TableCell>{vehiculo.anioModelo || "N/A"}</TableCell>
                      <TableCell>{vehiculo.color || "N/A"}</TableCell>
                      <TableCell>{vehiculo.clienteNombre}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            vehiculo.estadoRegistro === "1"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                        >
                          {vehiculo.estadoRegistro === "1" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirDialogEditar(vehiculo)}
                            disabled={vehiculo.estadoRegistro === "0"}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDesactivar(vehiculo.idVehiculo)}
                            disabled={vehiculo.estadoRegistro === "0"}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
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
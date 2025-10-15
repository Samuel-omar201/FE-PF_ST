"use client";

import { useState } from "react";
import { crearUsuario, CrearUsuarioData } from "@/lib/services/usuariosService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, User, Wrench } from "lucide-react";

export default function CrearUsuarioPage() {
  const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "tecnico">("cliente");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null);

  // Datos del usuario
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correoPrincipal, setCorreoPrincipal] = useState("");
  const [correoSecundario, setCorreoSecundario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");

  // Datos del Cliente
  const [clientePrimerNombre, setClientePrimerNombre] = useState("");
  const [clienteSegundoNombre, setClienteSegundoNombre] = useState("");
  const [clientePrimerApellido, setClientePrimerApellido] = useState("");
  const [clienteSegundoApellido, setClienteSegundoApellido] = useState("");
  const [clienteFechaNacimiento, setClienteFechaNacimiento] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [clienteDireccion, setClienteDireccion] = useState("");
  const [clienteDpi, setClienteDpi] = useState("");

  // Datos del Técnico
  const [tecnicoPrimerNombre, setTecnicoPrimerNombre] = useState("");
  const [tecnicoSegundoNombre, setTecnicoSegundoNombre] = useState("");
  const [tecnicoPrimerApellido, setTecnicoPrimerApellido] = useState("");
  const [tecnicoSegundoApellido, setTecnicoSegundoApellido] = useState("");
  const [tecnicoCarnetEmpleado, setTecnicoCarnetEmpleado] = useState("");
  const [tecnicoTelefono, setTecnicoTelefono] = useState("");
  const [tecnicoDpi, setTecnicoDpi] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    // Validaciones
    if (!nombreUsuario || !correoPrincipal || !contraseña) {
      setMensaje({ tipo: "error", texto: "Por favor completa los campos obligatorios del usuario" });
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden" });
      return;
    }

    if (tipoUsuario === "cliente") {
      if (!clientePrimerNombre || !clientePrimerApellido || !clienteTelefono) {
        setMensaje({ tipo: "error", texto: "Por favor completa los campos obligatorios del cliente" });
        return;
      }
    } else {
      if (!tecnicoPrimerNombre || !tecnicoPrimerApellido || !tecnicoCarnetEmpleado || !tecnicoTelefono) {
        setMensaje({ tipo: "error", texto: "Por favor completa los campos obligatorios del técnico" });
        return;
      }
    }

    try {
      setLoading(true);

      const data: CrearUsuarioData = {
        nombreUsuario,
        correoPrincipal,
        correoSecundario: correoSecundario || undefined,
        contraseña,
        tipoUsuario,
      };

      if (tipoUsuario === "cliente") {
        data.clientePrimerNombre = clientePrimerNombre;
        data.clienteSegundoNombre = clienteSegundoNombre || undefined;
        data.clientePrimerApellido = clientePrimerApellido;
        data.clienteSegundoApellido = clienteSegundoApellido || undefined;
        data.clienteFechaNacimiento = clienteFechaNacimiento || undefined;
        data.clienteTelefono = parseInt(clienteTelefono);
        data.clienteDireccion = clienteDireccion || undefined;
        data.clienteDpi = clienteDpi ? parseInt(clienteDpi) : undefined;
      } else {
        data.tecnicoPrimerNombre = tecnicoPrimerNombre;
        data.tecnicoSegundoNombre = tecnicoSegundoNombre || undefined;
        data.tecnicoPrimerApellido = tecnicoPrimerApellido;
        data.tecnicoSegundoApellido = tecnicoSegundoApellido || undefined;
        data.tecnicoCarnetEmpleado = tecnicoCarnetEmpleado;
        data.tecnicoTelefono = parseInt(tecnicoTelefono);
        data.tecnicoDpi = tecnicoDpi ? parseInt(tecnicoDpi) : undefined;
      }

      const response = await crearUsuario(data);

      if (response.success) {
        setMensaje({ tipo: "success", texto: `✅ ${response.message}` });
        limpiarFormulario();
      } else {
        setMensaje({ tipo: "error", texto: `❌ ${response.message}` });
      }

    } catch (error) {
      console.error("Error al crear usuario:", error);
      setMensaje({ 
        tipo: "error", 
        texto: error instanceof Error ? error.message : "Error al crear el usuario" 
      });
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setNombreUsuario("");
    setCorreoPrincipal("");
    setCorreoSecundario("");
    setContraseña("");
    setConfirmarContraseña("");
    setClientePrimerNombre("");
    setClienteSegundoNombre("");
    setClientePrimerApellido("");
    setClienteSegundoApellido("");
    setClienteFechaNacimiento("");
    setClienteTelefono("");
    setClienteDireccion("");
    setClienteDpi("");
    setTecnicoPrimerNombre("");
    setTecnicoSegundoNombre("");
    setTecnicoPrimerApellido("");
    setTecnicoSegundoApellido("");
    setTecnicoCarnetEmpleado("");
    setTecnicoTelefono("");
    setTecnicoDpi("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center px-6">
          <h1 className="text-2xl font-bold">Crear Nuevo Usuario</h1>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mensajes */}
          {mensaje && (
            <Card className={mensaje.tipo === "success" ? "border-green-500" : "border-red-500"}>
              <CardContent className="pt-6">
                <p className={mensaje.tipo === "success" ? "text-green-700" : "text-red-700"}>
                  {mensaje.texto}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Selector de Tipo de Usuario */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Usuario</CardTitle>
              <CardDescription>Selecciona si el usuario será un cliente o un técnico</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={tipoUsuario}
                onValueChange={(value) => setTipoUsuario(value as "cliente" | "tecnico")}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="cliente"
                  className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    tipoUsuario === "cliente" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="cliente" id="cliente" className="sr-only" />
                  <User className="mb-3 h-6 w-6" />
                  <span className="font-semibold">Cliente</span>
                </Label>

                <Label
                  htmlFor="tecnico"
                  className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    tipoUsuario === "tecnico" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem value="tecnico" id="tecnico" className="sr-only" />
                  <Wrench className="mb-3 h-6 w-6" />
                  <span className="font-semibold">Técnico</span>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Datos del Usuario */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Acceso</CardTitle>
              <CardDescription>Información para el inicio de sesión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreUsuario">Nombre de Usuario *</Label>
                  <Input
                    id="nombreUsuario"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    placeholder="usuario123"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correoPrincipal">Correo Principal *</Label>
                  <Input
                    id="correoPrincipal"
                    type="email"
                    value={correoPrincipal}
                    onChange={(e) => setCorreoPrincipal(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="correoSecundario">Correo Secundario</Label>
                <Input
                  id="correoSecundario"
                  type="email"
                  value={correoSecundario}
                  onChange={(e) => setCorreoSecundario(e.target.value)}
                  placeholder="correo2@ejemplo.com (opcional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contraseña">Contraseña *</Label>
                  <Input
                    id="contraseña"
                    type="password"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarContraseña">Confirmar Contraseña *</Label>
                  <Input
                    id="confirmarContraseña"
                    type="password"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Cliente */}
          {tipoUsuario === "cliente" && (
            <Card>
              <CardHeader>
                <CardTitle>Datos del Cliente</CardTitle>
                <CardDescription>Información personal del cliente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientePrimerNombre">Primer Nombre *</Label>
                    <Input
                      id="clientePrimerNombre"
                      value={clientePrimerNombre}
                      onChange={(e) => setClientePrimerNombre(e.target.value)}
                      placeholder="Juan"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clienteSegundoNombre">Segundo Nombre</Label>
                    <Input
                      id="clienteSegundoNombre"
                      value={clienteSegundoNombre}
                      onChange={(e) => setClienteSegundoNombre(e.target.value)}
                      placeholder="Carlos (opcional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientePrimerApellido">Primer Apellido *</Label>
                    <Input
                      id="clientePrimerApellido"
                      value={clientePrimerApellido}
                      onChange={(e) => setClientePrimerApellido(e.target.value)}
                      placeholder="Pérez"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clienteSegundoApellido">Segundo Apellido</Label>
                    <Input
                      id="clienteSegundoApellido"
                      value={clienteSegundoApellido}
                      onChange={(e) => setClienteSegundoApellido(e.target.value)}
                      placeholder="González (opcional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clienteFechaNacimiento">Fecha de Nacimiento</Label>
                    <Input
                      id="clienteFechaNacimiento"
                      type="date"
                      value={clienteFechaNacimiento}
                      onChange={(e) => setClienteFechaNacimiento(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clienteTelefono">Teléfono *</Label>
                    <Input
                      id="clienteTelefono"
                      type="number"
                      value={clienteTelefono}
                      onChange={(e) => setClienteTelefono(e.target.value)}
                      placeholder="12345678"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clienteDireccion">Dirección</Label>
                  <Input
                    id="clienteDireccion"
                    value={clienteDireccion}
                    onChange={(e) => setClienteDireccion(e.target.value)}
                    placeholder="Calle, Zona, Ciudad"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clienteDpi">DPI</Label>
                  <Input
                    id="clienteDpi"
                    type="number"
                    value={clienteDpi}
                    onChange={(e) => setClienteDpi(e.target.value)}
                    placeholder="1234567890123"
                    maxLength={13}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulario de Técnico */}
          {tipoUsuario === "tecnico" && (
            <Card>
              <CardHeader>
                <CardTitle>Datos del Técnico</CardTitle>
                <CardDescription>Información del empleado técnico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tecnicoPrimerNombre">Primer Nombre *</Label>
                    <Input
                      id="tecnicoPrimerNombre"
                      value={tecnicoPrimerNombre}
                      onChange={(e) => setTecnicoPrimerNombre(e.target.value)}
                      placeholder="Roberto"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tecnicoSegundoNombre">Segundo Nombre</Label>
                    <Input
                      id="tecnicoSegundoNombre"
                      value={tecnicoSegundoNombre}
                      onChange={(e) => setTecnicoSegundoNombre(e.target.value)}
                      placeholder="Luis (opcional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tecnicoPrimerApellido">Primer Apellido *</Label>
                    <Input
                      id="tecnicoPrimerApellido"
                      value={tecnicoPrimerApellido}
                      onChange={(e) => setTecnicoPrimerApellido(e.target.value)}
                      placeholder="Martínez"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tecnicoSegundoApellido">Segundo Apellido</Label>
                    <Input
                      id="tecnicoSegundoApellido"
                      value={tecnicoSegundoApellido}
                      onChange={(e) => setTecnicoSegundoApellido(e.target.value)}
                      placeholder="Silva (opcional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tecnicoCarnetEmpleado">Carnet de Empleado *</Label>
                    <Input
                      id="tecnicoCarnetEmpleado"
                      value={tecnicoCarnetEmpleado}
                      onChange={(e) => setTecnicoCarnetEmpleado(e.target.value)}
                      placeholder="EMP-001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tecnicoTelefono">Teléfono *</Label>
                    <Input
                      id="tecnicoTelefono"
                      type="number"
                      value={tecnicoTelefono}
                      onChange={(e) => setTecnicoTelefono(e.target.value)}
                      placeholder="12345678"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tecnicoDpi">DPI</Label>
                  <Input
                    id="tecnicoDpi"
                    type="number"
                    value={tecnicoDpi}
                    onChange={(e) => setTecnicoDpi(e.target.value)}
                    placeholder="1234567890123"
                    maxLength={13}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={limpiarFormulario}
              disabled={loading}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={loading}>
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
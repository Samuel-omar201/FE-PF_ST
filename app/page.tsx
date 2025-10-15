"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Package, FileText, TrendingUp, Car, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { usuario } = useAuth();

  if (!usuario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Renderizar dashboard según el rol
  switch (usuario.rolPrincipal) {
    case "Administrador":
      return <DashboardAdministrador usuario={usuario} />;
    case "Recepcionista":
      return <DashboardRecepcionista usuario={usuario} />;
    case "Tecnico":
      return <DashboardTecnico usuario={usuario} />;
    case "Cliente":
      return <DashboardCliente usuario={usuario} />;
    default:
      return <DashboardGenerico usuario={usuario} />;
  }
}

// ========== Dashboard para Administrador ==========
function DashboardAdministrador({ usuario }: any) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
            <p className="text-sm text-muted-foreground">Bienvenido, {usuario.nombreCompleto}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Métricas principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reparaciones Activas</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 desde ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artículos en Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">15 por debajo del mínimo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios del Mes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,500</div>
              <p className="text-xs text-muted-foreground">+8% vs mes anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Accesos rápidos y estado */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Acceso Rápido</CardTitle>
              <CardDescription>Gestiona las funciones principales del sistema</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Link href="/reparaciones">
                <Button variant="outline" className="h-24 w-full flex-col gap-2 bg-transparent hover:bg-accent">
                  <Wrench className="h-6 w-6" />
                  <span>Reparaciones</span>
                </Button>
              </Link>
              <Link href="/vehiculos">
                <Button variant="outline" className="h-24 w-full flex-col gap-2 bg-transparent hover:bg-accent">
                  <Car className="h-6 w-6" />
                  <span>Vehículos</span>
                </Button>
              </Link>
              <Link href="/historial">
                <Button variant="outline" className="h-24 w-full flex-col gap-2 bg-transparent hover:bg-accent">
                  <FileText className="h-6 w-6" />
                  <span>Historial</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>Información general del taller</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Capacidad</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Técnicos Activos</span>
                <span className="text-sm font-medium">8/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tiempo Promedio</span>
                <span className="text-sm font-medium">3.5 días</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ========== Dashboard para Recepcionista ==========
function DashboardRecepcionista({ usuario }: any) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold">Panel de Recepción</h1>
            <p className="text-sm text-muted-foreground">Bienvenido, {usuario.nombreCompleto}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Métricas relevantes para recepción */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">5 pendientes, 3 completados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehículos en Taller</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Capacidad al 75%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregas Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 pendientes de entrega</p>
            </CardContent>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Acceso Rápido</CardTitle>
              <CardDescription>Funciones principales de recepción</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Link href="/reparaciones">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-accent">
                  <Wrench className="h-5 w-5" />
                  <span>Reparaciones</span>
                </Button>
              </Link>
              <Link href="/vehiculos">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-accent">
                  <Car className="h-5 w-5" />
                  <span>Vehículos</span>
                </Button>
              </Link>
              <Link href="/historial">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-accent">
                  <FileText className="h-5 w-5" />
                  <span>Historial</span>
                </Button>
              </Link>
              <Link href="/inventario">
                <Button variant="outline" className="h-20 w-full flex-col gap-2 hover:bg-accent">
                  <Package className="h-5 w-5" />
                  <span>Inventario</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tareas Pendientes</CardTitle>
              <CardDescription>Actividades del día</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Contactar cliente para aprobación</p>
                  <p className="text-xs text-muted-foreground">Vehículo ABC-123</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Preparar entrega</p>
                  <p className="text-xs text-muted-foreground">Vehículo XYZ-789</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Recepción programada 15:00</p>
                  <p className="text-xs text-muted-foreground">Cliente: Juan Pérez</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ========== Dashboard para Técnico ==========
function DashboardTecnico({ usuario }: any) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold">Panel de Técnico</h1>
            <p className="text-sm text-muted-foreground">Bienvenido, {usuario.nombreCompleto}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Métricas del técnico */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trabajos Asignados</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 en progreso, 2 pendientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">+1 vs ayer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
              <p className="text-xs text-muted-foreground">Por reparación</p>
            </CardContent>
          </Card>
        </div>

        {/* Trabajos asignados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mis Trabajos</CardTitle>
                <CardDescription>Reparaciones asignadas</CardDescription>
              </div>
              <Link href="/reparaciones">
                <Button variant="outline" size="sm">Ver Todos</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
              <div>
                <p className="font-medium">Toyota Corolla 2020</p>
                <p className="text-sm text-muted-foreground">ABC-123 • Cambio de aceite</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-600">En Progreso</p>
                <p className="text-xs text-muted-foreground">60% completado</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
              <div>
                <p className="font-medium">Honda Civic 2019</p>
                <p className="text-sm text-muted-foreground">XYZ-789 • Reparación de frenos</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">Pendiente</p>
                <p className="text-xs text-muted-foreground">Inicio hoy 14:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========== Dashboard para Cliente ==========
function DashboardCliente({ usuario }: any) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold">Mi Panel</h1>
            <p className="text-sm text-muted-foreground">Bienvenido, {usuario.nombreCompleto}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6 max-w-5xl mx-auto">
        {/* Información del cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Mis Vehículos</CardTitle>
            <CardDescription>Seguimiento de servicios y reparaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 hover:bg-accent">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Car className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Toyota Corolla 2020</p>
                    <p className="text-sm text-muted-foreground">Placa: ABC-123</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                    En Reparación
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">Estimado: 2 días</p>
                </div>
              </div>
              <div className="mt-3 pl-8">
                <p className="text-sm">Servicio: Cambio de aceite y filtros</p>
                <p className="text-sm text-muted-foreground">Técnico: Carlos Méndez</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 hover:bg-accent">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Car className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Honda Civic 2019</p>
                    <p className="text-sm text-muted-foreground">Placa: XYZ-789</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                    Sin Servicios
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">Último servicio hace 3 meses</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial reciente */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historial Reciente</CardTitle>
                <CardDescription>Últimos servicios realizados</CardDescription>
              </div>
              <Link href="/reparaciones">
                <Button variant="outline" size="sm">Ver Todo</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Cambio de llantas</p>
                <p className="text-xs text-muted-foreground">Toyota Corolla • 15/01/2025</p>
              </div>
              <p className="text-sm font-semibold">$340.00</p>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Mantenimiento preventivo</p>
                <p className="text-xs text-muted-foreground">Honda Civic • 10/12/2024</p>
              </div>
              <p className="text-sm font-semibold">$150.00</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm"><span className="font-medium">Teléfono:</span> (502) 1234-5678</p>
            <p className="text-sm"><span className="font-medium">Email:</span> {usuario.correoPrincipal}</p>
            <p className="text-sm"><span className="font-medium">Dirección:</span> Zona 10, Ciudad de Guatemala</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========== Dashboard Genérico (fallback) ==========
function DashboardGenerico({ usuario }: any) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Bienvenido al Sistema</CardTitle>
          <CardDescription>
            Hola, {usuario.nombreCompleto}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tu rol: <span className="font-semibold">{usuario.rolPrincipal}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Usa el menú lateral para navegar por el sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
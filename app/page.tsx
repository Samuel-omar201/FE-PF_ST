import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Package, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center px-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Acceso Rápido</CardTitle>
              <CardDescription>Accede a las funciones principales del sistema</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Link href="/reparaciones">
                <Button variant="outline" className="h-24 w-full flex-col gap-2 bg-transparent">
                  <Wrench className="h-6 w-6" />
                  <span>Reparaciones</span>
                </Button>
              </Link>
              <Link href="/inventario">
                <Button variant="outline" className="h-24 w-full flex-col gap-2 bg-transparent">
                  <Package className="h-6 w-6" />
                  <span>Inventario</span>
                </Button>
              </Link>
              <Link href="/historial">
                <Button variant="outline" className="h-24 w-full flex-col gap-2 bg-transparent">
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
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, User, Car, Plus } from "lucide-react"

const reparaciones = [
  {
    id: 1,
    vehiculo: "Toyota Corolla 2020",
    placa: "ABC-123",
    cliente: "Juan Pérez",
    servicio: "Cambio de aceite y filtros",
    progreso: 100,
    estado: "completado",
    tecnico: "Carlos Méndez",
    fechaIngreso: "2024-01-15",
    fechaEstimada: "2024-01-15",
  },
  {
    id: 2,
    vehiculo: "Honda Civic 2019",
    placa: "XYZ-789",
    cliente: "María González",
    servicio: "Reparación de frenos",
    progreso: 75,
    estado: "en-proceso",
    tecnico: "Roberto Silva",
    fechaIngreso: "2024-01-14",
    fechaEstimada: "2024-01-16",
  },
  {
    id: 3,
    vehiculo: "Ford F-150 2021",
    placa: "DEF-456",
    cliente: "Pedro Ramírez",
    servicio: "Revisión de motor",
    progreso: 45,
    estado: "en-proceso",
    tecnico: "Carlos Méndez",
    fechaIngreso: "2024-01-13",
    fechaEstimada: "2024-01-17",
  },
  {
    id: 4,
    vehiculo: "Chevrolet Spark 2018",
    placa: "GHI-321",
    cliente: "Ana Martínez",
    servicio: "Cambio de llantas",
    progreso: 30,
    estado: "en-proceso",
    tecnico: "Luis Torres",
    fechaIngreso: "2024-01-15",
    fechaEstimada: "2024-01-16",
  },
  {
    id: 5,
    vehiculo: "Nissan Sentra 2022",
    placa: "JKL-654",
    cliente: "Carlos López",
    servicio: "Mantenimiento preventivo",
    progreso: 0,
    estado: "pendiente",
    tecnico: "Sin asignar",
    fechaIngreso: "2024-01-15",
    fechaEstimada: "2024-01-18",
  },
]

const estadoColors = {
  completado: "bg-green-500/10 text-green-500 border-green-500/20",
  "en-proceso": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pendiente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

const estadoLabels = {
  completado: "Completado",
  "en-proceso": "En Proceso",
  pendiente: "Pendiente",
}

export default function ReparacionesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Reparaciones de Vehículos</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Reparación
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Reparaciones en curso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completadas Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Vehículos listos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5 días</div>
              <p className="text-xs text-muted-foreground">Por reparación</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {reparaciones.map((reparacion) => (
            <Card key={reparacion.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{reparacion.vehiculo}</CardTitle>
                      <Badge variant="outline" className={estadoColors[reparacion.estado as keyof typeof estadoColors]}>
                        {estadoLabels[reparacion.estado as keyof typeof estadoLabels]}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Car className="h-3 w-3" />
                      Placa: {reparacion.placa}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Cliente:</span>
                      <span className="font-medium">{reparacion.cliente}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Técnico:</span>
                      <span className="font-medium">{reparacion.tecnico}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Ingreso:</span>
                      <span className="font-medium">{reparacion.fechaIngreso}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Entrega estimada:</span>
                      <span className="font-medium">{reparacion.fechaEstimada}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{reparacion.servicio}</span>
                    <span className="text-muted-foreground">{reparacion.progreso}%</span>
                  </div>
                  <Progress value={reparacion.progreso} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

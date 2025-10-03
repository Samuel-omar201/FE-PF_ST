import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, FileText, DollarSign, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const historial = [
  {
    id: "FAC-2024-001",
    fecha: "2024-01-15",
    cliente: "Juan Pérez",
    vehiculo: "Toyota Corolla 2020",
    placa: "ABC-123",
    servicios: ["Cambio de aceite", "Cambio de filtros"],
    monto: 85.5,
    metodoPago: "Tarjeta",
    estado: "pagado",
  },
  {
    id: "FAC-2024-002",
    fecha: "2024-01-14",
    cliente: "María González",
    vehiculo: "Honda Civic 2019",
    placa: "XYZ-789",
    servicios: ["Reparación de frenos", "Alineación"],
    monto: 320.0,
    metodoPago: "Efectivo",
    estado: "pagado",
  },
  {
    id: "FAC-2024-003",
    fecha: "2024-01-13",
    cliente: "Pedro Ramírez",
    vehiculo: "Ford F-150 2021",
    placa: "DEF-456",
    servicios: ["Revisión de motor", "Cambio de bujías"],
    monto: 450.0,
    metodoPago: "Transferencia",
    estado: "pagado",
  },
  {
    id: "FAC-2024-004",
    fecha: "2024-01-12",
    cliente: "Ana Martínez",
    vehiculo: "Chevrolet Spark 2018",
    placa: "GHI-321",
    servicios: ["Cambio de llantas"],
    monto: 340.0,
    metodoPago: "Tarjeta",
    estado: "pagado",
  },
  {
    id: "FAC-2024-005",
    fecha: "2024-01-11",
    cliente: "Carlos López",
    vehiculo: "Nissan Sentra 2022",
    placa: "JKL-654",
    servicios: ["Mantenimiento preventivo"],
    monto: 150.0,
    metodoPago: "Efectivo",
    estado: "pendiente",
  },
  {
    id: "FAC-2024-006",
    fecha: "2024-01-10",
    cliente: "Laura Sánchez",
    vehiculo: "Mazda 3 2020",
    placa: "MNO-987",
    servicios: ["Cambio de aceite", "Rotación de llantas"],
    monto: 95.0,
    metodoPago: "Tarjeta",
    estado: "pagado",
  },
  {
    id: "FAC-2024-007",
    fecha: "2024-01-09",
    cliente: "Roberto Díaz",
    vehiculo: "Hyundai Elantra 2021",
    placa: "PQR-456",
    servicios: ["Reparación de suspensión"],
    monto: 280.0,
    metodoPago: "Transferencia",
    estado: "pagado",
  },
  {
    id: "FAC-2024-008",
    fecha: "2024-01-08",
    cliente: "Sofía Herrera",
    vehiculo: "Kia Rio 2019",
    placa: "STU-123",
    servicios: ["Cambio de batería", "Revisión eléctrica"],
    monto: 185.0,
    metodoPago: "Efectivo",
    estado: "pagado",
  },
]

const estadoColors = {
  pagado: "bg-green-500/10 text-green-500 border-green-500/20",
  pendiente: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

const estadoLabels = {
  pagado: "Pagado",
  pendiente: "Pendiente",
}

export default function HistorialPage() {
  const totalFacturado = historial.filter((item) => item.estado === "pagado").reduce((sum, item) => sum + item.monto, 0)
  const totalPendiente = historial
    .filter((item) => item.estado === "pendiente")
    .reduce((sum, item) => sum + item.monto, 0)
  const serviciosCompletados = historial.filter((item) => item.estado === "pagado").length

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Historial de Servicios</h1>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Facturado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">${totalFacturado.toFixed(2)}</div>
              </div>
              <p className="text-xs text-muted-foreground">Servicios pagados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <div className="text-2xl font-bold">${totalPendiente.toFixed(2)}</div>
              </div>
              <p className="text-xs text-muted-foreground">Pagos pendientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Servicios Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{serviciosCompletados}</div>
              </div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">${(totalFacturado / serviciosCompletados).toFixed(2)}</div>
              </div>
              <p className="text-xs text-muted-foreground">Por servicio</p>
            </CardContent>
          </Card>
        </div>

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
                  <Input placeholder="Buscar factura..." className="w-64 pl-8" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factura</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Servicios</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm font-medium">{item.id}</TableCell>
                    <TableCell className="text-muted-foreground">{item.fecha}</TableCell>
                    <TableCell className="font-medium">{item.cliente}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{item.vehiculo}</div>
                        <div className="text-xs text-muted-foreground">{item.placa}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs space-y-1">
                        {item.servicios.map((servicio, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {servicio}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.metodoPago}</TableCell>
                    <TableCell className="text-right font-semibold">${item.monto.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={estadoColors[item.estado as keyof typeof estadoColors]}>
                        {estadoLabels[item.estado as keyof typeof estadoLabels]}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const inventario = [
  {
    id: 1,
    codigo: "ACE-001",
    nombre: "Aceite Motor 5W-30",
    categoria: "Lubricantes",
    cantidad: 45,
    minimo: 20,
    precio: 25.99,
    ubicacion: "Estante A-1",
    estado: "normal",
  },
  {
    id: 2,
    codigo: "FIL-002",
    nombre: "Filtro de Aceite",
    categoria: "Filtros",
    cantidad: 12,
    minimo: 15,
    precio: 8.5,
    ubicacion: "Estante B-2",
    estado: "bajo",
  },
  {
    id: 3,
    codigo: "FRE-003",
    nombre: "Pastillas de Freno",
    categoria: "Frenos",
    cantidad: 28,
    minimo: 10,
    precio: 45.0,
    ubicacion: "Estante C-1",
    estado: "normal",
  },
  {
    id: 4,
    codigo: "LLA-004",
    nombre: "Llanta 185/65 R15",
    categoria: "Llantas",
    cantidad: 8,
    minimo: 12,
    precio: 85.0,
    ubicacion: "Bodega 1",
    estado: "bajo",
  },
  {
    id: 5,
    codigo: "BAT-005",
    nombre: "Batería 12V 60Ah",
    categoria: "Baterías",
    cantidad: 5,
    minimo: 8,
    precio: 120.0,
    ubicacion: "Bodega 2",
    estado: "bajo",
  },
  {
    id: 6,
    codigo: "BUJ-006",
    nombre: "Bujías NGK",
    categoria: "Encendido",
    cantidad: 64,
    minimo: 30,
    precio: 12.5,
    ubicacion: "Estante A-3",
    estado: "normal",
  },
  {
    id: 7,
    codigo: "COR-007",
    nombre: "Correa de Distribución",
    categoria: "Transmisión",
    cantidad: 3,
    minimo: 5,
    precio: 65.0,
    ubicacion: "Estante D-1",
    estado: "critico",
  },
  {
    id: 8,
    codigo: "REF-008",
    nombre: "Refrigerante",
    categoria: "Líquidos",
    cantidad: 38,
    minimo: 15,
    precio: 18.0,
    ubicacion: "Estante A-2",
    estado: "normal",
  },
]

const estadoColors = {
  normal: "bg-green-500/10 text-green-500 border-green-500/20",
  bajo: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  critico: "bg-red-500/10 text-red-500 border-red-500/20",
}

const estadoLabels = {
  normal: "Normal",
  bajo: "Stock Bajo",
  critico: "Crítico",
}

export default function InventarioPage() {
  const totalArticulos = inventario.reduce((sum, item) => sum + item.cantidad, 0)
  const articulosBajos = inventario.filter((item) => item.estado === "bajo" || item.estado === "critico").length
  const valorTotal = inventario.reduce((sum, item) => sum + item.cantidad * item.precio, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Inventario de Repuestos</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Artículo
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Artículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventario.length}</div>
              <p className="text-xs text-muted-foreground">Tipos de productos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Unidades en Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticulos}</div>
              <p className="text-xs text-muted-foreground">Total de unidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div className="text-2xl font-bold">{articulosBajos}</div>
              </div>
              <p className="text-xs text-muted-foreground">Requieren reorden</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${valorTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">En inventario</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Artículos</CardTitle>
                <CardDescription>Gestiona el inventario de repuestos y accesorios</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar artículo..." className="w-64 pl-8" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Artículo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Mínimo</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventario.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{item.categoria}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.cantidad < item.minimo ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        <span className="font-medium">{item.cantidad}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.minimo}</TableCell>
                    <TableCell className="text-right font-medium">${item.precio.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.ubicacion}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={estadoColors[item.estado as keyof typeof estadoColors]}>
                        {estadoLabels[item.estado as keyof typeof estadoLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Editar
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

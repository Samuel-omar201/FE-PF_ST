export interface Reparacion {
  idOrdenTrabajo: number;
  ttClienteIdCliente: number;
  ttVehiculoIdVehiculo: number;
  fechaRegistro: string;
  estadoRegistro: string;
  descripcionOrden: string;
  costoFinal: string;
  tcEstadoOrdenTrabajoIdEstadoOrdenTrabajo: number;
  fechaInicioOrden: string;
  fechaFinOrden: string;

  // Campos agregados para visualización en el frontend
  clienteNombre?: string;
  vehiculoDescripcion?: string;
}

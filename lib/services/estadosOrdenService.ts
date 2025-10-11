export async function getEstados() {
  const res = await fetch("http://localhost:8090/service/Autex_M1/tcEstadoOrdenTrabajo/getAll");
  if (!res.ok) throw new Error("Error al obtener estados de orden");
  return res.json();
}

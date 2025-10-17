export async function getEstados() {
  const res = await fetch("https://be-pfst-production.up.railway.app/service/Autex_M1/tcEstadoOrdenTrabajo/getAll");
  if (!res.ok) throw new Error("Error al obtener estados de orden");
  return res.json();
}

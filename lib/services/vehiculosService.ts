export async function getVehiculos() {
  const res = await fetch("http://localhost:8090/service/Autex_M1/ttVehiculo/getAll");
  if (!res.ok) throw new Error("Error al obtener vehículos");
  return res.json();
}

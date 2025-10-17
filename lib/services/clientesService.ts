export async function getClientes() {
  const res = await fetch("https://be-pfst-production.up.railway.app/service/Autex_M1/ttCliente/getAll");
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
}

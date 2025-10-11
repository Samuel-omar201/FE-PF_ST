export async function getClientes() {
  const res = await fetch("http://localhost:8090/service/Autex_M1/ttCliente/getAll");
  if (!res.ok) throw new Error("Error al obtener clientes");
  return res.json();
}

// src/config/roleAccess.ts
export const roleAccess: Record<string, string[]> = {
  Administrador: ["*", "/", "/reparaciones", "/historial", "/usuarios/crear", "/vehiculos"],
  Recepcionista: ["/", "/reparaciones", "/historial", "/vehiculos"],
  Tecnico: ["/", "/reparaciones"],
  Cliente: ["/"],
};

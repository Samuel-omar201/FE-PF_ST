"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { roleAccess } from "@/config/roleAccess";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, usuario, isLoading } = useAuth();

  useEffect(() => {
  if (isLoading) return;

  // 1️⃣ Si no está autenticado → al login
  if (!isAuthenticated) {
    router.push("/login");
    return;
  }

  // 2️⃣ Validar permisos por rol
  if (usuario?.rolPrincipal) {
    const rutasPermitidas = roleAccess[usuario.rolPrincipal] || [];

    // 3️⃣ Verifica acceso más preciso
    const tieneAcceso =
      rutasPermitidas.includes("*") ||
      rutasPermitidas.some(
        (ruta) =>
          pathname === ruta || // exacta
          (ruta !== "/" && pathname.startsWith(`${ruta}/`)) // subruta válida
      );

    if (!tieneAcceso) {
      router.push("/"); // redirige al dashboard
      return;
    }
  }
}, [isAuthenticated, usuario, isLoading, pathname, router]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

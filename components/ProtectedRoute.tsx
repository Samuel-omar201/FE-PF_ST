"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
//import { useAuth } from "@/contexts/AuthContext";
import { useAuth } from "@/app/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, usuario, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Si hay roles específicos permitidos, verificar
      if (allowedRoles && allowedRoles.length > 0 && usuario) {
        const hasPermission = allowedRoles.includes(usuario.rolPrincipal);
        
        if (!hasPermission) {
          // Redirigir a página de acceso denegado o dashboard
          router.push("/");
          return;
        }
      }
    }
  }, [isAuthenticated, usuario, isLoading, allowedRoles, router]);

  // Mostrar loading mientras se verifica autenticación
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

  // Si no está autenticado o no tiene permisos, no mostrar nada (se redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Si hay roles permitidos y no tiene permiso, no mostrar nada
  if (allowedRoles && allowedRoles.length > 0 && usuario) {
    const hasPermission = allowedRoles.includes(usuario.rolPrincipal);
    if (!hasPermission) {
      return null;
    }
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}
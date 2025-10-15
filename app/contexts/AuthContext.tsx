"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UsuarioInfo, login as loginService, saveAuth, getUsuario, getToken, logout as logoutService } from "@/lib/services/authService";

interface AuthContextType {
  usuario: UsuarioInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (correo: string, contraseña: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Cargar usuario al iniciar
  useEffect(() => {
    const usuarioGuardado = getUsuario();
    const token = getToken();
    
    if (usuarioGuardado && token) {
      setUsuario(usuarioGuardado);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (correo: string, contraseña: string) => {
    try {
      const response = await loginService({
        correoPrincipal: correo,
        contraseña: contraseña,
      });

      if (response.success && response.token && response.usuario) {
        saveAuth(response.token, response.usuario);
        setUsuario(response.usuario);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: "Error al iniciar sesión" };
    }
  };

  const logout = () => {
    logoutService();
    setUsuario(null);
    router.push("/login");
  };

  const hasRole = (roles: string[]): boolean => {
    if (!usuario) return false;
    return roles.includes(usuario.rolPrincipal);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: usuario !== null,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}
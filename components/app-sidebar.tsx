"use client";

import { Wrench, Package, FileText, Home, CarIcon, User2Icon, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles: string[]; // Roles que pueden ver este item
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    roles: ["Administrador", "Recepcionista", "Tecnico", "Cliente"],
  },
  {
    title: "Reparaciones",
    url: "/reparaciones",
    icon: Wrench,
    roles: ["Administrador", "Recepcionista", "Tecnico"],
  },
  /*{
    title: "Inventario",
    url: "/inventario",
    icon: Package,
    roles: ["Administrador", "Recepcionista"],
  },*/
  {
    title: "Historial",
    url: "/historial",
    icon: FileText,
    roles: ["Administrador", "Recepcionista"],
  },
  {
    title: "Usuarios",
    url: "/usuarios/crear",
    icon: User2Icon,
    roles: ["Administrador"],
  },
  {
    title: "Vehículos",
    url: "/vehiculos",
    icon: CarIcon,
    roles: ["Administrador", "Recepcionista"],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, logout } = useAuth();

  // Filtrar items del menú según el rol del usuario
  const filteredMenuItems = menuItems.filter((item) => {
    if (!usuario) return false;
    return item.roles.includes(usuario.rolPrincipal);
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Autex Pro</h2>
            <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {usuario && (
          <div className="space-y-3">
            <div className="px-2">
              <p className="text-sm font-medium text-sidebar-foreground">
                {usuario.nombreCompleto}
              </p>
              <p className="text-xs text-muted-foreground">{usuario.correoPrincipal}</p>
              <p className="text-xs text-primary font-semibold mt-1">
                Rol: {usuario.rolPrincipal}
              </p>
            </div>
            <SidebarMenuButton onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
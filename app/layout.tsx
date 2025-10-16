"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Si es login, no aplica protección ni sidebar
  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Todas las demás rutas están protegidas
  return (
    <SidebarProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">{children}</main>
        </div>
      </ProtectedRoute>
    </SidebarProvider>
  );
}

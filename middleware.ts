import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login']
  
  // Si es una ruta pública, permitir acceso
  if (publicPaths.includes(pathname)) {
    // Si ya está autenticado y trata de ir a login, redirigir al dashboard
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Si no hay token y trata de acceder a ruta protegida, redirigir a login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si hay token, permitir acceso (la validación de roles se hace en el cliente)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
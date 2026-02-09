import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Ambil cookie session
  const session = request.cookies.get('admin_session')
  
  // Jika user mencoba akses halaman /admin (kecuali login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Pengecualian: Halaman Login boleh diakses
    if (request.nextUrl.pathname === '/admin/login') {
      // Jika sudah login tapi buka halaman login, lempar ke dashboard
      if (session) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Jika TIDAK ADA session, tendang ke Login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Tentukan halaman mana saja yang dijaga
export const config = {
  matcher: '/admin/:path*',
}
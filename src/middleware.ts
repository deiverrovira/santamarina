import { withAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role as string | undefined

    // ── /admin/usuarios → solo admin ─────────────────────────────────────────
    if (pathname.startsWith('/admin/usuarios') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // ── /admin (panel principal y reservas) → solo admin ─────────────────────
    if (pathname === '/admin' && role !== 'admin') {
      // newApartament va directo a sus apartamentos
      if (role === 'newApartament') {
        return NextResponse.redirect(new URL('/admin/apartamentos', req.url))
      }
      return NextResponse.redirect(new URL('/', req.url))
    }

    // ── /admin/apartamentos → admin + newApartament ───────────────────────────
    if (
      pathname.startsWith('/admin/apartamentos') &&
      role !== 'admin' &&
      role !== 'newApartament'
    ) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // authorized se llama primero — si devuelve false → va a /login
      authorized: ({ token }) => !!token,
    },
  }
)

// Rutas que el middleware protege (todo /admin/*)
export const config = {
  matcher: ['/admin', '/admin/:path*'],
}

import Image from 'next/image'
import Link from 'next/link'
import { getSession } from '@/actions/auth'
import NavbarUserMenu from './NavbarUserMenu'

export default async function Navbar() {
  const session = await getSession()
  const user    = session?.user
  const role    = user?.role

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-800 overflow-hidden">
              <Image
                src="/logos/Santa-marina-blanco.png"
                alt="Santa Marina Logo"
                width={100}
                height={100}
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Santa Marina</span>
            <span className="hidden sm:inline text-sm text-gray-400 font-normal">· Conjunto Turístico</span>
          </Link>

          {/* Nav links + user menu */}
          <div className="flex items-center gap-1 sm:gap-4">
            <nav className="flex items-center gap-1 sm:gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
              >
                Inicio
              </Link>
              <Link
                href="/apartamentos"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
              >
                Apartamentos
              </Link>
              <Link
                href="/areas-comunes"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
              >
                Áreas comunes
              </Link>

              {/* Acceso admin — solo si tiene sesión */}
              {role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                >
                  Panel admin
                </Link>
              )}
              {role === 'newApartament' && (
                <Link
                  href="/admin/apartamentos"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors px-2 py-1"
                >
                  Mis apartamentos
                </Link>
              )}
            </nav>

            {/* Usuario autenticado o botón de login */}
            {user ? (
              <NavbarUserMenu email={user.email!} role={role!} />
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-1.5 rounded-xl"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

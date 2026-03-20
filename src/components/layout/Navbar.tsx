import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-sm">
              M
            </div>
            <span className="text-xl font-bold text-gray-900">Mariana</span>
            <span className="hidden sm:inline text-sm text-gray-400 font-normal">· Conjunto Turístico</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Inicio
            </Link>
            <Link href="/apartamentos" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Apartamentos
            </Link>
            <Link href="/admin" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

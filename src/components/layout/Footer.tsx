import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 p-0 m-0 rounded-lg bg-blue-800 text-white font-bold text-sm">
                <Image
                  src={'/logos/Santa-marina-blanco.png'}
                  alt='Santa Marina Logo'
                  width={100}
                  height={100}
                />
              </div>
              <span className="text-white font-bold text-lg">
                Santa Marina
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Conjunto turístico ubicado en el corazón del Caribe colombiano. Disfruta de apartamentos de lujo con todo lo que necesitas para unas vacaciones perfectas.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/apartamentos" className="hover:text-white transition-colors">Ver apartamentos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>📞 +57 316 026 0173</li>
              <li>📍 KR 4 #191-744 Conjunto Residencial Santa Marina
              PH Sector Don Jaca</li>
              <li>📍 Cartagena de Indias, Colombia</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 text-center text-xs">
          <p>© {new Date().getFullYear()} Conjunto Turístico Santa Marina. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

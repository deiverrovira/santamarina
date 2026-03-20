import SearchForm from '@/components/search/SearchForm'
import { getApartments } from '@/actions/apartments'
import ApartmentCard from '@/components/apartments/ApartmentCard'
import Link from 'next/link'
import { ChevronRight, Waves, Shield, Clock } from 'lucide-react'

export default async function HomePage() {
  // Load featured apartments for homepage showcase
  const featuredApartments = await getApartments({ adults: 1, children: 0 })
  const showcase = featuredApartments.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal-500/30 backdrop-blur-sm border border-teal-400/30 text-teal-200 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🌴 Conjunto Turístico Mariana
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Tu paraíso en el<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
                Caribe colombiano
              </span>
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Apartamentos de lujo a pasos del mar. Elige tus fechas y encuentra el espacio perfecto para tu familia o grupo.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center">
                <Waves className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Frente al mar</h3>
              <p className="text-sm text-gray-500">Vistas panorámicas y acceso directo a la playa desde el conjunto.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Reserva segura</h3>
              <p className="text-sm text-gray-500">Proceso simple y sin cargos al momento de solicitar. Paga al llegar.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Confirmación rápida</h3>
              <p className="text-sm text-gray-500">Recibe confirmación en menos de 24 horas hábiles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apartments */}
      {showcase.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Nuestros apartamentos</h2>
                <p className="text-gray-500">Espacios diseñados para que disfrutes al máximo</p>
              </div>
              <Link
                href="/apartamentos"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
              >
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcase.map((apt) => (
                <ApartmentCard key={apt.id} apartment={apt} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/apartamentos"
                className="inline-flex items-center gap-1 text-sm font-medium text-teal-600"
              >
                Ver todos los apartamentos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

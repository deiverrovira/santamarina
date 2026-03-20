import { notFound } from 'next/navigation'
import { getApartmentBySlug } from '@/actions/apartments'
import ApartmentGallery from '@/components/apartments/ApartmentGallery'
import AmenitiesList from '@/components/apartments/AmenitiesList'
import BookingPanel from '@/components/booking/BookingPanel'
import { formatDate } from '@/lib/utils'
import { Bed, Bath, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: { slug: string }
  searchParams: {
    checkIn?: string
    checkOut?: string
    adults?: string
    children?: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const apartment = await getApartmentBySlug(params.slug)
  if (!apartment) return { title: 'Apartamento no encontrado' }
  return {
    title: `${apartment.name} · Mariana`,
    description: apartment.shortDescription,
  }
}

export default async function ApartmentDetailPage({ params, searchParams }: PageProps) {
  const apartment = await getApartmentBySlug(params.slug)

  if (!apartment) {
    notFound()
  }

  const backParams = new URLSearchParams()
  if (searchParams.checkIn) backParams.set('checkIn', searchParams.checkIn)
  if (searchParams.checkOut) backParams.set('checkOut', searchParams.checkOut)
  if (searchParams.adults) backParams.set('adults', searchParams.adults)
  if (searchParams.children) backParams.set('children', searchParams.children)
  const backUrl = `/apartamentos${backParams.toString() ? `?${backParams.toString()}` : ''}`

  const upcomingReservations = apartment.reservations
    .filter(r => new Date(r.checkOut) >= new Date())
    .slice(0, 5)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href={backUrl} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver a resultados
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <ApartmentGallery images={apartment.images} name={apartment.name} />

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{apartment.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4" />
                  {apartment.bedrooms} habitación{apartment.bedrooms !== 1 ? 'es' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4" />
                  {apartment.bathrooms} baño{apartment.bathrooms !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Hasta {apartment.maxAdults} adultos{apartment.maxChildren > 0 ? ` y ${apartment.maxChildren} niños` : ''}
                </span>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{apartment.description}</p>
              </div>
            </div>

            {apartment.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <AmenitiesList amenities={apartment.amenities} />
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Capacidad</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-medium text-gray-900">{apartment.maxAdults} adultos</div>
                  <div className="text-gray-500">Capacidad máxima</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="font-medium text-gray-900">{apartment.maxChildren} niños</div>
                  <div className="text-gray-500">Capacidad máxima</div>
                </div>
              </div>
            </div>

            {upcomingReservations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fechas no disponibles</h3>
                <div className="space-y-2">
                  {upcomingReservations.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm bg-red-50 rounded-xl px-4 py-2.5">
                      <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                      <span className="text-gray-600">
                        {formatDate(r.checkIn)} → {formatDate(r.checkOut)}
                      </span>
                      <span className="ml-auto text-xs text-red-500 font-medium uppercase">{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingPanel
                apartmentId={apartment.id}
                pricePerNight={apartment.pricePerNight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

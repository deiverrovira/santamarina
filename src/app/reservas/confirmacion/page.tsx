import { getReservationById } from '@/actions/reservations'
import { formatCurrency, formatDate, calculateNights } from '@/lib/utils'
import { CheckCircle, Calendar, Users, Phone, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PageProps {
  searchParams: { id?: string }
}

export default async function ConfirmacionPage({ searchParams }: PageProps) {
  const reservationId = Number(searchParams.id)
  const reservation = reservationId ? await getReservationById(reservationId) : null

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reserva no encontrada</h1>
          <p className="text-gray-500 mb-6">No pudimos encontrar los detalles de tu reserva.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const nights = calculateNights(reservation.checkIn, reservation.checkOut)
  const totalPrice = nights * reservation.apartment.pricePerNight
  const mainImage = reservation.apartment.images[0]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            <CheckCircle className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h1>
          <p className="text-gray-500">
            Hemos recibido tu solicitud de reserva. Te confirmaremos disponibilidad a la brevedad.
          </p>
        </div>

        {/* Info note */}
        <div className="mb-6 mt-6 bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 shadow-md">
          <p className="font-medium mb-1">¿Qué sigue?</p>
          <p>Nuestro equipo revisará tu solicitud y te contactará al correo <strong>{reservation.guestEmail}</strong> o mediante WhatsApp <strong>{reservation.guestPhone}</strong> dentro de las próximas 24 horas hábiles para confirmar tu reserva.</p>
        </div>

        {/* Reservation card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Apartment image header */}
          {mainImage && (
            <div className="relative h-48">
              <Image src={mainImage.url} alt={mainImage.alt} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <h2 className="text-xl font-bold text-white">{reservation.apartment.name}</h2>
              </div>
            </div>
          )}

          <div className="p-6 space-y-5">
            {/* Reservation number */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-sm text-gray-500">Número de solicitud</span>
              <span className="font-mono font-bold text-gray-900">#{String(reservation.id).padStart(6, '0')}</span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  CHECK-IN
                </div>
                <div className="font-semibold text-gray-900">{formatDate(reservation.checkIn)}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  CHECK-OUT
                </div>
                <div className="font-semibold text-gray-900">{formatDate(reservation.checkOut)}</div>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span>
                {reservation.adults} adulto{reservation.adults !== 1 ? 's' : ''}
                {reservation.children > 0 && `, ${reservation.children} niño${reservation.children !== 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <span>{reservation.guestEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <span>{reservation.guestPhone}</span>
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-blue-50 rounded-xl p-4 text-sm">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>{formatCurrency(reservation.apartment.pricePerNight)} × {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-blue-200 pt-2">
                <span>Total estimado</span>
                <span className="text-blue-700">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between bg-amber-50 rounded-xl px-4 py-3">
              <span className="text-sm text-amber-700 font-medium">Estado de la solicitud</span>
              <span className="text-sm font-bold text-amber-800 uppercase tracking-wide">Pendiente</span>
            </div>

            {reservation.notes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Observaciones</p>
                <p className="text-sm text-gray-700">{reservation.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/apartamentos"
            className="flex-1 text-center border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            Ver más apartamentos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

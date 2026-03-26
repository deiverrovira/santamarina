'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import BookingForm from './BookingForm'

interface BookingPanelProps {
  apartmentId: number
  pricePerNight: number
  minStay: number
  maxStay: number
}

function BookingPanelInner({ apartmentId, pricePerNight, minStay, maxStay }: BookingPanelProps) {
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn') || undefined
  const checkOut = searchParams.get('checkOut') || undefined
  const adults = Number(searchParams.get('adults')) || 1
  const children = Number(searchParams.get('children')) || 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-2xl font-bold text-gray-900">
          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(pricePerNight)}
        </span>
        <span className="text-gray-400 text-sm">/ noche</span>
      </div>

      <BookingForm
        apartmentId={apartmentId}
        pricePerNight={pricePerNight}
        minStay={minStay}
        maxStay={maxStay}
        defaultCheckIn={checkIn}
        defaultCheckOut={checkOut}
        defaultAdults={adults}
        defaultChildren={children}
      />
    </div>
  )
}

export default function BookingPanel(props: BookingPanelProps) {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse h-96" />}>
      <BookingPanelInner {...props} />
    </Suspense>
  )
}

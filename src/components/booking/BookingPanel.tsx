'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import BookingForm from './BookingForm'
import PriceSummary from './PriceSummary'

interface BookingPanelProps {
  apartmentId: number
  pricePerNight: number
}

function BookingPanelInner({ apartmentId, pricePerNight }: BookingPanelProps) {
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn') || undefined
  const checkOut = searchParams.get('checkOut') || undefined
  const adults = Number(searchParams.get('adults')) || 1
  const children = Number(searchParams.get('children')) || 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
      <div className="mb-5">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(pricePerNight)}
          </span>
          <span className="text-gray-400 text-sm">/ noche</span>
        </div>
        <PriceSummary pricePerNight={pricePerNight} checkIn={checkIn} checkOut={checkOut} />
      </div>

      <BookingForm
        apartmentId={apartmentId}
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

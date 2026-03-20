'use client'

import { calculateNights, formatCurrency } from '@/lib/utils'

interface PriceSummaryProps {
  pricePerNight: number
  checkIn?: string
  checkOut?: string
}

export default function PriceSummary({ pricePerNight, checkIn, checkOut }: PriceSummaryProps) {
  if (!checkIn || !checkOut) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 text-center">
        Selecciona las fechas para ver el precio total
      </div>
    )
  }

  const nights = calculateNights(checkIn, checkOut)
  if (nights <= 0) return null

  const total = nights * pricePerNight

  return (
    <div className="bg-teal-50 rounded-xl p-4 space-y-2 text-sm">
      <div className="flex justify-between text-gray-700">
        <span>{formatCurrency(pricePerNight)} × {nights} {nights === 1 ? 'noche' : 'noches'}</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <div className="border-t border-teal-200 pt-2 flex justify-between font-semibold text-gray-900">
        <span>Total estimado</span>
        <span className="text-teal-700">{formatCurrency(total)}</span>
      </div>
      <p className="text-xs text-gray-400">* No incluye impuestos. Pago al momento del check-in.</p>
    </div>
  )
}

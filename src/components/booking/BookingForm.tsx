'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BookingSchema, type BookingInput } from '@/lib/validations'
import { createReservation } from '@/actions/reservations'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface BookingFormProps {
  apartmentId: number
  defaultCheckIn?: string
  defaultCheckOut?: string
  defaultAdults?: number
  defaultChildren?: number
}

export default function BookingForm({
  apartmentId,
  defaultCheckIn,
  defaultCheckOut,
  defaultAdults = 1,
  defaultChildren = 0,
}: BookingFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      apartmentId,
      checkIn: defaultCheckIn || '',
      checkOut: defaultCheckOut || '',
      adults: defaultAdults,
      children: defaultChildren,
    },
  })

  const onSubmit = async (data: BookingInput) => {
    setServerError(null)
    setLoading(true)
    try {
      const result = await createReservation(data)
      if (result.success && result.reservationId) {
        router.push(`/reservas/confirmacion?id=${result.reservationId}`)
      } else {
        setServerError(result.error || 'Ocurrió un error inesperado.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('apartmentId', { valueAsNumber: true })} />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Fecha entrada"
          type="date"
          min={today}
          {...register('checkIn')}
          error={errors.checkIn?.message}
        />
        <Input
          label="Fecha salida"
          type="date"
          min={today}
          {...register('checkOut')}
          error={errors.checkOut?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Adultos"
          type="number"
          min={1}
          max={20}
          {...register('adults', { valueAsNumber: true })}
          error={errors.adults?.message}
        />
        <Input
          label="Niños"
          type="number"
          min={0}
          max={10}
          {...register('children', { valueAsNumber: true })}
          error={errors.children?.message}
        />
      </div>

      <hr className="border-gray-100" />

      <Input
        label="Nombre completo"
        placeholder="Ej: María García López"
        {...register('guestName')}
        error={errors.guestName?.message}
      />

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        {...register('guestEmail')}
        error={errors.guestEmail?.message}
      />

      <Input
        label="Teléfono"
        type="tel"
        placeholder="+57 300 123 4567"
        {...register('guestPhone')}
        error={errors.guestPhone?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Observaciones (opcional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Hora estimada de llegada, peticiones especiales, etc."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
        />
        {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          ⚠️ {serverError}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Solicitar reserva
      </Button>

      <p className="text-xs text-center text-gray-400">
        Sin cobro inmediato. Recibirás confirmación por correo.
      </p>
    </form>
  )
}

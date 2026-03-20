'use client'

import { useState } from 'react'
import { updateReservationStatus } from '@/actions/admin'
import { Check, X, Loader2 } from 'lucide-react'

interface ReservationActionsProps {
  id: number
  status: string
}

export default function ReservationActions({ id, status }: ReservationActionsProps) {
  const [loading, setLoading] = useState<'CONFIRMED' | 'CANCELLED' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handle = async (newStatus: 'CONFIRMED' | 'CANCELLED') => {
    setLoading(newStatus)
    setError(null)
    const result = await updateReservationStatus(id, newStatus)
    if (!result.success) setError(result.error ?? 'Error al actualizar')
    setLoading(null)
  }

  if (status === 'CANCELLED') {
    return <span className="text-xs text-gray-300 italic select-none">Sin acciones</span>
  }

  return (
    <div className="flex flex-col gap-2 min-w-[110px]">
      {status === 'PENDING' && (
        <button
          disabled={loading !== null}
          onClick={() => handle('CONFIRMED')}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading === 'CONFIRMED'
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Check className="w-3.5 h-3.5" />
          }
          Confirmar
        </button>
      )}
      <button
        disabled={loading !== null}
        onClick={() => handle('CANCELLED')}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === 'CANCELLED'
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : <X className="w-3.5 h-3.5" />
        }
        Cancelar
      </button>
      {error && <p className="text-xs text-red-500 mt-1 leading-tight">{error}</p>}
    </div>
  )
}

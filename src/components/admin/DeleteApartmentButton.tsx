'use client'

import { useState, useTransition } from 'react'
import { deleteApartment } from '@/actions/apartments'
import { Trash2, Loader2 } from 'lucide-react'

interface Props {
  id: number
  name: string
}

export default function DeleteApartmentButton({ id, name }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteApartment(id)
      if (!result.success) {
        setError(result.error ?? 'Error al eliminar')
        setConfirm(false)
      }
    })
  }

  if (confirm) {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-red-600 font-medium">¿Eliminar &quot;{name}&quot;?</p>
        <div className="flex gap-1.5">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            Confirmar
          </button>
          <button
            onClick={() => setConfirm(false)}
            disabled={isPending}
            className="rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-3 py-1.5 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Eliminar
    </button>
  )
}

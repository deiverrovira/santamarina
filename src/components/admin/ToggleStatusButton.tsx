'use client'

import { useTransition } from 'react'
import { toggleApartmentStatus } from '@/actions/apartments'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface Props {
  id: number
  isActive: boolean
}

export default function ToggleStatusButton({ id, isActive }: Props) {
  const [isPending, startTransition] = useTransition()

  const handle = () => {
    startTransition(async () => {
      await toggleApartmentStatus(id, !isActive)
    })
  }

  return (
    <button
      onClick={handle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-1.5 transition-colors disabled:opacity-50 ${
        isActive
          ? 'border border-amber-200 text-amber-600 hover:bg-amber-50'
          : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
      }`}
    >
      {isPending
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : isActive
          ? <EyeOff className="w-3.5 h-3.5" />
          : <Eye className="w-3.5 h-3.5" />
      }
      {isActive ? 'Desactivar' : 'Activar'}
    </button>
  )
}

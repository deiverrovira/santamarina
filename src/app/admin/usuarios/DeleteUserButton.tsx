'use client'

import { useState } from 'react'
import { deleteUser } from '@/actions/users'
import { Loader2, Trash2 } from 'lucide-react'

interface DeleteUserButtonProps {
  id:    number
  email: string
}

export default function DeleteUserButton({ id, email }: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handle = async () => {
    if (!confirm(`¿Eliminar al usuario ${email}? Esta acción no se puede deshacer.`)) return
    setLoading(true)
    setError(null)
    const result = await deleteUser(id)
    if (!result.success) setError(result.error ?? 'Error al eliminar')
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={handle}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
        Eliminar
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

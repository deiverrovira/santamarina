'use client'

import { useState } from 'react'
import { createUser, updateUser } from '@/actions/users'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface UserFormProps {
  mode: 'create' | 'edit'
  user?: { id: number; email: string; role: string; status: string }
}

const ROLES = [
  { value: 'admin',         label: 'Administrador',  desc: 'Acceso total al sistema'              },
  { value: 'newApartament', label: 'Gestor',          desc: 'Crear y editar sus propios apartamentos' },
  { value: 'guest',         label: 'Huésped',         desc: 'Solo navegación y reservas'          },
]

export default function UserForm({ mode, user }: UserFormProps) {
  const router = useRouter()
  const [loading,      setLoading]      = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors,       setErrors]       = useState<Record<string, string[]>>({})
  const [globalError,  setGlobalError]  = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGlobalError(null)

    const formData = new FormData(e.currentTarget)
    const result   = mode === 'create'
      ? await createUser(formData)
      : await updateUser(user!.id, formData)

    setLoading(false)

    if (!result.success) {
      if ('errors' in result && result.errors) setErrors(result.errors as Record<string, string[]>)
      else setGlobalError('Ocurrió un error. Inténtalo de nuevo.')
      return
    }

    router.push('/admin/usuarios')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {globalError}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Correo electrónico
        </label>
        <input
          name="email"
          type="email"
          defaultValue={user?.email ?? ''}
          placeholder="usuario@ejemplo.com"
          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-teal-400'
          }`}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Contraseña {mode === 'edit' && <span className="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>}
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'create' ? 'Mínimo 6 caracteres' : '••••••••'}
            className={`w-full pr-10 px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-teal-400'
            }`}
          />
          <button type="button" onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
      </div>

      {/* Rol */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
        <div className="space-y-2">
          {ROLES.map(r => (
            <label key={r.value} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer has-[:checked]:border-teal-400 has-[:checked]:bg-teal-50 transition-colors">
              <input
                type="radio"
                name="role"
                value={r.value}
                defaultChecked={user?.role === r.value || (!user && r.value === 'guest')}
                className="mt-0.5 accent-teal-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{r.label}</p>
                <p className="text-xs text-gray-400">{r.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role[0]}</p>}
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
        <select
          name="status"
          defaultValue={user?.status ?? 'active'}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 bg-white"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

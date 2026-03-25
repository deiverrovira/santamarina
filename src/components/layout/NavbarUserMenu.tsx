'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut, ChevronDown, User } from 'lucide-react'
import type { UserRole } from '@/lib/auth'

const ROLE_LABELS: Record<UserRole, string> = {
  admin:          'Administrador',
  newApartament:  'Gestor',
  guest:          'Huésped',
}

interface NavbarUserMenuProps {
  email: string
  role:  UserRole
}

export default function NavbarUserMenu({ email, role }: NavbarUserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initial = email.charAt(0).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 transition-colors"
      >
        {/* Avatar inicial */}
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold">
          {initial}
        </span>
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {email}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg py-1.5 z-50">
          {/* Info del usuario */}
          <div className="px-4 py-2.5 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-900 truncate">{email}</p>
            <p className="text-xs text-gray-400 mt-0.5">{ROLE_LABELS[role]}</p>
          </div>

          {/* Links según rol */}
          {role === 'admin' && (
            <>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Panel de reservas
              </Link>
              <Link
                href="/admin/apartamentos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Apartamentos
              </Link>
              <Link
                href="/admin/usuarios"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Usuarios
              </Link>
              <div className="border-t border-gray-50 my-1" />
            </>
          )}

          {role === 'newApartament' && (
            <>
              <Link
                href="/admin/apartamentos"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Mis apartamentos
              </Link>
              <div className="border-t border-gray-50 my-1" />
            </>
          )}

          {/* Cerrar sesión */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

import { getUsers } from '@/actions/users'
import { requireRole } from '@/actions/auth'
import Link from 'next/link'
import { Plus, Users, ShieldCheck, Building2, User } from 'lucide-react'
import DeleteUserButton from './DeleteUserButton'

const ROLE_CONFIG = {
  admin:          { label: 'Administrador', bg: 'bg-purple-100', text: 'text-purple-700', icon: ShieldCheck },
  newApartament:  { label: 'Gestor',        bg: 'bg-blue-100',   text: 'text-blue-700',   icon: Building2  },
  guest:          { label: 'Huésped',       bg: 'bg-gray-100',   text: 'text-gray-600',   icon: User       },
}

const STATUS_CONFIG = {
  active:   { label: 'Activo',   bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactivo', bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-400'     },
}

export const metadata = { title: 'Usuarios · Admin Santa Marina' }

export default async function UsersPage() {
  await requireRole('admin')
  const users = await getUsers()

  const counts = {
    total:         users.length,
    admin:         users.filter(u => u.role === 'admin').length,
    newApartament: users.filter(u => u.role === 'newApartament').length,
    active:        users.filter(u => u.status === 'active').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
              <p className="text-sm text-gray-400 mt-0.5">Gestión de acceso al sistema</p>
            </div>
            <Link
              href="/admin/usuarios/nuevo"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nuevo usuario
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-6">
            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
            <div className="bg-purple-50 rounded-xl px-4 py-3 border border-purple-100">
              <p className="text-xs text-purple-500 mb-1">Administradores</p>
              <p className="text-2xl font-bold text-purple-700">{counts.admin}</p>
            </div>
            <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
              <p className="text-xs text-blue-500 mb-1">Gestores</p>
              <p className="text-2xl font-bold text-blue-700">{counts.newApartament}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
              <p className="text-xs text-emerald-500 mb-1">Activos</p>
              <p className="text-2xl font-bold text-emerald-700">{counts.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {users.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sin usuarios</h3>
            <p className="text-gray-400 text-sm">Crea el primer usuario del sistema.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Usuario', 'Rol', 'Estado', 'Creado', 'Acciones'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5 first:pl-6 last:pr-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => {
                  const roleCfg   = ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG]   ?? ROLE_CONFIG.guest
                  const statusCfg = STATUS_CONFIG[user.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.inactive
                  const RoleIcon  = roleCfg.icon
                  return (
                    <tr key={user.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex-shrink-0">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </td>
                      {/* Rol */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${roleCfg.bg} ${roleCfg.text}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleCfg.label}
                        </span>
                      </td>
                      {/* Estado */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                      {/* Fecha */}
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      {/* Acciones */}
                      <td className="px-5 pr-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/usuarios/${user.id}/editar`}
                            className="text-xs font-semibold text-teal-600 hover:text-teal-700 border border-teal-200 hover:bg-teal-50 rounded-lg px-3 py-1.5 transition-colors"
                          >
                            Editar
                          </Link>
                          <DeleteUserButton id={user.id} email={user.email} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

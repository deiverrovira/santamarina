import { requireRole } from '@/actions/auth'
import { getApartmentsAdmin } from '@/actions/apartments'
import ApartmentAdminCard from '@/components/admin/ApartmentAdminCard'
import Link from 'next/link'
import { BedDouble, Plus } from 'lucide-react'

export default async function AdminApartamentosPage() {
  const user = await requireRole(['admin', 'newApartament'])
  const apartments = await getApartmentsAdmin(parseInt(user.id as string), user.role as string)

  const isAdmin = user.role === 'admin'
  const title = isAdmin ? 'Gestión de apartamentos' : 'Mis apartamentos'
  const subtitle = isAdmin
    ? `${apartments.length} apartamento${apartments.length !== 1 ? 's' : ''} en total`
    : `${apartments.length} apartamento${apartments.length !== 1 ? 's' : ''} publicado${apartments.length !== 1 ? 's' : ''}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
            </div>
            <Link
              href="/admin/apartamentos/nuevo"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nuevo apartamento
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {apartments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
            <BedDouble className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sin apartamentos</h3>
            <p className="text-gray-400 text-sm mb-6">
              {isAdmin
                ? 'Aún no hay apartamentos registrados en el sistema.'
                : 'Aún no has creado ningún apartamento.'}
            </p>
            <Link
              href="/admin/apartamentos/nuevo"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear primer apartamento
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt) => (
              <ApartmentAdminCard
                key={apt.id}
                apartment={apt}
                role={user.role as string}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

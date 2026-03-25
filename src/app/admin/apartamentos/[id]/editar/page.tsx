import { notFound, redirect } from 'next/navigation'
import { requireRole } from '@/actions/auth'
import { getApartmentByIdAdmin, getAllAmenities } from '@/actions/apartments'
import ApartmentForm from '../../nuevo/ApartmentForm'

interface PageProps {
  params: { id: string }
}

export default async function EditApartmentPage({ params }: PageProps) {
  const user = await requireRole(['admin', 'newApartament'])
  const apartmentId = Number(params.id)

  if (isNaN(apartmentId)) notFound()

  const [apartment, amenities] = await Promise.all([
    getApartmentByIdAdmin(apartmentId),
    getAllAmenities(),
  ])

  if (!apartment) notFound()

  // newApartament solo puede editar sus propios apartamentos
  if (user.role === 'newApartament' && apartment.createdById !== parseInt(user.id as string)) {
    redirect('/admin/apartamentos')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar apartamento</h1>
            <p className="text-sm text-gray-400 mt-0.5">{apartment.name}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ApartmentForm
          amenities={amenities}
          apartment={apartment}
        />
      </div>
    </div>
  )
}

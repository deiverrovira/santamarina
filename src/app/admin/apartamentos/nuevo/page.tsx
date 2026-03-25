import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllAmenities } from '@/actions/apartments'
import ApartmentForm from './ApartmentForm'

export const metadata = {
  title: 'Nuevo apartamento · Admin',
}

export default async function NuevoApartamentoPage() {
  const amenities = await getAllAmenities()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <Link
              href="/admin/apartamentos"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              aria-label="Volver a mis apartamentos"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nuevo apartamento</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Conjunto Turístico Mariana · Completa todos los campos requeridos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ApartmentForm amenities={amenities} />
      </div>

    </div>
  )
}

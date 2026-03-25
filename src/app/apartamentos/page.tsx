import { Suspense } from 'react'
import { getApartments, getAllAmenities } from '@/actions/apartments'
import ApartmentCard from '@/components/apartments/ApartmentCard'
import SearchForm from '@/components/search/SearchForm'
import FilterDrawer from '@/components/search/FilterDrawer'
import { formatDate } from '@/lib/utils'
import { SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import type { SearchParams } from '@/types'

interface PageProps {
  searchParams: {
    checkIn?: string
    checkOut?: string
    adults?: string
    children?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    sortBy?: string
    amenityIds?: string
  }
}

async function ApartmentsList({ searchParams }: PageProps) {
  const params: SearchParams = {
    checkIn:    searchParams.checkIn,
    checkOut:   searchParams.checkOut,
    adults:     searchParams.adults,
    children:   searchParams.children,
    minPrice:   searchParams.minPrice,
    maxPrice:   searchParams.maxPrice,
    bedrooms:   searchParams.bedrooms,
    sortBy:     searchParams.sortBy as SearchParams['sortBy'],
    amenityIds: searchParams.amenityIds,
  }

  const apartments = await getApartments(params)
  const hasSearch  = searchParams.checkIn && searchParams.checkOut

  return (
    <div>
      {hasSearch && (
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 bg-blue-50 rounded-xl px-4 py-3">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>
            Mostrando resultados del{' '}
            <strong className="text-gray-900">{formatDate(searchParams.checkIn!)}</strong>
            {' '}al{' '}
            <strong className="text-gray-900">{formatDate(searchParams.checkOut!)}</strong>
            {' '}·{' '}
            <strong className="text-gray-900">
              {searchParams.adults || 1} adulto{Number(searchParams.adults) !== 1 ? 's' : ''}
            </strong>
            {Number(searchParams.children) > 0 && `, ${searchParams.children} niño${Number(searchParams.children) !== 1 ? 's' : ''}`}
          </span>
        </div>
      )}

      {apartments.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No encontramos apartamentos disponibles
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            No hay apartamentos que coincidan con los filtros seleccionados.
            Intenta con otros criterios.
          </p>
          <Link
            href="/apartamentos"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Ver todos los apartamentos
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-5">
            {apartments.length} apartamento{apartments.length !== 1 ? 's' : ''} disponible{apartments.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt) => (
              <ApartmentCard
                key={apt.id}
                apartment={apt}
                searchParams={{
                  checkIn:  searchParams.checkIn,
                  checkOut: searchParams.checkOut,
                  adults:   searchParams.adults,
                  children: searchParams.children,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function ApartamentosPage({ searchParams }: PageProps) {
  const hasSearch = searchParams.checkIn && searchParams.checkOut
  const amenities = await getAllAmenities()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {hasSearch ? 'Resultados de búsqueda' : 'Todos los apartamentos'}
          </h1>
          {/* Fila: buscador + botón filtros */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <SearchForm
                compact
                defaultValues={{
                  checkIn:  searchParams.checkIn,
                  checkOut: searchParams.checkOut,
                  adults:   Number(searchParams.adults)   || 2,
                  children: Number(searchParams.children) || 0,
                }}
              />
            </div>
            <FilterDrawer amenities={amenities} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        }>
          <ApartmentsList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

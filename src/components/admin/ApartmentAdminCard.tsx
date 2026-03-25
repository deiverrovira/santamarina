import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Bath, Users, BookOpen, Pencil } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { ApartmentForAdmin } from '@/types'
import DeleteApartmentButton from './DeleteApartmentButton'
import ToggleStatusButton from './ToggleStatusButton'

interface Props {
  apartment: ApartmentForAdmin
  role: string
}

export default function ApartmentAdminCard({ apartment, role }: Props) {
  const img = apartment.images[0]
  const isAdmin = role === 'admin'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-gray-100 flex-shrink-0">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BedDouble className="w-10 h-10 text-gray-300" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            apartment.isActive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${apartment.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            {apartment.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Reservation count */}
        {apartment._count.reservations > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 px-2 py-1 text-xs font-medium text-gray-600 shadow-sm">
              <BookOpen className="w-3 h-3" />
              {apartment._count.reservations}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 leading-snug">{apartment.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{apartment.shortDescription}</p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" />
            {apartment.bedrooms} hab.
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {apartment.bathrooms} baño{apartment.bathrooms !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {apartment.maxAdults + apartment.maxChildren} huésp.
          </span>
        </div>

        <p className="text-sm font-bold text-gray-900">{formatCurrency(apartment.pricePerNight)}<span className="text-xs font-normal text-gray-400"> / noche</span></p>

        {/* Creator (solo visible para admin) */}
        {isAdmin && apartment.createdBy && (
          <p className="text-xs text-gray-400">
            Creado por <span className="font-medium text-gray-600">{apartment.createdBy.email}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-gray-50">
          <Link
            href={`/admin/apartamentos/${apartment.id}/editar`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Link>

          {isAdmin && (
            <>
              <ToggleStatusButton id={apartment.id} isActive={apartment.isActive} />
              <DeleteApartmentButton id={apartment.id} name={apartment.name} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

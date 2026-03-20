import Image from 'next/image'
import Link from 'next/link'
import { Users, Bed, Bath, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { ApartmentWithImages } from '@/types'
import Badge from '@/components/ui/Badge'

interface ApartmentCardProps {
  apartment: ApartmentWithImages
  searchParams?: { checkIn?: string; checkOut?: string; adults?: string; children?: string }
}

export default function ApartmentCard({ apartment, searchParams }: ApartmentCardProps) {
  const mainImage = apartment.images[0]
  const params = searchParams ? `?${new URLSearchParams(searchParams as Record<string, string>).toString()}` : ''

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="relative h-52 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
            <span className="text-teal-400 text-4xl">🏖️</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="success">Disponible</Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{apartment.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{apartment.shortDescription}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {apartment.bedrooms} hab.
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {apartment.bathrooms} baños
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {apartment.maxAdults + apartment.maxChildren} huésp. máx.
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(apartment.pricePerNight)}</span>
            <span className="text-sm text-gray-400 ml-1">/ noche</span>
          </div>
          <Link
            href={`/apartamentos/${apartment.slug}${params}`}
            className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
          >
            Ver detalle
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

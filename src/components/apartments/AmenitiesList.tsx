import { Wifi, Waves, Wind, UtensilsCrossed, Car, Eye, Home, Tv, Shirt, Droplets, Star } from 'lucide-react'
import type { Amenity } from '@prisma/client'

const iconMap: Record<string, React.ElementType> = {
  wifi: Wifi,
  waves: Waves,
  wind: Wind,
  utensils: UtensilsCrossed,
  car: Car,
  eye: Eye,
  home: Home,
  tv: Tv,
  shirt: Shirt,
  droplets: Droplets,
  star: Star,
}

interface AmenitiesListProps {
  amenities: Array<{ amenity: Amenity }>
}

export default function AmenitiesList({ amenities }: AmenitiesListProps) {
  if (!amenities.length) return null

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Comodidades</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map(({ amenity }) => {
          const Icon = iconMap[amenity.icon] || Star
          return (
            <div key={amenity.id} className="flex items-center gap-2.5 text-sm text-gray-700">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <span>{amenity.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

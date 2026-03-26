import type { Apartment, ApartmentImage, Amenity, Reservation, User } from '@prisma/client'

export type ApartmentWithImages = Apartment & {
  images: ApartmentImage[]
}

export type ApartmentWithRelations = Apartment & {
  images: ApartmentImage[]
  amenities: Array<{
    amenity: Amenity
  }>
  reservations: Pick<Reservation, 'checkIn' | 'checkOut' | 'status'>[]
}

export interface SearchParams {
  checkIn?: string
  checkOut?: string
  adults?: string | number
  children?: string | number
  minPrice?: string | number
  maxPrice?: string | number
  beds?: string | number
  bedrooms?: string | number
  sortBy?: 'price_asc' | 'price_desc' | 'newest'
  amenityIds?: string // IDs separados por coma: "1,3,5"
}

export interface ReservationResult {
  success: boolean
  reservationId?: number
  error?: string
  fieldErrors?: Record<string, string[]>
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export type ApartmentForAdmin = Apartment & {
  images: ApartmentImage[]
  createdBy: Pick<User, 'id' | 'email'> | null
  _count: { reservations: number }
}

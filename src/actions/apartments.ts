'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Amenity } from '@prisma/client'
import type { SearchParams, ApartmentWithImages, ApartmentWithRelations, ApartmentForAdmin } from '@/types'
import { generateDateRange } from '@/lib/ical-sync'

export async function getApartments(params: SearchParams): Promise<ApartmentWithImages[]> {
  const adults   = Number(params.adults)   || 1
  const children = Number(params.children) || 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    isActive:    true,
    maxAdults:   { gte: adults },
    maxChildren: { gte: children },
  }

  // Filtro por precio
  if (params.minPrice || params.maxPrice) {
    where.pricePerNight = {}
    if (params.minPrice) where.pricePerNight.gte = Number(params.minPrice)
    if (params.maxPrice) where.pricePerNight.lte = Number(params.maxPrice)
  }

  // Filtro por camas mínimas
  if (params.beds) {
    where.beds = { gte: Number(params.beds) }
  }

  // Filtro por habitaciones mínimas
  if (params.bedrooms) {
    where.bedrooms = { gte: Number(params.bedrooms) }
  }

  // Filtro por comodidades (debe tener TODAS las seleccionadas)
  if (params.amenityIds) {
    const ids = String(params.amenityIds).split(',').map(Number).filter(Boolean)
    if (ids.length > 0) {
      where.amenities = {
        some: { amenityId: { in: ids } },
      }
    }
  }

  // Filtro por estadía mínima/máxima cuando hay fechas seleccionadas
  if (params.checkIn && params.checkOut) {
    const nights = Math.round(
      (new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (nights > 0) {
      where.minStay = { lte: nights }
      where.maxStay = { gte: nights }
    }
  }

  // Filtro por disponibilidad en rango de fechas
  if (params.checkIn && params.checkOut) {
    const checkIn  = new Date(params.checkIn)
    const checkOut = new Date(params.checkOut)

    // 1. Excluir apartamentos con reservas que se solapen
    where.NOT = {
      reservations: {
        some: {
          AND: [
            { status: { not: 'CANCELLED' } },
            { checkIn:  { lt: checkOut } },
            { checkOut: { gt: checkIn  } },
          ],
        },
      },
    }

    // 2. Excluir apartamentos con fechas bloqueadas por Airbnb
    const dates = generateDateRange(params.checkIn, params.checkOut)
    if (dates.length > 0) {
      const blocked = await prisma.unavailableDate.findMany({
        where:    { date: { in: dates } },
        select:   { apartmentId: true },
        distinct: ['apartmentId'],
      })
      if (blocked.length > 0) {
        where.id = { notIn: blocked.map((b) => b.apartmentId) }
      }
    }
  }

  // Orden según sortBy
  const orderBy =
    params.sortBy === 'price_desc' ? { pricePerNight: 'desc' as const } :
    params.sortBy === 'newest'     ? { createdAt:     'desc' as const } :
                                     { pricePerNight: 'asc'  as const }

  return prisma.apartment.findMany({
    where,
    include: { images: { orderBy: { order: 'asc' } } },
    orderBy,
  })
}

export async function getAllAmenities(): Promise<Amenity[]> {
  return prisma.amenity.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function createApartment(data: {
  name: string
  slug: string
  description: string
  shortDescription: string
  maxAdults: number
  maxChildren: number
  beds: number
  bedrooms: number
  bathrooms: number
  pricePerNight: number
  minStay: number
  maxStay: number
  isActive: boolean
  airbnbIcsUrl?: string
  amenityIds: number[]
  images: { url: string; alt: string; order: number }[]
}): Promise<{ success: boolean; error?: string; slug?: string }> {
  try {
    // Obtener el usuario autenticado para asignar createdById
    const session = await getServerSession(authOptions)
    const createdById = session?.user?.id ? parseInt(session.user.id) : null

    const { amenityIds, images, ...apartmentData } = data

    await prisma.apartment.create({
      data: {
        ...apartmentData,
        createdById,
        images: {
          create: images.map((img) => ({
            url: img.url,
            alt: img.alt,
            order: img.order,
          })),
        },
        amenities: {
          create: amenityIds.map((amenityId) => ({ amenityId })),
        },
      },
    })

    revalidatePath('/admin/apartamentos')
    revalidatePath('/admin')
    revalidatePath('/apartamentos')

    return { success: true, slug: data.slug }
  } catch (err) {
    console.error('createApartment error:', err)
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, error: message }
  }
}

// ── Admin: obtener apartamentos según rol ──────────────────────────────────
// admin → todos | newApartament → solo los suyos
export async function getApartmentsAdmin(
  userId: number,
  role: string,
): Promise<ApartmentForAdmin[]> {
  const where = role === 'admin' ? {} : { createdById: userId }

  return prisma.apartment.findMany({
    where,
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      createdBy: { select: { id: true, email: true } },
      _count: { select: { reservations: true } },
    },
    orderBy: { createdAt: 'desc' },
  }) as Promise<ApartmentForAdmin[]>
}

// ── Admin: obtener un apartamento por id (con comodidades e imágenes) ──────
export async function getApartmentByIdAdmin(id: number) {
  return prisma.apartment.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: 'asc' } },
      amenities: { include: { amenity: true } },
      createdBy: { select: { id: true, email: true } },
    },
  })
}

// ── Admin: actualizar apartamento ─────────────────────────────────────────
export async function updateApartment(
  id: number,
  data: {
    name: string
    slug: string
    description: string
    shortDescription: string
    maxAdults: number
    maxChildren: number
    beds: number
    bedrooms: number
    bathrooms: number
    pricePerNight: number
    minStay: number
    maxStay: number
    isActive: boolean
    airbnbIcsUrl?: string
    amenityIds: number[]
    images: { url: string; alt: string; order: number }[]
  },
): Promise<{ success: boolean; error?: string; slug?: string }> {
  try {
    const { amenityIds, images, ...apartmentData } = data

    await prisma.$transaction([
      // Eliminar relaciones anteriores
      prisma.apartmentAmenity.deleteMany({ where: { apartmentId: id } }),
      prisma.apartmentImage.deleteMany({ where: { apartmentId: id } }),
      // Actualizar datos principales
      prisma.apartment.update({
        where: { id },
        data: {
          ...apartmentData,
          images: { create: images },
          amenities: { create: amenityIds.map((amenityId) => ({ amenityId })) },
        },
      }),
    ])

    revalidatePath('/admin/apartamentos')
    revalidatePath('/apartamentos')
    revalidatePath(`/apartamentos/${data.slug}`)

    return { success: true, slug: data.slug }
  } catch (err) {
    console.error('updateApartment error:', err)
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, error: message }
  }
}

// ── Admin: eliminar apartamento (solo admin) ───────────────────────────────
export async function deleteApartment(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.apartment.delete({ where: { id } })
    revalidatePath('/admin/apartamentos')
    revalidatePath('/apartamentos')
    return { success: true }
  } catch (err) {
    console.error('deleteApartment error:', err)
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, error: message }
  }
}

// ── Admin: activar / desactivar apartamento (solo admin) ──────────────────
export async function toggleApartmentStatus(
  id: number,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.apartment.update({ where: { id }, data: { isActive } })
    revalidatePath('/admin/apartamentos')
    revalidatePath('/apartamentos')
    return { success: true }
  } catch (err) {
    console.error('toggleApartmentStatus error:', err)
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, error: message }
  }
}

// ── Admin: sincronizar calendario iCal de Airbnb manualmente ─────────────
export async function syncIcalNow(
  apartmentId: number,
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const { syncApartmentCalendar } = await import('@/lib/ical-sync')
    const count = await syncApartmentCalendar(apartmentId)
    revalidatePath('/admin/apartamentos')
    return { success: true, count }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Error desconocido'
    console.error('syncIcalNow error:', error)
    return { success: false, error }
  }
}

export async function getApartmentBySlug(slug: string): Promise<ApartmentWithRelations | null> {
  return prisma.apartment.findUnique({
    where: { slug, isActive: true },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      amenities: {
        include: {
          amenity: true,
        },
      },
      reservations: {
        where: { status: { not: 'CANCELLED' } },
        select: { checkIn: true, checkOut: true, status: true },
        orderBy: { checkIn: 'asc' },
      },
    },
  })
}

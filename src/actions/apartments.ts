'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Amenity } from '@prisma/client'
import type { SearchParams, ApartmentWithImages, ApartmentWithRelations, ApartmentForAdmin } from '@/types'

export async function getApartments(params: SearchParams): Promise<ApartmentWithImages[]> {
  const adults = Number(params.adults) || 1
  const children = Number(params.children) || 0

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    isActive: true,
    maxAdults: { gte: adults },
    maxChildren: { gte: children },
  }

  // Filter by availability if dates provided
  if (params.checkIn && params.checkOut) {
    const checkIn = new Date(params.checkIn)
    const checkOut = new Date(params.checkOut)

    where.NOT = {
      reservations: {
        some: {
          AND: [
            { status: { not: 'CANCELLED' } },
            { checkIn: { lt: checkOut } },
            { checkOut: { gt: checkIn } },
          ],
        },
      },
    }
  }

  return prisma.apartment.findMany({
    where,
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { pricePerNight: 'asc' },
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
  bedrooms: number
  bathrooms: number
  pricePerNight: number
  isActive: boolean
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
    bedrooms: number
    bathrooms: number
    pricePerNight: number
    isActive: boolean
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

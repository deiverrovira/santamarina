'use server'

import { prisma } from '@/lib/prisma'
import type { SearchParams, ApartmentWithImages, ApartmentWithRelations } from '@/types'

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

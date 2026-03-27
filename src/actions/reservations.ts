'use server'

import { prisma } from '@/lib/prisma'
import { BookingSchema } from '@/lib/validations'
import type { ReservationResult } from '@/types'
import { generateDateRange } from '@/lib/ical-sync'

export async function checkAvailability(
  apartmentId: number,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  // 1. Verificar conflicto con reservas existentes
  const conflictingReservation = await prisma.reservation.findFirst({
    where: {
      apartmentId,
      status: { not: 'CANCELLED' },
      AND: [
        { checkIn: { lt: new Date(checkOut) } },
        { checkOut: { gt: new Date(checkIn) } },
      ],
    },
  })
  if (conflictingReservation) return false

  // 2. Verificar fechas bloqueadas por Airbnb
  const dates = generateDateRange(checkIn, checkOut)
  if (dates.length > 0) {
    const blocked = await prisma.unavailableDate.findFirst({
      where: { apartmentId, date: { in: dates } },
    })
    if (blocked) return false
  }

  return true
}

export async function createReservation(formData: unknown): Promise<ReservationResult> {
  // Validate input
  const parsed = BookingSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      success: false,
      error: 'validation',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { apartmentId, checkIn, checkOut, adults, children, ...rest } = parsed.data
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  try {
    // Use transaction for atomic availability check + insert
    const reservation = await prisma.$transaction(async (tx) => {
      // Re-check availability inside transaction
      const conflict = await tx.reservation.findFirst({
        where: {
          apartmentId,
          status: { not: 'CANCELLED' },
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
      })

      if (conflict) {
        throw new Error('UNAVAILABLE')
      }

      // Re-check Airbnb blocked dates inside transaction
      const dates = generateDateRange(checkIn, checkOut)
      if (dates.length > 0) {
        const blocked = await tx.unavailableDate.findFirst({
          where: { apartmentId, date: { in: dates } },
        })
        if (blocked) throw new Error('UNAVAILABLE')
      }

      // Check apartment capacity
      const apartment = await tx.apartment.findUnique({
        where: { id: apartmentId },
        select: { maxAdults: true, maxChildren: true, isActive: true },
      })

      if (!apartment || !apartment.isActive) {
        throw new Error('NOT_FOUND')
      }

      if (apartment.maxAdults < adults || apartment.maxChildren < children) {
        throw new Error('CAPACITY_EXCEEDED')
      }

      return tx.reservation.create({
        data: {
          apartmentId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adults,
          children,
          status: 'PENDING',
          ...rest,
        },
      })
    })

    return { success: true, reservationId: reservation.id }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === 'UNAVAILABLE') {
      return { success: false, error: 'El apartamento no está disponible para las fechas seleccionadas.' }
    }
    if (error.message === 'CAPACITY_EXCEEDED') {
      return { success: false, error: 'El apartamento no tiene capacidad suficiente para el número de huéspedes indicado.' }
    }
    if (error.message === 'NOT_FOUND') {
      return { success: false, error: 'El apartamento no existe o no está disponible.' }
    }
    console.error('Error creating reservation:', error)
    return { success: false, error: 'Ocurrió un error al procesar tu reserva. Por favor intenta de nuevo.' }
  }
}

export async function getReservationById(id: number) {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      apartment: {
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
        },
      },
    },
  })
}

'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/actions/auth'
import type { ReservationStatus } from '@/types'

export type ReservationWithApartment = Awaited<ReturnType<typeof getReservations>>[number]

export async function getReservations(filter: ReservationStatus | 'ALL' = 'ALL') {
  await requireRole('admin')
  return prisma.reservation.findMany({
    where: filter !== 'ALL' ? { status: filter } : undefined,
    include: {
      apartment: {
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateReservationStatus(
  id: number,
  status: 'CONFIRMED' | 'CANCELLED'
): Promise<{ success: boolean; error?: string }> {
  await requireRole('admin')
  try {
    await prisma.reservation.update({
      where: { id },
      data: { status },
    })
    revalidatePath('/admin')
    return { success: true }
  } catch {
    return { success: false, error: 'No se pudo actualizar el estado de la reserva.' }
  }
}

export async function getReservationCounts() {
  await requireRole('admin')
  const [total, pending, confirmed, cancelled] = await Promise.all([
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: 'PENDING' } }),
    prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
    prisma.reservation.count({ where: { status: 'CANCELLED' } }),
  ])
  return { total, pending, confirmed, cancelled }
}

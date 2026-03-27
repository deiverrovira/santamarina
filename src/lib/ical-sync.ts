import * as ical from 'node-ical'
import { prisma } from './prisma'

// Convierte un Date a YYYY-MM-DD usando UTC
// Airbnb usa VALUE=DATE (all-day events) que son UTC
function ymdFromDate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Suma un día a una fecha YYYY-MM-DD
function addOneDay(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

// Expande [start, end) en un array de fechas YYYY-MM-DD
// El checkOut (end) es exclusivo → no se bloquea
function expandDateRange(startYmd: string, endYmd: string): string[] {
  const dates: string[] = []
  const cur = new Date(`${startYmd}T00:00:00Z`)
  const end = new Date(`${endYmd}T00:00:00Z`)
  while (cur < end) {
    dates.push(cur.toISOString().slice(0, 10))
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return dates
}

// Genera todas las fechas de un rango [checkIn, checkOut)
export function generateDateRange(checkIn: string, checkOut: string): string[] {
  const startYmd = new Date(checkIn).toISOString().slice(0, 10)
  const endYmd   = new Date(checkOut).toISOString().slice(0, 10)
  return expandDateRange(startYmd, endYmd)
}

// Descarga y parsea una URL .ics → array de fechas bloqueadas
export async function parseIcsUrl(
  icsUrl: string
): Promise<{ date: string; externalUid: string | null }[]> {
  const calendar = await ical.async.fromURL(icsUrl)
  const blockedDates: { date: string; externalUid: string | null }[] = []

  for (const item of Object.values(calendar)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ev = item as any
    if (ev.type !== 'VEVENT' || !ev.start) continue

    const startYmd = ymdFromDate(ev.start)
    const endYmd   = ev.end ? ymdFromDate(ev.end) : addOneDay(startYmd)
    const dates    = expandDateRange(startYmd, endYmd)

    for (const date of dates) {
      blockedDates.push({ date, externalUid: ev.uid ?? null })
    }
  }

  // Eliminar duplicados por (externalUid, date)
  return Array.from(
    new Map(
      blockedDates.map((row) => [`${row.externalUid}:${row.date}`, row])
    ).values()
  )
}

// Sincroniza el calendario de un apartamento individual
export async function syncApartmentCalendar(apartmentId: number): Promise<number> {
  const apartment = await prisma.apartment.findUnique({
    where:  { id: apartmentId },
    select: { airbnbIcsUrl: true },
  })

  if (!apartment?.airbnbIcsUrl) {
    throw new Error('El apartamento no tiene URL de calendario configurada')
  }

  const blockedDates = await parseIcsUrl(apartment.airbnbIcsUrl)

  // Borrar registros anteriores e insertar nuevos de forma atómica
  await prisma.$transaction([
    prisma.unavailableDate.deleteMany({
      where: { apartmentId, source: 'airbnb_ical' },
    }),
    prisma.unavailableDate.createMany({
      data: blockedDates.map((row) => ({
        apartmentId,
        date:        row.date,
        externalUid: row.externalUid,
        source:      'airbnb_ical',
      })),
      skipDuplicates: true,
    }),
    prisma.apartment.update({
      where: { id: apartmentId },
      data:  { lastSyncAt: new Date() },
    }),
  ])

  return blockedDates.length
}

// Sincroniza todos los apartamentos que tengan URL configurada
export async function syncAllCalendars(): Promise<
  { apartmentId: number; count: number; error?: string }[]
> {
  const apartments = await prisma.apartment.findMany({
    where:  { airbnbIcsUrl: { not: null } },
    select: { id: true },
  })

  const results = []

  for (const apt of apartments) {
    try {
      const count = await syncApartmentCalendar(apt.id)
      results.push({ apartmentId: apt.id, count })
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error desconocido'
      console.error(`Error sincronizando apartamento ${apt.id}:`, error)
      results.push({ apartmentId: apt.id, count: 0, error })
    }
  }

  return results
}

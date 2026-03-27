import { NextRequest, NextResponse } from 'next/server'
import { syncAllCalendars } from '@/lib/ical-sync'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const results   = await syncAllCalendars()
    const totalDates = results.reduce((acc, r) => acc + r.count, 0)

    return NextResponse.json({
      ok:         true,
      synced:     results.length,
      totalDates,
      results,
    })
  } catch (error) {
    console.error('Error en sync-ical:', error)
    return NextResponse.json({ error: 'Error al sincronizar' }, { status: 500 })
  }
}

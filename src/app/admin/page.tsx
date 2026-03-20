import { getReservations, getReservationCounts } from '@/actions/admin'
import { formatCurrency, formatDate, calculateNights } from '@/lib/utils'
import ReservationActions from './ReservationActions'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Calendar, Phone, Mail, BedDouble, ClipboardList, CheckCircle2, Clock, XCircle } from 'lucide-react'

type FilterTab = 'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'

interface PageProps {
  searchParams: { status?: string }
}

const STATUS_CONFIG = {
  PENDING:   { label: 'Pendiente',   bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  CONFIRMED: { label: 'Confirmada',  bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { label: 'Cancelada',   bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-400'     },
} as const

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

export default async function AdminPage({ searchParams }: PageProps) {
  const rawFilter = (searchParams.status || 'ALL').toUpperCase()
  const filter: FilterTab = (['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'] as const).includes(rawFilter as FilterTab)
    ? (rawFilter as FilterTab)
    : 'ALL'

  const [reservations, counts] = await Promise.all([
    getReservations(filter === 'ALL' ? 'ALL' : filter),
    getReservationCounts(),
  ])

  const tabs: { key: FilterTab; label: string; count: number; icon: React.ElementType; color: string }[] = [
    { key: 'ALL',       label: 'Todas',       count: counts.total,     icon: ClipboardList,  color: 'text-gray-500' },
    { key: 'PENDING',   label: 'Pendientes',  count: counts.pending,   icon: Clock,          color: 'text-amber-500' },
    { key: 'CONFIRMED', label: 'Confirmadas', count: counts.confirmed, icon: CheckCircle2,   color: 'text-emerald-500' },
    { key: 'CANCELLED', label: 'Canceladas',  count: counts.cancelled, icon: XCircle,        color: 'text-red-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
              <p className="text-sm text-gray-400 mt-0.5">Gestión de solicitudes · Conjunto Turístico Mariana</p>
            </div>
            {counts.pending > 0 && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-2.5 text-sm font-semibold">
                <Clock className="w-4 h-4" />
                {counts.pending} pendiente{counts.pending !== 1 ? 's' : ''} por revisar
              </div>
            )}
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-6">
            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
            <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
              <p className="text-xs text-amber-500 mb-1">Pendientes</p>
              <p className="text-2xl font-bold text-amber-600">{counts.pending}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
              <p className="text-xs text-emerald-500 mb-1">Confirmadas</p>
              <p className="text-2xl font-bold text-emerald-600">{counts.confirmed}</p>
            </div>
            <div className="bg-red-50 rounded-xl px-4 py-3 border border-red-100">
              <p className="text-xs text-red-400 mb-1">Canceladas</p>
              <p className="text-2xl font-bold text-red-500">{counts.cancelled}</p>
            </div>
          </div>

          {/* ── Filter tabs ── */}
          <div className="flex overflow-x-auto -mb-px gap-1">
            {tabs.map(({ key, label, count, icon: Icon, color }) => {
              const active = filter === key
              return (
                <Link
                  key={key}
                  href={key === 'ALL' ? '/admin' : `/admin?status=${key.toLowerCase()}`}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    active
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-600' : color}`} />
                  {label}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    active ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {reservations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
            <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sin reservas</h3>
            <p className="text-gray-400 text-sm">
              {filter === 'ALL'
                ? 'Aún no se han recibido solicitudes de reserva.'
                : `No hay reservas con estado "${STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG]?.label ?? filter}".`}
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Apartamento', 'Huésped', 'Fechas', 'Huéspedes', 'Total estimado', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5 first:pl-6 last:pr-6">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r, idx) => {
                    const nights = calculateNights(r.checkIn, r.checkOut)
                    const total  = nights * r.apartment.pricePerNight
                    const img    = r.apartment.images[0]
                    return (
                      <tr
                        key={r.id}
                        className={`border-b border-gray-50 hover:bg-teal-50/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                      >
                        {/* Apartment */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-teal-100">
                              {img
                                ? <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="48px" />
                                : <BedDouble className="w-5 h-5 text-teal-400 m-auto mt-2.5" />
                              }
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate max-w-[160px]">{r.apartment.name}</p>
                              <p className="text-xs text-gray-400 font-mono">#{String(r.id).padStart(6, '0')}</p>
                            </div>
                          </div>
                        </td>
                        {/* Guest */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">{r.guestName}</p>
                          <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            {r.guestEmail}
                          </p>
                          <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            {r.guestPhone}
                          </p>
                        </td>
                        {/* Dates */}
                        <td className="px-5 py-4">
                          <p className="flex items-center gap-1.5 text-gray-700">
                            <Calendar className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                            {formatDate(r.checkIn)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 pl-5">↳ {formatDate(r.checkOut)}</p>
                          <p className="text-xs font-semibold text-teal-600 mt-0.5 pl-5">{nights} {nights === 1 ? 'noche' : 'noches'}</p>
                        </td>
                        {/* Guests */}
                        <td className="px-5 py-4">
                          <p className="flex items-center gap-1.5 text-gray-700">
                            <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            {r.adults} adulto{r.adults !== 1 ? 's' : ''}
                          </p>
                          {r.children > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5 pl-5">{r.children} niño{r.children !== 1 ? 's' : ''}</p>
                          )}
                        </td>
                        {/* Price */}
                        <td className="px-5 py-4">
                          <p className="font-bold text-gray-900">{formatCurrency(total)}</p>
                          <p className="text-xs text-gray-400">{formatCurrency(r.apartment.pricePerNight)} × noche</p>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge status={r.status} />
                          {r.notes && (
                            <p className="text-xs text-gray-400 mt-2 max-w-[130px] truncate italic" title={r.notes}>
                              {r.notes}
                            </p>
                          )}
                        </td>
                        {/* Actions */}
                        <td className="px-5 pr-6 py-4">
                          <ReservationActions id={r.id} status={r.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile / tablet cards ── */}
            <div className="lg:hidden space-y-4">
              {reservations.map((r) => {
                const nights = calculateNights(r.checkIn, r.checkOut)
                const total  = nights * r.apartment.pricePerNight
                const img    = r.apartment.images[0]
                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Card header with image */}
                    <div className="flex items-center gap-4 p-4 border-b border-gray-50">
                      <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-teal-100">
                        {img
                          ? <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="64px" />
                          : <BedDouble className="w-6 h-6 text-teal-400 m-auto mt-4" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-gray-900 leading-snug truncate">{r.apartment.name}</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">#{String(r.id).padStart(6, '0')}</p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="font-semibold text-gray-900">{r.guestName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.guestEmail}</p>
                        <p className="text-xs text-gray-400">{r.guestPhone}</p>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1 bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Check-in</p>
                          <p className="text-sm font-semibold text-gray-800">{formatDate(r.checkIn)}</p>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Check-out</p>
                          <p className="text-sm font-semibold text-gray-800">{formatDate(r.checkOut)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {r.adults} adultos{r.children > 0 ? `, ${r.children} niños` : ''}
                          {' · '}
                          <span className="text-teal-600 font-medium">{nights} noches</span>
                        </span>
                        <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
                      </div>

                      {r.notes && (
                        <p className="text-xs text-gray-400 italic bg-gray-50 rounded-lg px-3 py-2">
                          💬 {r.notes}
                        </p>
                      )}
                    </div>

                    {/* Card footer with actions */}
                    <div className="px-4 pb-4 flex gap-2">
                      <ReservationActions id={r.id} status={r.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

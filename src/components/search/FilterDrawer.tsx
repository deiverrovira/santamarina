'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SlidersHorizontal, X, ChevronRight, Check } from 'lucide-react'
import type { Amenity } from '@prisma/client'

interface Filters {
  minPrice:   string
  maxPrice:   string
  bedrooms:   string
  sortBy:     string
  amenityIds: string[]  // array de IDs como strings
}

const PRICE_OPTIONS = [
  { label: 'Cualquier precio',      minPrice: '',       maxPrice: ''       },
  { label: 'Hasta $300.000/noche',  minPrice: '',       maxPrice: '300000' },
  { label: '$300.000 – $600.000',   minPrice: '300000', maxPrice: '600000' },
  { label: 'Más de $600.000/noche', minPrice: '600000', maxPrice: ''       },
]

const BEDROOM_OPTIONS = [
  { label: 'Cualquier cantidad', value: '' },
  { label: '1+ habitación',      value: '1' },
  { label: '2+ habitaciones',    value: '2' },
  { label: '3+ habitaciones',    value: '3' },
  { label: '4+ habitaciones',    value: '4' },
]

const SORT_OPTIONS = [
  { label: 'Menor precio',  value: 'price_asc'  },
  { label: 'Mayor precio',  value: 'price_desc' },
  { label: 'Más reciente',  value: 'newest'     },
]

// ── Sección ────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</h3>
      {children}
    </div>
  )
}

// ── Opción radio ────────────────────────────────────────────────────────────
function RadioOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
        active
          ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
          : 'text-gray-700 hover:bg-gray-50 border border-transparent'
      }`}
    >
      {label}
      {active && <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />}
    </button>
  )
}

// ── Componente principal ────────────────────────────────────────────────────
interface FilterDrawerProps {
  amenities: Amenity[]
}

export default function FilterDrawer({ amenities }: FilterDrawerProps) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    minPrice:   searchParams.get('minPrice')   ?? '',
    maxPrice:   searchParams.get('maxPrice')   ?? '',
    bedrooms:   searchParams.get('bedrooms')   ?? '',
    sortBy:     searchParams.get('sortBy')     ?? '',
    amenityIds: searchParams.get('amenityIds') ? searchParams.get('amenityIds')!.split(',') : [],
  })

  useEffect(() => {
    setFilters({
      minPrice:   searchParams.get('minPrice')   ?? '',
      maxPrice:   searchParams.get('maxPrice')   ?? '',
      bedrooms:   searchParams.get('bedrooms')   ?? '',
      sortBy:     searchParams.get('sortBy')     ?? '',
      amenityIds: searchParams.get('amenityIds') ? searchParams.get('amenityIds')!.split(',') : [],
    })
  }, [searchParams])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const activeCount = [
    filters.minPrice || filters.maxPrice,
    filters.bedrooms,
    filters.sortBy && filters.sortBy !== 'price_asc',
    filters.amenityIds.length > 0,
  ].filter(Boolean).length

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())
    const set = (key: string, val: string) => val ? params.set(key, val) : params.delete(key)
    set('minPrice',   filters.minPrice)
    set('maxPrice',   filters.maxPrice)
    set('bedrooms',   filters.bedrooms)
    set('sortBy',     filters.sortBy === 'price_asc' ? '' : filters.sortBy)
    set('amenityIds', filters.amenityIds.join(','))
    router.push(`/apartamentos?${params.toString()}`)
    setOpen(false)
  }

  function clearFilters() {
    const empty: Filters = { minPrice: '', maxPrice: '', bedrooms: '', sortBy: '', amenityIds: [] }
    setFilters(empty)
    const params = new URLSearchParams(searchParams.toString())
    ;['minPrice', 'maxPrice', 'bedrooms', 'sortBy', 'amenityIds'].forEach(k => params.delete(k))
    router.push(`/apartamentos?${params.toString()}`)
    setOpen(false)
  }

  function toggleAmenity(id: string) {
    setFilters(f => ({
      ...f,
      amenityIds: f.amenityIds.includes(id)
        ? f.amenityIds.filter(a => a !== id)
        : [...f.amenityIds, id],
    }))
  }

  const selectedPriceIdx = PRICE_OPTIONS.findIndex(
    o => o.minPrice === filters.minPrice && o.maxPrice === filters.maxPrice
  )

  return (
    <>
      {/* ── Botón disparador ── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
          activeCount > 0
            ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-sm'
            : 'border-blue-300 bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-400'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-700 text-white text-xs font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Drawer ── */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Precio */}
          <Section title="Precio por noche">
            <div className="space-y-1.5">
              {PRICE_OPTIONS.map((opt, i) => (
                <RadioOption
                  key={opt.label}
                  label={opt.label}
                  active={selectedPriceIdx === i}
                  onClick={() => setFilters(f => ({ ...f, minPrice: opt.minPrice, maxPrice: opt.maxPrice }))}
                />
              ))}
            </div>
          </Section>

          {/* Habitaciones */}
          <Section title="Habitaciones">
            <div className="space-y-1.5">
              {BEDROOM_OPTIONS.map(opt => (
                <RadioOption
                  key={opt.label}
                  label={opt.label}
                  active={filters.bedrooms === opt.value}
                  onClick={() => setFilters(f => ({ ...f, bedrooms: opt.value }))}
                />
              ))}
            </div>
          </Section>

          {/* Comodidades */}
          {amenities.length > 0 && (
            <Section title="Comodidades">
              <div className="grid grid-cols-2 gap-2">
                {amenities.map(amenity => {
                  const checked = filters.amenityIds.includes(String(amenity.id))
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(String(amenity.id))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all border ${
                        checked
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                          : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-4 h-4 rounded flex items-center justify-center ${
                        checked ? 'bg-blue-600' : 'border border-gray-300 bg-white'
                      }`}>
                        {checked && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className="truncate">{amenity.name}</span>
                    </button>
                  )
                })}
              </div>
            </Section>
          )}

          {/* Ordenar por */}
          <Section title="Ordenar por">
            <div className="space-y-1.5">
              {SORT_OPTIONS.map(opt => (
                <RadioOption
                  key={opt.value}
                  label={opt.label}
                  active={(filters.sortBy || 'price_asc') === opt.value}
                  onClick={() => setFilters(f => ({ ...f, sortBy: opt.value }))}
                />
              ))}
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={clearFilters}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm font-semibold transition-colors shadow-sm"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  )
}

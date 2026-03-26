'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'

// ── Opciones de cada filtro ────────────────────────────────────────────────

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

// ── Chip genérico ──────────────────────────────────────────────────────────

interface ChipProps {
  label: string
  active: boolean
  open: boolean
  onClick: () => void
}

function Chip({ label, active, open, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all select-none whitespace-nowrap ${
        active
          ? 'border-teal-400 bg-teal-50 text-teal-700 shadow-sm'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-800'
      }`}
    >
      {label}
      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}

// ── Dropdown wrapper ───────────────────────────────────────────────────────

function Dropdown({ open, children }: { open: boolean; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="absolute top-full left-0 mt-2 z-50 min-w-[200px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      {children}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────

export default function FilterBar() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  const [openChip, setOpenChip] = useState<'price' | 'bedrooms' | 'sort' | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // Leer valores actuales de la URL
  const minPrice = searchParams.get('minPrice') ?? ''
  const maxPrice = searchParams.get('maxPrice') ?? ''
  const bedrooms = searchParams.get('bedrooms') ?? ''
  const sortBy   = searchParams.get('sortBy')   ?? ''

  const hasActiveFilters = !!(minPrice || maxPrice || bedrooms || sortBy)

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenChip(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Actualizar URL preservando todos los params existentes
  function applyFilter(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, val]) => {
      if (val) params.set(key, val)
      else params.delete(key)
    })
    router.push(`/apartamentos?${params.toString()}`)
    setOpenChip(null)
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('bedrooms')
    params.delete('sortBy')
    router.push(`/apartamentos?${params.toString()}`)
  }

  // Labels activos para los chips
  const priceLabel = PRICE_OPTIONS.find(
    o => o.minPrice === minPrice && o.maxPrice === maxPrice
  )?.label ?? 'Precio'

  const bedroomLabel = BEDROOM_OPTIONS.find(o => o.value === bedrooms)?.label ?? 'Habitaciones'

  const sortLabel = SORT_OPTIONS.find(o => o.value === (sortBy || 'price_asc'))?.label ?? 'Menor precio'

  const isPriceActive    = !!(minPrice || maxPrice)
  const isBedroomActive  = !!bedrooms
  const isSortActive     = !!sortBy && sortBy !== 'price_asc'

  return (
    <div ref={barRef} className="flex items-center gap-2 flex-wrap">
      <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />

      {/* ── Chip Precio ── */}
      <div className="relative">
        <Chip
          label={isPriceActive ? priceLabel : 'Precio'}
          active={isPriceActive}
          open={openChip === 'price'}
          onClick={() => setOpenChip(openChip === 'price' ? null : 'price')}
        />
        <Dropdown open={openChip === 'price'}>
          {PRICE_OPTIONS.map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => applyFilter({ minPrice: opt.minPrice, maxPrice: opt.maxPrice })}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                opt.minPrice === minPrice && opt.maxPrice === maxPrice
                  ? 'text-teal-700 font-semibold bg-teal-50'
                  : 'text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </Dropdown>
      </div>

      {/* ── Chip Habitaciones ── */}
      <div className="relative">
        <Chip
          label={isBedroomActive ? bedroomLabel : 'Habitaciones'}
          active={isBedroomActive}
          open={openChip === 'bedrooms'}
          onClick={() => setOpenChip(openChip === 'bedrooms' ? null : 'bedrooms')}
        />
        <Dropdown open={openChip === 'bedrooms'}>
          {BEDROOM_OPTIONS.map(opt => (
            <button
              key={opt.label}
              type="button"
              onClick={() => applyFilter({ bedrooms: opt.value })}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                opt.value === bedrooms
                  ? 'text-teal-700 font-semibold bg-teal-50'
                  : 'text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </Dropdown>
      </div>

      {/* ── Chip Ordenar ── */}
      <div className="relative">
        <Chip
          label={`Ordenar: ${sortLabel}`}
          active={isSortActive}
          open={openChip === 'sort'}
          onClick={() => setOpenChip(openChip === 'sort' ? null : 'sort')}
        />
        <Dropdown open={openChip === 'sort'}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => applyFilter({ sortBy: opt.value === 'price_asc' ? '' : opt.value })}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                (sortBy || 'price_asc') === opt.value
                  ? 'text-teal-700 font-semibold bg-teal-50'
                  : 'text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </Dropdown>
      </div>

      {/* ── Botón limpiar ── */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Limpiar
        </button>
      )}
    </div>
  )
}

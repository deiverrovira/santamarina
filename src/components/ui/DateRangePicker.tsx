'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'
import { format, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

interface DateRangePickerProps {
  label?: string
  checkIn?: string       // formato YYYY-MM-DD
  checkOut?: string      // formato YYYY-MM-DD
  onRangeChange: (checkIn: string, checkOut: string) => void
  error?: string
  minDate?: Date
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined
  const d = new Date(value + 'T00:00:00')
  return isValid(d) ? d : undefined
}

function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export default function DateRangePicker({
  label,
  checkIn,
  checkOut,
  onRangeChange,
  error,
  minDate,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [popoverStyle, setPopoverStyle] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 300,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const fromDate = parseDate(checkIn)
  const toDate = parseDate(checkOut)

  const selected: DateRange | undefined =
    fromDate ? { from: fromDate, to: toDate } : undefined

  // Calcular posición del popover basada en el botón disparador
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setPopoverStyle({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    })
  }, [])

  // Abrir/cerrar y calcular posición
  const handleToggle = () => {
    if (!open) updatePosition()
    setOpen((prev) => !prev)
  }

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const popover = document.getElementById('date-range-popover')
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popover &&
        !popover.contains(target)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Reposicionar al hacer scroll o resize
  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  function handleSelect(range: DateRange | undefined) {
    if (!range) {
      onRangeChange('', '')
      return
    }
    const newCheckIn = range.from ? toISODate(range.from) : ''
    const newCheckOut = range.to ? toISODate(range.to) : ''
    onRangeChange(newCheckIn, newCheckOut)

    // Cerrar solo cuando ambas fechas están seleccionadas
    if (range.from && range.to) {
      setOpen(false)
    }
  }

  // Texto del botón
  const displayText =
    fromDate && toDate
      ? `${format(fromDate, 'd MMM', { locale: es })} → ${format(toDate, 'd MMM yyyy', { locale: es })}`
      : fromDate
      ? `${format(fromDate, 'd MMM yyyy', { locale: es })} → Salida`
      : 'Selecciona las fechas'

  const hasValue = !!fromDate

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Botón disparador */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={[
          'flex items-center gap-2 w-full rounded-xl border px-4 py-2.5 text-sm text-left transition-all',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          error
            ? 'border-red-400 bg-red-50 text-red-700'
            : open
            ? 'border-blue-500 bg-white text-gray-900'
            : hasValue
            ? 'border-gray-300 bg-white text-gray-900'
            : 'border-gray-200 bg-white text-gray-400',
        ].join(' ')}
      >
        <CalendarIcon className="w-4 h-4 shrink-0 text-gray-400" />
        <span className="flex-1">{displayText}</span>
      </button>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Popover renderizado en el body via Portal — escapa de overflow-hidden */}
      {open &&
        createPortal(
          <div
            id="date-range-popover"
            style={{
              position: 'absolute',
              top: popoverStyle.top,
              left: popoverStyle.left,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 min-w-[320px]"
          >
            <DayPicker
              mode="range"
              selected={selected}
              onSelect={handleSelect}
              locale={es}
              disabled={minDate ? { before: minDate } : undefined}
              defaultMonth={fromDate ?? (minDate ?? new Date())}
              numberOfMonths={1}
              showOutsideDays={false}
              classNames={{
                // Contenedor raíz
                root: 'w-full',
                months: 'flex flex-col gap-4',
                month: 'flex flex-col gap-3',
                // Cabecera del mes
                month_caption: 'flex justify-center relative items-center h-9',
                caption_label: 'text-sm font-semibold text-gray-900 capitalize',
                nav: 'flex absolute inset-x-0 top-0 justify-between items-center h-9',
                button_previous:
                  'w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors',
                button_next:
                  'w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors',
                // Grid de días
                month_grid: 'w-full border-collapse',
                weekdays: 'flex mb-1',
                weekday:
                  'text-gray-400 font-medium text-xs w-10 h-9 flex items-center justify-center uppercase',
                weeks: 'flex flex-col gap-0.5',
                week: 'flex',
                // Celda individual
                day: 'relative p-0 flex items-center justify-center w-10 h-10',
                day_button:
                  'w-10 h-10 flex items-center justify-center rounded-full text-sm text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer font-normal',
                // Estados de selección — estilo Airbnb
                selected:
                  'bg-sky-200 hover:bg-sky-200 font-semibold rounded-full',
                range_start:
                  'bg-sky-300 hover:bg-sky-300 rounded-l-full rounded-r-none',
                range_end:
                  'bg-sky-300 hover:bg-sky-300 rounded-r-full rounded-l-none',
                range_middle:
                  'bg-sky-200 hover:bg-sky-200 rounded-none',
                // Estados especiales
                today:
                  'font-bold text-gray-900 underline underline-offset-2 decoration-gray-400',
                outside: 'text-blue-300 opacity-40',
                disabled:
                  'text-gray-300 cursor-not-allowed hover:bg-transparent opacity-40',
                hidden: 'invisible',
              }}
            />

            {/* Botón limpiar */}
            {hasValue && (
              <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {fromDate && !toDate ? 'Selecciona la fecha de salida' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRangeChange('', '')
                    setOpen(false)
                  }}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  Limpiar fechas
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

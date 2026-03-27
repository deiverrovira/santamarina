import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T12:00:00') : date
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = end.getTime() - start.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

export function toDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatThousands(amount: number): string {
  return new Intl.NumberFormat('es-CO').format(amount)
}

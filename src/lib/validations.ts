import { z } from 'zod'

export const SearchSchema = z.object({
  checkIn: z.string().min(1, 'La fecha de entrada es obligatoria'),
  checkOut: z.string().min(1, 'La fecha de salida es obligatoria'),
  adults: z.number().min(1, 'Mínimo 1 adulto').max(20, 'Máximo 20 adultos'),
  children: z.number().min(0, 'No puede ser negativo').max(10, 'Máximo 10 niños'),
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'La fecha de salida debe ser posterior a la de entrada', path: ['checkOut'] }
)

export const BookingSchema = z.object({
  apartmentId: z.number().int().positive(),
  guestName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  guestEmail: z.string().email('Correo electrónico inválido'),
  guestPhone: z.string().regex(/^\+?[\d\s\-()\\.]{7,20}$/, 'Teléfono inválido'),
  checkIn: z.string().min(1, 'La fecha de entrada es obligatoria'),
  checkOut: z.string().min(1, 'La fecha de salida es obligatoria'),
  adults: z.number().min(1, 'Mínimo 1 adulto').max(20),
  children: z.number().min(0).max(10),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'La fecha de salida debe ser posterior a la de entrada', path: ['checkOut'] }
)

export type SearchInput = z.infer<typeof SearchSchema>
export type BookingInput = z.infer<typeof BookingSchema>

import { z } from 'zod'

const ALLOWED_EMAIL_DOMAINS = [
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'outlook.es', 'outlook.com.co',
  'hotmail.com', 'hotmail.es', 'hotmail.co',
  'live.com', 'live.es', 'live.com.co', 'msn.com',
  // Yahoo
  'yahoo.com', 'yahoo.es', 'yahoo.co',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // ProtonMail
  'protonmail.com', 'proton.me',
  // Otros reconocidos
  'aol.com', 'zoho.com', 'mail.com', 'gmx.com', 'gmx.net',
  // Colombia
  'une.net.co', 'telmex.com.co',
]

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
  guestEmail: z.string()
    .email('Correo electrónico inválido')
    .refine(
      (email) => {
        const domain = email.split('@')[1]?.toLowerCase()
        return domain ? ALLOWED_EMAIL_DOMAINS.includes(domain) : false
      },
      { message: 'Por favor usa un correo de un proveedor reconocido (Gmail, Outlook, Yahoo, etc.)' }
    ),
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

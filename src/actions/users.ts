'use server'

import { prisma } from '@/lib/prisma'
import { requireRole } from '@/actions/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ── Schemas de validación ─────────────────────────────────────────────────────
const CreateUserSchema = z.object({
  email:    z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role:     z.enum(['admin', 'newApartament', 'guest'], { message: 'Rol inválido' }),
  status:   z.enum(['active', 'inactive']).default('active'),
})

const UpdateUserSchema = z.object({
  email:    z.string().email('Correo inválido').optional(),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  role:     z.enum(['admin', 'newApartament', 'guest']).optional(),
  status:   z.enum(['active', 'inactive']).optional(),
})

// ── Obtener todos los usuarios (sin password) ─────────────────────────────────
export async function getUsers() {
  await requireRole('admin')
  return prisma.user.findMany({
    select: { id: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
    orderBy: { createdAt: 'desc' },
  })
}

// ── Obtener un usuario por id ─────────────────────────────────────────────────
export async function getUserById(id: number) {
  await requireRole('admin')
  return prisma.user.findUnique({
    where:  { id },
    select: { id: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
  })
}

// ── Crear usuario ─────────────────────────────────────────────────────────────
export async function createUser(formData: FormData) {
  await requireRole('admin')

  const raw = {
    email:    formData.get('email'),
    password: formData.get('password'),
    role:     formData.get('role'),
    status:   formData.get('status') ?? 'active',
  }

  const parsed = CreateUserSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { email, password, role, status } = parsed.data

  // Verificar que el email no exista
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (exists) return { success: false, errors: { email: ['Este correo ya está registrado'] } }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { email: email.toLowerCase(), password: hashed, role, status },
  })

  revalidatePath('/admin/usuarios')
  return { success: true }
}

// ── Actualizar usuario ────────────────────────────────────────────────────────
export async function updateUser(id: number, formData: FormData) {
  await requireRole('admin')

  const raw = {
    email:    formData.get('email'),
    password: formData.get('password'),
    role:     formData.get('role'),
    status:   formData.get('status'),
  }

  const parsed = UpdateUserSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const { email, password, role, status } = parsed.data

  // Verificar que el email no esté en uso por otro usuario
  if (email) {
    const exists = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), NOT: { id } },
    })
    if (exists) return { success: false, errors: { email: ['Este correo ya está en uso'] } }
  }

  const data: Record<string, unknown> = {}
  if (email)                    data.email  = email.toLowerCase()
  if (role)                     data.role   = role
  if (status)                   data.status = status
  if (password && password !== '') data.password = await bcrypt.hash(password, 12)

  await prisma.user.update({ where: { id }, data })

  revalidatePath('/admin/usuarios')
  return { success: true }
}

// ── Eliminar usuario ──────────────────────────────────────────────────────────
export async function deleteUser(id: number) {
  await requireRole('admin')

  // Proteger: no permitir eliminar el último admin
  const user = await prisma.user.findUnique({ where: { id } })
  if (user?.role === 'admin') {
    const adminCount = await prisma.user.count({ where: { role: 'admin' } })
    if (adminCount <= 1) {
      return { success: false, error: 'No puedes eliminar el único administrador del sistema.' }
    }
  }

  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/usuarios')
  return { success: true }
}

'use server'

import { getServerSession } from 'next-auth'
import { authOptions, UserRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Obtener sesión actual en Server Components / Server Actions
export async function getSession() {
  return await getServerSession(authOptions)
}

// Obtener usuario de la sesión o null
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

// Verificar que el usuario tenga el rol requerido
// Si no, redirige al login o a la home
export async function requireRole(roles: UserRole | UserRole[]) {
  const user = await getCurrentUser()

  if (!user) redirect('/login')

  const allowed = Array.isArray(roles) ? roles : [roles]
  if (!allowed.includes(user.role as UserRole)) redirect('/')

  return user
}

// Verificar solo autenticación (cualquier rol)
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

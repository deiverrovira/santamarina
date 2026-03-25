import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export type UserRole = 'admin' | 'newApartament' | 'guest'

export const authOptions: NextAuthOptions = {
  // Usamos JWT — sin tabla de sesiones en BD
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',  // página personalizada de login
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',      type: 'email'    },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Buscar usuario en BD
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user) return null
        if (user.status !== 'active') return null

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) return null

        // Devolver objeto limpio (sin password)
        return {
          id:    String(user.id),
          email: user.email,
          role:  user.role as UserRole,
        }
      },
    }),
  ],

  callbacks: {
    // Guardar role e id en el JWT
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as { role: UserRole }).role
      }
      return token
    },
    // Exponer role e id en la sesión del cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
}

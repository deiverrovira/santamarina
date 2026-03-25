import { getSession } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import LoginForm from './LoginForm'
import Image from 'next/image'

export const metadata = { title: 'Iniciar sesión · Santa Marina' }

export default async function LoginPage() {
  // Si ya tiene sesión → redirigir
  const session = await getSession()
  if (session) {
    if (session.user.role === 'admin') redirect('/admin')
    if (session.user.role === 'newApartament') redirect('/admin/apartamentos')
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo + título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-800 shadow-lg mb-4 overflow-hidden">
            <Image
              src="/logos/Santa-marina-blanco.png"
              alt="Santa Marina"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Santa Marina</h1>
          <p className="text-sm text-gray-500 mt-1">Conjunto Turístico · Panel de gestión</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Iniciar sesión</h2>
          <p className="text-sm text-gray-400 mb-6">Ingresa tus credenciales para continuar</p>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Conjunto Turístico Santa Marina
        </p>
      </div>
    </div>
  )
}

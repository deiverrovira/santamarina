import { requireRole } from '@/actions/auth'
import UserForm from '../UserForm'

export const metadata = { title: 'Nuevo usuario · Admin Santa Marina' }

export default async function NewUserPage() {
  await requireRole('admin')
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nuevo usuario</h1>
          <p className="text-sm text-gray-400 mt-1">Completa los datos para crear un nuevo acceso al sistema</p>
        </div>
        <UserForm mode="create" />
      </div>
    </div>
  )
}

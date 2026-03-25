import { requireRole } from '@/actions/auth'
import { getUserById } from '@/actions/users'
import { notFound } from 'next/navigation'
import UserForm from '../../UserForm'

export const metadata = { title: 'Editar usuario · Admin Santa Marina' }

interface PageProps {
  params: { id: string }
}

export default async function EditUserPage({ params }: PageProps) {
  await requireRole('admin')

  const id   = Number(params.id)
  const user = await getUserById(id)
  if (!user) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar usuario</h1>
          <p className="text-sm text-gray-400 mt-1">{user.email}</p>
        </div>
        <UserForm
          mode="edit"
          user={{ id: user.id, email: user.email, role: user.role, status: user.status }}
        />
      </div>
    </div>
  )
}

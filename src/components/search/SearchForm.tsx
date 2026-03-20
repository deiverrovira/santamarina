'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchSchema, type SearchInput } from '@/lib/validations'
import { toDateInputValue } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Search } from 'lucide-react'

interface SearchFormProps {
  defaultValues?: Partial<SearchInput>
  compact?: boolean
}

export default function SearchForm({ defaultValues, compact = false }: SearchFormProps) {
  const router = useRouter()
  const today = toDateInputValue(new Date())

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchInput>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      adults: 2,
      children: 0,
      ...defaultValues,
    },
  })

  const onSubmit = (data: SearchInput) => {
    const params = new URLSearchParams({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: String(data.adults),
      children: String(data.children),
    })
    router.push(`/apartamentos?${params.toString()}`)
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-2 items-end">
        <Input label="Entrada" type="date" min={today} {...register('checkIn')} error={errors.checkIn?.message} className="w-36" />
        <Input label="Salida" type="date" min={today} {...register('checkOut')} error={errors.checkOut?.message} className="w-36" />
        <Input label="Adultos" type="number" min={1} max={20} {...register('adults', { valueAsNumber: true })} error={errors.adults?.message} className="w-20" />
        <Input label="Niños" type="number" min={0} max={10} {...register('children', { valueAsNumber: true })} error={errors.children?.message} className="w-20" />
        <Button type="submit" size="md">
          <Search className="w-4 h-4" />
          Buscar
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Input
            label="Fecha de entrada"
            type="date"
            min={today}
            {...register('checkIn')}
            error={errors.checkIn?.message}
          />
        </div>
        <div>
          <Input
            label="Fecha de salida"
            type="date"
            min={today}
            {...register('checkOut')}
            error={errors.checkOut?.message}
          />
        </div>
        <div>
          <Input
            label="Adultos"
            type="number"
            min={1}
            max={20}
            {...register('adults', { valueAsNumber: true })}
            error={errors.adults?.message}
            helperText="Mínimo 1"
          />
        </div>
        <div>
          <Input
            label="Niños"
            type="number"
            min={0}
            max={10}
            {...register('children', { valueAsNumber: true })}
            error={errors.children?.message}
            helperText="De 0 a 12 años"
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <Search className="w-5 h-5" />
        Buscar apartamentos disponibles
      </Button>
    </form>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchSchema, type SearchInput } from '@/lib/validations'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DateRangePicker from '@/components/ui/DateRangePicker'
import { Search } from 'lucide-react'

interface SearchFormProps {
  defaultValues?: Partial<SearchInput>
  compact?: boolean
}

export default function SearchForm({ defaultValues, compact = false }: SearchFormProps) {
  const router = useRouter()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchInput>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      adults: 2,
      children: 0,
      checkIn: '',
      checkOut: '',
      ...defaultValues,
    },
  })

  const watchCheckIn = watch('checkIn')
  const watchCheckOut = watch('checkOut')

  const handleRangeChange = (checkIn: string, checkOut: string) => {
    setValue('checkIn', checkIn, { shouldValidate: true })
    setValue('checkOut', checkOut, { shouldValidate: true })
  }

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
        <div className="min-w-[260px]">
          <DateRangePicker
            label="Fechas"
            checkIn={watchCheckIn}
            checkOut={watchCheckOut}
            onRangeChange={handleRangeChange}
            minDate={today}
            error={errors.checkIn?.message || errors.checkOut?.message}
          />
        </div>
        <Input
          label="Adultos"
          type="number"
          min={1}
          max={20}
          {...register('adults', { valueAsNumber: true })}
          error={errors.adults?.message}
          className="w-20"
        />
        <Input
          label="Niños"
          type="number"
          min={0}
          max={10}
          {...register('children', { valueAsNumber: true })}
          error={errors.children?.message}
          className="w-20"
        />
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
        <div className="sm:col-span-2">
          <DateRangePicker
            label="Fechas de estadía"
            checkIn={watchCheckIn}
            checkOut={watchCheckOut}
            onRangeChange={handleRangeChange}
            minDate={today}
            error={errors.checkIn?.message || errors.checkOut?.message}
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

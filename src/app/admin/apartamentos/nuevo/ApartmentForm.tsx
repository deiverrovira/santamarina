'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'
import type { Amenity, Apartment, ApartmentImage } from '@prisma/client'
import { createApartment, updateApartment } from '@/actions/apartments'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { X, ImagePlus, CheckCircle2 } from 'lucide-react'

// ── Zod schema ───────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  slug: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  shortDescription: z
    .string()
    .min(10, 'Mínimo 10 caracteres')
    .max(150, 'Máximo 150 caracteres'),
  description: z.string().min(20, 'Mínimo 20 caracteres'),
  maxAdults: z.number().int().min(1, 'Mínimo 1').max(20),
  maxChildren: z.number().int().min(0).max(20),
  bedrooms: z.number().int().min(1, 'Mínimo 1'),
  bathrooms: z.number().int().min(1, 'Mínimo 1'),
  pricePerNight: z.number().min(1000, 'Mínimo $1.000'),
  isActive: z.boolean(),
  amenityIds: z.array(z.number()),
})

type FormValues = z.infer<typeof schema>

// ── Slug generator ────────────────────────────────────────────────────────────
function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface UploadedImage {
  url: string
  alt: string
  order: number
}

type ApartmentWithAmenities = Apartment & {
  images: ApartmentImage[]
  amenities: { amenity: Amenity }[]
}

interface ApartmentFormProps {
  amenities: Amenity[]
  apartment?: ApartmentWithAmenities  // si viene → modo edición
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ApartmentForm({ amenities, apartment }: ApartmentFormProps) {
  const isEditing = !!apartment

  const [images, setImages] = useState<UploadedImage[]>(
    apartment?.images.map((img) => ({ url: img.url, alt: img.alt, order: img.order })) ?? []
  )
  const [imageError, setImageError] = useState<string | null>(null)
  const [successSlug, setSuccessSlug] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: apartment?.name ?? '',
      slug: apartment?.slug ?? '',
      shortDescription: apartment?.shortDescription ?? '',
      description: apartment?.description ?? '',
      maxAdults: apartment?.maxAdults ?? 2,
      maxChildren: apartment?.maxChildren ?? 0,
      bedrooms: apartment?.bedrooms ?? 1,
      bathrooms: apartment?.bathrooms ?? 1,
      pricePerNight: apartment?.pricePerNight ?? 150000,
      isActive: apartment?.isActive ?? true,
      amenityIds: apartment?.amenities.map((a) => a.amenity.id) ?? [],
    },
  })

  const shortDescValue = watch('shortDescription') ?? ''
  const isActiveValue = watch('isActive')

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setValue('name', val)
    // En edición no sobreescribimos el slug automáticamente
    if (!isEditing) {
      setValue('slug', toSlug(val), { shouldValidate: false })
    }
  }

  function toggleAmenity(id: number) {
    const current = watch('amenityIds') ?? []
    setValue(
      'amenityIds',
      current.includes(id) ? current.filter((a) => a !== id) : [...current, id]
    )
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })))
  }

  function updateAlt(index: number, alt: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, alt } : img)))
  }

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    setImageError(null)

    if (images.length === 0) {
      setImageError('Debes subir al menos una imagen.')
      return
    }

    startTransition(async () => {
      const payload = { ...data, images }

      const result = isEditing
        ? await updateApartment(apartment.id, payload)
        : await createApartment(payload)

      if (result.success && result.slug) {
        setSuccessSlug(result.slug)
      } else {
        setServerError(result.error ?? 'Error desconocido al guardar el apartamento.')
      }
    })
  }

  const loading = isSubmitting || isPending

  // ── Success state ──────────────────────────────────────────────────────────
  if (successSlug) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isEditing ? 'Apartamento actualizado' : 'Apartamento creado'}
          </h2>
          <p className="text-gray-500 text-sm">Los cambios se guardaron correctamente.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/apartamentos/${successSlug}`}
            className="bg-teal-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-teal-700 transition-colors"
          >
            Ver apartamento
          </Link>
          <Link
            href="/admin/apartamentos"
            className="border border-gray-200 text-gray-600 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Volver a mis apartamentos
          </Link>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column: basic info (2/3) ────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Información básica
            </h2>

            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Nombre del apartamento <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                onChange={handleNameChange}
                placeholder="Ej: Apartamento Mariana Suite"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <Input
              label="Slug (URL)"
              placeholder="ej: apartamento-mariana-suite"
              {...register('slug')}
              error={errors.slug?.message}
              helperText="Solo minúsculas, números y guiones."
            />

            {/* Short description */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Descripción corta <span className="text-red-400">*</span>
                </label>
                <span className={`text-xs ${shortDescValue.length > 140 ? 'text-amber-500' : 'text-gray-400'}`}>
                  {shortDescValue.length}/150
                </span>
              </div>
              <textarea
                {...register('shortDescription')}
                rows={2}
                placeholder="Breve descripción que aparece en los listados..."
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 resize-none ${
                  errors.shortDescription
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
              {errors.shortDescription && <p className="text-xs text-red-500">{errors.shortDescription.message}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Descripción completa <span className="text-red-400">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder="Describe el apartamento en detalle..."
                className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 resize-none ${
                  errors.description
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          {/* Capacity & pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Capacidad y tarifa
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Adultos máx." type="number" min={1} max={20}
                {...register('maxAdults', { valueAsNumber: true })} error={errors.maxAdults?.message} />
              <Input label="Niños máx." type="number" min={0} max={20}
                {...register('maxChildren', { valueAsNumber: true })} error={errors.maxChildren?.message} />
              <Input label="Habitaciones" type="number" min={1}
                {...register('bedrooms', { valueAsNumber: true })} error={errors.bedrooms?.message} />
              <Input label="Baños" type="number" min={1}
                {...register('bathrooms', { valueAsNumber: true })} error={errors.bathrooms?.message} />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Precio COP / noche <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium select-none">$</span>
                <input
                  type="number" min={1000} step={1000}
                  {...register('pricePerNight', { valueAsNumber: true })}
                  placeholder="150000"
                  className={`w-full rounded-xl border pl-8 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.pricePerNight
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                />
              </div>
              {errors.pricePerNight && <p className="text-xs text-red-500">{errors.pricePerNight.message}</p>}
            </div>

            {/* isActive toggle */}
            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Publicado</p>
                <p className="text-xs text-gray-400">El apartamento aparece en el listado público</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isActiveValue}
                onClick={() => setValue('isActive', !isActiveValue)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  isActiveValue ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isActiveValue ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right column: amenities + images (1/3) ───────────────────────── */}
        <div className="space-y-6">

          {/* Amenities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Comodidades</h2>
            {amenities.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No hay comodidades registradas.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {amenities.map((amenity) => {
                  const checked = (watch('amenityIds') ?? []).includes(amenity.id)
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
                        checked ? 'bg-teal-50 border border-teal-200' : 'border border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className={`text-sm ${checked ? 'font-medium text-teal-700' : 'text-gray-700'}`}>
                        {amenity.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-4">Imágenes</h2>

            <CldUploadWidget
              uploadPreset="mariana_apartments"
              options={{ folder: 'mariana', multiple: true, maxFiles: 10 }}
              onSuccess={(result) => {
                if (
                  result.event === 'success' &&
                  typeof result.info === 'object' &&
                  result.info !== null &&
                  'secure_url' in result.info
                ) {
                  const info = result.info as { secure_url: string }
                  setImages((prev) => [...prev, { url: info.secure_url, alt: '', order: prev.length }])
                  setImageError(null)
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-4 text-sm font-medium text-gray-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/50 transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                  Subir imagen
                </button>
              )}
            </CldUploadWidget>

            {imageError && <p className="mt-2 text-xs text-red-500">{imageError}</p>}

            {images.length > 0 ? (
              <div className="mt-4 space-y-3">
                {images.map((img, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image src={img.url} alt={img.alt || `Imagen ${index + 1}`} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1.5">Texto alternativo</p>
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => updateAlt(index, e.target.value)}
                        placeholder="Descripción de la imagen..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors mt-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-gray-400 text-center">Sin imágenes. Sube al menos una.</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {serverError && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {serverError}
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        <Link
          href="/admin/apartamentos"
          className="border border-gray-200 text-gray-600 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <Button type="submit" loading={loading} size="md">
          {isEditing ? 'Guardar cambios' : 'Crear apartamento'}
        </Button>
      </div>
    </form>
  )
}

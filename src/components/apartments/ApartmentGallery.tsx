'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ApartmentImage } from '@prisma/client'

interface ApartmentGalleryProps {
  images: ApartmentImage[]
  name?: string
}

export default function ApartmentGallery({ images }: ApartmentGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return (
      <div className="w-full h-80 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
        <span className="text-teal-400 text-6xl">🏖️</span>
      </div>
    )
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="space-y-3">
      <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden group">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-white w-5' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver ${img.alt}`}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${
                i === activeIndex ? 'ring-2 ring-teal-500 ring-offset-1' : 'opacity-60 hover:opacity-90'
              }`}
            >
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

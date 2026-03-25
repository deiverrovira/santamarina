'use client'

/**
 * ImageUpload — Widget de Cloudinary para subir fotos de apartamentos.
 *
 * Uso en el panel admin:
 *   <ImageUpload onUpload={(url) => console.log('URL Cloudinary:', url)} />
 *
 * La URL resultante tiene formato:
 *   https://res.cloudinary.com/TU-CLOUD/image/upload/v.../mariana/nombre-foto.jpg
 *
 * Esa URL es la que debes guardar en ApartmentImage.url en la base de datos.
 */

import { CldUploadWidget } from 'next-cloudinary'
import { Upload } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  label?: string
}

export default function ImageUpload({ onUpload, label = 'Subir foto' }: ImageUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="mariana_apartments"   // ← crear este preset en Cloudinary (ver abajo)
      options={{
        folder: 'mariana',               // las fotos quedan en /mariana/ en tu cuenta
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 5_000_000,          // 5 MB máximo
        cropping: false,
      }}
      onSuccess={(result) => {
        if (result.event === 'success' && typeof result.info === 'object' && result.info !== null) {
          const info = result.info as { secure_url: string }
          onUpload(info.secure_url)
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium px-4 py-3 text-sm transition-colors"
        >
          <Upload className="w-4 h-4" />
          {label}
        </button>
      )}
    </CldUploadWidget>
  )
}

/*
 * ── CONFIGURAR UPLOAD PRESET EN CLOUDINARY ──────────────────────────────────
 *
 * 1. Ve a https://cloudinary.com → Settings → Upload → Upload Presets
 * 2. Click "Add upload preset"
 * 3. Preset name: "mariana_apartments"
 * 4. Signing mode: "Unsigned"  (importante para uso desde el navegador)
 * 5. Folder: "mariana"
 * 6. Save
 *
 * ── ACTIVAR FETCH (para las imágenes del seed) ──────────────────────────────
 *
 * 1. Ve a Settings → Security → Allowed fetch domains
 * 2. Agrega: images.unsplash.com
 * 3. Save
 *
 * Con esto las imágenes del seed se sirven desde tu CDN de Cloudinary.
 * ────────────────────────────────────────────────────────────────────────────
 */

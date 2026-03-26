import Link from 'next/link'
import {
  Waves, Utensils, Baby, Trees, Laptop,
  Wind, ChevronRight, Star,
} from 'lucide-react'
import MapaInteractivo from '@/components/areas-comunes/MapaInteractivo'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Áreas Comunes · Santa Marina',
  description:
    'Descubre más de 60 amenidades distribuidas en 6 macroetapas del Conjunto Turístico Santa Marina. Club de playa, piscinas, spa, coworking y mucho más.',
}

// ── Estadísticas ──────────────────────────────────────────────────────────────
const stats = [
  { value: '6',   label: 'Macroetapas' },
  { value: '+60', label: 'Amenidades' },
  { value: '1ª',  label: 'Línea de mar' },
  { value: '🐶',  label: 'Pet-friendly' },
]

// ── Categorías resumen ────────────────────────────────────────────────────────
const categorias = [
  { icon: Waves,    label: 'Recreación',    desc: 'Piscinas, jacuzzis, canchas y parques',          color: 'bg-blue-100 text-blue-600' },
  { icon: Wind,     label: 'Bienestar',     desc: 'Spa, zonas húmedas, gimnasio y TRX',              color: 'bg-emerald-100 text-emerald-600' },
  { icon: Baby,     label: 'Familia',       desc: 'Guardería, parque infantil y áreas para niños',   color: 'bg-amber-100 text-amber-600' },
  { icon: Trees,    label: 'Naturaleza',    desc: 'Senderos, miradores, jardines y pérgolas',        color: 'bg-green-100 text-green-600' },
  { icon: Utensils, label: 'Gastronomía',   desc: 'Múltiples restaurantes en el conjunto',           color: 'bg-rose-100 text-rose-600' },
  { icon: Laptop,   label: 'Trabajo remoto',desc: 'Coworking en varias etapas, incluso frente al mar', color: 'bg-violet-100 text-violet-600' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AreasomunesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url('/images/Banner-2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/30 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🌴 Conjunto Turístico Santa Marina
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Áreas Comunes &amp; Amenidades
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Más de 60 amenidades distribuidas en 6 macroetapas para que cada día en Santa Marina sea una experiencia única.
          </p>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center py-8 gap-1">
                <span className="text-3xl md:text-4xl font-bold text-blue-600">{s.value}</span>
                <span className="text-sm text-gray-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mapa interactivo ──────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Mapa del Conjunto</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Explora cada macroetapa y descubre las amenidades que ofrece. Selecciona una zona para ver el detalle.
            </p>
          </div>
          <MapaInteractivo />
        </div>
      </section>

      {/* ── Club de playa highlight ────────────────────────────────────────── */}
      <section className="py-4 pb-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden text-white min-h-[420px] flex items-center">

            {/* Fondo: foto de playa con overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/Banner-2.jpg')` }}
            />
            {/* Overlay degradado oceánico */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/90 via-blue-900/80 to-blue-900/40" />

            {/* Olas decorativas SVG en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 opacity-20">
              <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
                <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 opacity-10">
              <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
                <path d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
              </svg>
            </div>

            {/* Burbujas decorativas */}
            <div className="absolute top-8 right-12 w-32 h-32 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute top-20 right-32 w-16 h-16 rounded-full border border-white/10 bg-white/5" />
            <div className="absolute bottom-16 right-20 w-24 h-24 rounded-full border border-cyan-300/20 bg-cyan-300/5" />

            {/* Contenido */}
            <div className="relative px-8 md:px-14 py-14 max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-cyan-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                La joya del proyecto · Macroetapa 5 – Kunawa
              </span>

              <h2 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">
                Club de Playa
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-cyan-300 mb-5">
                Primera Línea de Mar 🌊
              </h3>

              <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-xl">
                El diferencial más exclusivo de Santa Marina: acceso directo al Caribe con tu propio
                club de playa privado, piscina, zona TRX y un coworking con el mar de fondo.
              </p>

              {/* Cards de amenidades */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: '🏊', label: 'Piscina propia' },
                  { icon: '💪', label: 'Zona TRX' },
                  { icon: '💻', label: 'Coworking frente al mar' },
                  { icon: '⛱️', label: 'Pérgolas Caribe' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 text-center hover:bg-white/20 transition-colors"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-medium text-white/90 leading-tight">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categorías resumen ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Todo lo que encontrarás</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Santa Marina combina experiencias de seis categorías para que nunca te falte nada durante tu estadía.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categorias.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.label} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex gap-4 items-start">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{cat.label}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-blue-50 border border-blue-100 rounded-3xl py-14 px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¿Listo para disfrutarlo todo?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Reserva tu apartamento y accede a todas las amenidades del Conjunto Turístico Santa Marina desde el primer día.
            </p>
            <Link
              href="/apartamentos"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Ver apartamentos disponibles
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'

// ── Macroetapas ───────────────────────────────────────────────────────────────
interface Etapa {
  id: number
  nombre: string
  descripcion: string
  emoji: string
  dotColor: string
  labelColor: string
  bgLight: string
  borderColor: string
}

const ETAPAS: Etapa[] = [
  { id: 1, nombre: 'Bukunna',  descripcion: 'El corazón del conjunto, con todo lo esencial.',             emoji: '🏊', dotColor: '#b5933a', labelColor: 'text-yellow-800', bgLight: 'bg-yellow-50',  borderColor: 'border-yellow-200' },
  { id: 2, nombre: 'Jiwu',     descripcion: 'Familia y bienestar.',                         emoji: '🧒', dotColor: '#3ab5c4', labelColor: 'text-cyan-700',   bgLight: 'bg-cyan-50',    borderColor: 'border-cyan-200'   },
  { id: 3, nombre: 'Anugwe',   descripcion: 'Espacios sociales y coworking.',               emoji: '💻', dotColor: '#c45a4e', labelColor: 'text-rose-700',   bgLight: 'bg-rose-50',    borderColor: 'border-rose-200'   },
  { id: 4, nombre: 'Akuttu',   descripcion: 'Ocio al aire libre y pet-friendly.',           emoji: '🐾', dotColor: '#4aaa5e', labelColor: 'text-green-700',  bgLight: 'bg-green-50',   borderColor: 'border-green-200'  },
  { id: 5, nombre: 'Kunawa',   descripcion: 'Club de playa en primera línea de mar.',       emoji: '🏖️', dotColor: '#c49a00', labelColor: 'text-amber-700',  bgLight: 'bg-amber-50',   borderColor: 'border-amber-200'  },
  { id: 6, nombre: 'Kaamú',    descripcion: 'Deporte, cultura y entretenimiento.',          emoji: '🎾', dotColor: '#d04040', labelColor: 'text-red-700',    bgLight: 'bg-red-50',     borderColor: 'border-red-200'    },
]

// ── Puntos numerados del mapa ─────────────────────────────────────────────────
// Un número puede pertenecer a varias macroetapas (ej: piscinas repetidas)
// etapaIds: [] = punto general del conjunto
interface MapPoint {
  num: string
  label: string
  icon: string
  etapaIds: number[]
}

const MAP_POINTS: MapPoint[] = [
  // ── Macroetapa 1 – Bukunna ────────────────────────────────────────────────
  { num: '3',    label: 'Lobby / Enfermería / Administración', icon: '🏢', etapaIds: [1]       },
  { num: '17',   label: 'Restaurante',                         icon: '🍽️', etapaIds: [1]       },
  { num: '10',   label: 'Pérgola',                             icon: '⛱️', etapaIds: [1, 3]    },
  { num: '14',   label: 'Piscina de nado',                     icon: '🏊', etapaIds: [1]       },
  { num: '26',   label: 'Senderos y caminos',                  icon: '🌿', etapaIds: [1, 4, 6] },
  { num: '12',   label: 'Restaurante',                         icon: '🍽️', etapaIds: [1]       },
  { num: '13',   label: 'Piscinas para adultos',               icon: '🏊', etapaIds: [1, 3, 6] },
  { num: '13.1', label: 'Piscina para niños',                  icon: '🧒', etapaIds: [1, 3, 6] },
  { num: '15',   label: 'Jacuzzi',                             icon: '♨️', etapaIds: [1]       },
  { num: '11',   label: 'Zona de estar',                       icon: '🛋️', etapaIds: [1]       },

  // ── Macroetapa 2 – Jiwu ──────────────────────────────────────────────────
  { num: '5',    label: 'Parque infantil',                     icon: '🎡', etapaIds: [2]    },
  { num: '7',    label: 'Cancha múltiple',                     icon: '⚽', etapaIds: [2]    },
  { num: '8',    label: 'Zonas húmedas / Spa',                 icon: '💆', etapaIds: [2]    },
  { num: '9',    label: 'Guardería',                           icon: '👶', etapaIds: [2]    },
  { num: '6',    label: 'Chorros',                             icon: '💦', etapaIds: [2]    },

  // ── Macroetapa 3 – Anugwe ─────────────────────────────────────────────────
  { num: '39',   label: 'Coworking',                           icon: '💻', etapaIds: [3]    },
  { num: '18',   label: 'Sala múltiple',                       icon: '🎭', etapaIds: [3]    },
  { num: '25',   label: 'Plazoleta cubierta / Pérgolas',       icon: '⛱️', etapaIds: [3, 5] },
  { num: '20',   label: 'Zona de estar cubierta',              icon: '🛋️', etapaIds: [3]    },
  { num: '22',   label: 'Piscina',                             icon: '🏊', etapaIds: [3, 5] },
  { num: '27',   label: 'Restaurante',                         icon: '🍽️', etapaIds: [3]    },

  // ── Macroetapa 4 – Akuttu ─────────────────────────────────────────────────
  { num: '30',   label: 'Zona BBQ',                            icon: '🍖', etapaIds: [4] },
  { num: '32',   label: 'Parque cerrado para perros',          icon: '🐾', etapaIds: [4] },

  // ── Macroetapa 5 – Kunawa ─────────────────────────────────────────────────
  { num: '16',   label: 'Pérgolas',                            icon: '⛱️', etapaIds: [5] },
  { num: '23',   label: 'Zona TRX',                            icon: '💪', etapaIds: [5] },
  { num: '35',   label: 'Piscina – Club de Playa',             icon: '🏖️', etapaIds: [5] },
  { num: '36',   label: 'Coworking',                           icon: '💻', etapaIds: [5] },

  // ── Macroetapa 6 – Kaamú ─────────────────────────────────────────────────
  { num: '4',    label: 'Estación gimnasio exterior',          icon: '🏋️', etapaIds: [6] },
  { num: '19',   label: 'Puente peatonal',                     icon: '🌉', etapaIds: [6] },
  { num: '34',   label: 'Jacuzzi',                             icon: '♨️', etapaIds: [6] },
  { num: '24',   label: 'Miradores',                           icon: '🔭', etapaIds: [6] },
  { num: '38',   label: 'Plazoleta cubierta',                  icon: '⛱️', etapaIds: [6] },
  { num: '29',   label: 'Cancha de tenis',                     icon: '🎾', etapaIds: [6] },
  { num: '31',   label: 'Muro de proyección',                  icon: '🎬', etapaIds: [6] },
  { num: '37',   label: 'Restaurante',                         icon: '🍽️', etapaIds: [6] },
  { num: '40',   label: 'Capilla',                             icon: '⛪', etapaIds: [6] },
]

// Orden numérico para mostrar la leyenda correctamente
const SORTED_POINTS = [...MAP_POINTS].sort((a, b) => {
  const toNum = (s: string) => parseFloat(s)
  return toNum(a.num) - toNum(b.num)
})

// ── Componente ─────────────────────────────────────────────────────────────────
export default function MapaInteractivo() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [hoveredNum, setHoveredNum] = useState<string | null>(null)
  const legendRef = useRef<HTMLDivElement>(null)

  const selected = ETAPAS.find(e => e.id === selectedId) ?? null

  function toggle(id: number) {
    const next = selectedId === id ? null : id
    setSelectedId(next)
    if (next !== null) {
      setTimeout(() => {
        legendRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  function isHighlighted(point: MapPoint) {
    if (selectedId === null) return false
    return point.etapaIds.includes(selectedId)
  }

  function isDimmed(point: MapPoint) {
    if (selectedId === null) return false
    return !point.etapaIds.includes(selectedId)
  }

  // Color del punto: usa el de la etapa seleccionada si pertenece a ella,
  // o el de la primera etapa a la que pertenece
  function pointColor(point: MapPoint): string {
    if (selectedId !== null && point.etapaIds.includes(selectedId)) {
      return ETAPAS.find(e => e.id === selectedId)?.dotColor ?? '#1e3a5f'
    }
    return '#1e3a5f'
  }

  return (
    <div className="space-y-6">

      {/* ── Layout principal ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1 hidden lg:block">
            Selecciona una etapa
          </p>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {ETAPAS.map(etapa => {
              const isActive = selectedId === etapa.id
              return (
                <button
                  key={etapa.id}
                  onClick={() => toggle(etapa.id)}
                  className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                    isActive
                      ? `${etapa.bgLight} ${etapa.borderColor} shadow-sm`
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-2 ring-white"
                    style={{ background: etapa.dotColor }}
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium text-gray-400">Macroetapa {etapa.id}</div>
                    <div className={`text-sm font-bold truncate transition-colors ${isActive ? etapa.labelColor : 'text-gray-700'}`}>
                      {etapa.nombre}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Leyenda de colores */}
          {selectedId === null && (
            <div className="hidden lg:block mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 leading-relaxed">
                Selecciona una macroetapa para ver sus puntos destacados en el mapa y sus amenidades.
              </p>
            </div>
          )}
        </div>

        {/* Mapa — imagen estática */}
        <div className="flex-1 min-w-0">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <Image
              src="/images/Mapa.jpg"
              alt="Mapa del Conjunto Turístico Santa Marina"
              width={1470}
              height={830}
              className="w-full block"
              priority
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            💡 Selecciona una macroetapa para identificar sus puntos en la leyenda numerada
          </p>
        </div>
      </div>

      {/* ── Leyenda numerada ─────────────────────────────────────────────── */}
      <div ref={legendRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">
            Referencias del mapa
          </h3>
          {selected && (
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: `${selected.dotColor}18`, color: selected.dotColor }}
            >
              {selected.emoji} Mostrando: {selected.nombre}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {SORTED_POINTS.map(point => {
            const highlighted = isHighlighted(point)
            const dimmed      = isDimmed(point)
            const color       = pointColor(point)
            const isHover     = hoveredNum === point.num

            return (
              <div
                key={point.num}
                onMouseEnter={() => setHoveredNum(point.num)}
                onMouseLeave={() => setHoveredNum(null)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 border transition-all duration-200 ${
                  highlighted
                    ? 'border-transparent shadow-sm scale-[1.01]'
                    : dimmed
                    ? 'border-gray-50 opacity-25'
                    : isHover
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-100 bg-gray-50/50'
                }`}
                style={highlighted ? { background: `${color}14`, borderColor: `${color}50` } : {}}
              >
                {/* Círculo número — igual al estilo del mapa real */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold shadow-sm flex-none"
                  style={{ background: highlighted ? color : '#1e3a5f', color: '#fff' }}
                >
                  {point.num}
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-xs leading-tight block ${highlighted ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                    {point.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {selectedId === null && (
          <p className="text-xs text-center text-gray-400 mt-4">
            Selecciona una macroetapa del panel para resaltar sus puntos en esta leyenda
          </p>
        )}
      </div>

      {/* ── Panel de detalle de la etapa ──────────────────────────────────── */}
      {selected && (
        <div
          className={`rounded-2xl border ${selected.borderColor} ${selected.bgLight} p-6`}
          style={{ animation: 'fadeIn 0.2s ease' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Macroetapa {selected.id}</div>
                <h3 className={`text-xl font-bold ${selected.labelColor}`}>{selected.nombre}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{selected.descripcion}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Amenidades de esta etapa */}
          <div className="flex flex-wrap gap-2">
            {MAP_POINTS.filter(p => p.etapaIds.includes(selected.id)).map(point => (
              <div
                key={point.num}
                className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-1.5 border border-white shadow-sm"
              >
                <span className="text-base leading-none">{point.icon}</span>
                <span className="text-xs text-gray-700">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

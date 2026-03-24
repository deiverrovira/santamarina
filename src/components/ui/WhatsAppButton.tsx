'use client'

const WA_NUMBER = '573166832976'
const WA_MESSAGE = 'Hola, tengo una consulta sobre una reserva en el Conjunto Turístico Santa Marina.'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`

export default function WhatsAppButton() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      {/* Tooltip — visible on hover, slides in from the right */}
      <span className="pointer-events-none invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap bg-gray-900 text-white text-xs font-medium rounded-xl px-3 py-2 shadow-lg">
        ¿Tienes alguna duda? ¡Escríbenos!
      </span>

      {/* Circular button */}
      <span className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-xl hover:scale-110 transition-transform duration-200 cursor-pointer">
        {/* Animated pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        {/* WhatsApp logo SVG */}
        <svg
          viewBox="0 0 32 32"
          className="relative w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.73.7 5.35 2.03 7.67L.5 31.5l8.05-2.01A15.43 15.43 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.14a13.6 13.6 0 0 1-6.89-1.87l-.49-.3-5.1 1.27 1.3-4.95-.33-.52A13.56 13.56 0 0 1 2.36 16C2.36 9 9 2.36 16 2.36S29.64 9 29.64 16 23 28.64 16 28.64zm7.44-10.18c-.4-.2-2.39-1.18-2.76-1.31-.37-.14-.64-.2-.91.2-.27.4-1.05 1.31-1.29 1.58-.24.27-.47.3-.87.1-.4-.2-1.7-.63-3.24-2-1.2-1.07-2-2.38-2.24-2.78-.23-.4-.02-.61.18-.81.18-.18.4-.47.6-.7.2-.24.27-.4.4-.67.14-.27.07-.5-.03-.7-.1-.2-.91-2.2-1.25-3.01-.33-.79-.66-.68-.91-.69h-.78c-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.33 0 1.97 1.43 3.87 1.63 4.14.2.27 2.82 4.3 6.83 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.11 2.39-.98 2.73-1.92.34-.95.34-1.76.24-1.93-.1-.17-.37-.27-.77-.47z" />
        </svg>
      </span>
    </a>
  )
}

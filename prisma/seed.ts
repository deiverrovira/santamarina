import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────
// Cloudinary Fetch helper
// Las imágenes se sirven a través de tu CDN de Cloudinary
// (modo "fetch": Cloudinary descarga, optimiza y cachea la imagen)
// Para activarlo: Cloudinary Dashboard → Settings → Security →
//   "Allowed fetch domains" → agrega "images.unsplash.com"
// ─────────────────────────────────────────────
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'

function cld(unsplashUrl: string, width = 900): string {
  const transforms = `f_auto,q_auto,w_${width}`
  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${transforms}/${unsplashUrl}`
}

async function main() {
  // Clean up
  await prisma.reservation.deleteMany()
  await prisma.apartmentAmenity.deleteMany()
  await prisma.apartmentImage.deleteMany()
  await prisma.amenity.deleteMany()
  await prisma.apartment.deleteMany()
  await prisma.user.deleteMany()

  // ── Usuario admin inicial ───────────────────
  const adminPassword = await bcrypt.hash('Admin2026.', 12)
  await prisma.user.create({
    data: {
      email: 'admin@santamarina.com',
      password: adminPassword,
      role: 'admin',
      status: 'active',
    },
  })

  // ── Amenities ──────────────────────────────
  const amenities = await Promise.all([
    prisma.amenity.create({ data: { name: 'WiFi gratis',          icon: 'wifi'      } }),
    prisma.amenity.create({ data: { name: 'Piscina',              icon: 'waves'     } }),
    prisma.amenity.create({ data: { name: 'Aire acondicionado',   icon: 'wind'      } }),
    prisma.amenity.create({ data: { name: 'Cocina equipada',      icon: 'utensils'  } }),
    prisma.amenity.create({ data: { name: 'Parqueadero',          icon: 'car'       } }),
    prisma.amenity.create({ data: { name: 'Vista al mar',         icon: 'eye'       } }),
    prisma.amenity.create({ data: { name: 'Balcón',               icon: 'home'      } }),
    prisma.amenity.create({ data: { name: 'TV Smart',             icon: 'tv'        } }),
    prisma.amenity.create({ data: { name: 'Lavadora',             icon: 'shirt'     } }),
    prisma.amenity.create({ data: { name: 'Jacuzzi',              icon: 'droplets'  } }),
  ])

  const [wifi, piscina, ac, cocina, parqueadero, vistaAlMar, balcon, tv, lavadora, jacuzzi] = amenities

  // ── Apartment 1: Studio Coral ──────────────
  const apt1 = await prisma.apartment.create({
    data: {
      slug: 'studio-coral',
      name: 'Studio Coral',
      description: 'Acogedor studio con vista al mar, perfectamente equipado para parejas que buscan una escapada romántica. Cuenta con una amplia terraza desde donde podrás disfrutar del amanecer sobre el Caribe. El espacio fue diseñado con una paleta de colores cálidos que evoca la calidez del trópico.',
      shortDescription: 'Studio romántico con terraza y vista al mar. Ideal para parejas.',
      maxAdults: 2, maxChildren: 0, bedrooms: 1, bathrooms: 1,
      pricePerNight: 280000, isActive: true,
    },
  })
  await prisma.apartmentImage.createMany({ data: [
    { apartmentId: apt1.id, url: cld('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'), alt: 'Studio Coral - Vista principal',  order: 0 },
    { apartmentId: apt1.id, url: cld('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'), alt: 'Studio Coral - Sala',              order: 1 },
    { apartmentId: apt1.id, url: cld('https://images.unsplash.com/photo-1584738766473-61c083514bf4'), alt: 'Studio Coral - Terraza',         order: 2 },
    { apartmentId: apt1.id, url: cld('https://images.unsplash.com/photo-1540518614846-7eded433c457'), alt: 'Studio Coral - Baño',            order: 3 },
  ]})
  await prisma.apartmentAmenity.createMany({ data: [
    { apartmentId: apt1.id, amenityId: wifi.id },
    { apartmentId: apt1.id, amenityId: piscina.id },
    { apartmentId: apt1.id, amenityId: ac.id },
    { apartmentId: apt1.id, amenityId: vistaAlMar.id },
    { apartmentId: apt1.id, amenityId: balcon.id },
    { apartmentId: apt1.id, amenityId: tv.id },
  ]})

  // ── Apartment 2: Brisa Marina ──────────────
  const apt2 = await prisma.apartment.create({
    data: {
      slug: 'brisa-marina',
      name: 'Apartamento Brisa Marina',
      description: 'Espacioso apartamento familiar con dos habitaciones, sala comedor amplia y cocina totalmente equipada. Perfecto para familias que desean disfrutar de las comodidades del hogar con la magia del Caribe.',
      shortDescription: 'Apartamento familiar con 2 habitaciones, cocina completa y acceso a piscina.',
      maxAdults: 4, maxChildren: 2, bedrooms: 2, bathrooms: 2,
      pricePerNight: 420000, isActive: true,
    },
  })
  await prisma.apartmentImage.createMany({ data: [
    { apartmentId: apt2.id, url: cld('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'), alt: 'Brisa Marina - Vista principal',        order: 0 },
    { apartmentId: apt2.id, url: cld('https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e'), alt: 'Brisa Marina - Habitación principal',   order: 1 },
    { apartmentId: apt2.id, url: cld('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136'), alt: 'Brisa Marina - Cocina',                   order: 2 },
    { apartmentId: apt2.id, url: cld('https://images.unsplash.com/photo-1571508601891-ca5e7a713859'), alt: 'Brisa Marina - Sala',                   order: 3 },
  ]})
  await prisma.apartmentAmenity.createMany({ data: [
    { apartmentId: apt2.id, amenityId: wifi.id },
    { apartmentId: apt2.id, amenityId: piscina.id },
    { apartmentId: apt2.id, amenityId: ac.id },
    { apartmentId: apt2.id, amenityId: cocina.id },
    { apartmentId: apt2.id, amenityId: parqueadero.id },
    { apartmentId: apt2.id, amenityId: tv.id },
    { apartmentId: apt2.id, amenityId: lavadora.id },
  ]})

  // ── Apartment 3: Penthouse Sol del Caribe ──
  const apt3 = await prisma.apartment.create({
    data: {
      slug: 'penthouse-sol-caribe',
      name: 'Penthouse Sol del Caribe',
      description: 'Lujoso penthouse en el último piso con vista panorámica de 270° al mar Caribe. Tres habitaciones, tres baños, jacuzzi privado en la terraza y sala de estar de doble altura. La experiencia más exclusiva del conjunto Mariana.',
      shortDescription: 'Penthouse de lujo con 3 habitaciones, jacuzzi privado y vista panorámica.',
      maxAdults: 6, maxChildren: 2, bedrooms: 3, bathrooms: 3,
      pricePerNight: 750000, isActive: true,
    },
  })
  await prisma.apartmentImage.createMany({ data: [
    { apartmentId: apt3.id, url: cld('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'), alt: 'Penthouse - Vista principal',          order: 0 },
    { apartmentId: apt3.id, url: cld('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'), alt: 'Penthouse - Terraza',                  order: 1 },
    { apartmentId: apt3.id, url: cld('https://images.unsplash.com/photo-1631049307264-da0ec9d70304'), alt: 'Penthouse - Habitación principal',     order: 2 },
    { apartmentId: apt3.id, url: cld('https://images.unsplash.com/photo-1600566753151-384129cf4e3e'), alt: 'Penthouse - Vista al mar',             order: 3 },
  ]})
  await prisma.apartmentAmenity.createMany({ data: [
    { apartmentId: apt3.id, amenityId: wifi.id },
    { apartmentId: apt3.id, amenityId: piscina.id },
    { apartmentId: apt3.id, amenityId: ac.id },
    { apartmentId: apt3.id, amenityId: cocina.id },
    { apartmentId: apt3.id, amenityId: parqueadero.id },
    { apartmentId: apt3.id, amenityId: vistaAlMar.id },
    { apartmentId: apt3.id, amenityId: balcon.id },
    { apartmentId: apt3.id, amenityId: tv.id },
    { apartmentId: apt3.id, amenityId: jacuzzi.id },
    { apartmentId: apt3.id, amenityId: lavadora.id },
  ]})

  // ── Apartment 4: Suite Palmeras ────────────
  const apt4 = await prisma.apartment.create({
    data: {
      slug: 'suite-palmeras',
      name: 'Suite Palmeras',
      description: 'Elegante suite con decoración tropical y todas las comodidades modernas. Una habitación king size, baño de lujo con ducha de lluvia y sala de estar privada. Acceso directo a la zona de palmeras del conjunto.',
      shortDescription: 'Suite elegante con decoración tropical y baño de lujo con ducha de lluvia.',
      maxAdults: 2, maxChildren: 1, bedrooms: 1, bathrooms: 1,
      pricePerNight: 350000, isActive: true,
    },
  })
  await prisma.apartmentImage.createMany({ data: [
    { apartmentId: apt4.id, url: cld('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'), alt: 'Suite Palmeras - Vista principal', order: 0 },
    { apartmentId: apt4.id, url: cld('https://images.unsplash.com/photo-1566665797739-1674de7a421a'), alt: 'Suite Palmeras - Habitación',     order: 1 },
    { apartmentId: apt4.id, url: cld('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14'), alt: 'Suite Palmeras - Baño',              order: 2 },
  ]})
  await prisma.apartmentAmenity.createMany({ data: [
    { apartmentId: apt4.id, amenityId: wifi.id },
    { apartmentId: apt4.id, amenityId: piscina.id },
    { apartmentId: apt4.id, amenityId: ac.id },
    { apartmentId: apt4.id, amenityId: vistaAlMar.id },
    { apartmentId: apt4.id, amenityId: tv.id },
  ]})

  // ── Apartment 5: Apartamento Horizonte ─────
  const apt5 = await prisma.apartment.create({
    data: {
      slug: 'apartamento-horizonte',
      name: 'Apartamento Horizonte',
      description: 'Moderno apartamento de una habitación con cocina equipada, ideal para viajeros de negocios o parejas que buscan independencia. Ubicado en el cuarto piso con vista al horizonte marino.',
      shortDescription: 'Apartamento moderno con cocina equipada e internet de alta velocidad.',
      maxAdults: 2, maxChildren: 0, bedrooms: 1, bathrooms: 1,
      pricePerNight: 230000, isActive: true,
    },
  })
  await prisma.apartmentImage.createMany({ data: [
    { apartmentId: apt5.id, url: cld('https://images.unsplash.com/photo-1493809842364-78817add7ffb'), alt: 'Apartamento Horizonte - Vista principal', order: 0 },
    { apartmentId: apt5.id, url: cld('https://images.unsplash.com/photo-1560185007-cde436f6a4d0'), alt: 'Apartamento Horizonte - Sala',             order: 1 },
    { apartmentId: apt5.id, url: cld('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136'), alt: 'Apartamento Horizonte - Cocina',            order: 2 },
  ]})
  await prisma.apartmentAmenity.createMany({ data: [
    { apartmentId: apt5.id, amenityId: wifi.id },
    { apartmentId: apt5.id, amenityId: ac.id },
    { apartmentId: apt5.id, amenityId: cocina.id },
    { apartmentId: apt5.id, amenityId: tv.id },
  ]})

  // ── Apartment 6: Villa Margarita ───────────
  const apt6 = await prisma.apartment.create({
    data: {
      slug: 'villa-margarita',
      name: 'Villa Margarita',
      description: 'La más grande del conjunto, con cuatro habitaciones distribuidas en dos pisos internos. Sala de cine, cocina gourmet, comedor para 10 personas y terraza con parrilla. Diseñada para grupos grandes o familias extendidas.',
      shortDescription: 'Villa de 4 habitaciones con sala de cine, cocina gourmet y terraza con parrilla.',
      maxAdults: 8, maxChildren: 4, bedrooms: 4, bathrooms: 4,
      pricePerNight: 1200000, isActive: true,
    },
  })
  await prisma.apartmentImage.createMany({ data: [
    { apartmentId: apt6.id, url: cld('https://images.unsplash.com/photo-1613490493576-7fde63acd811'), alt: 'Villa Margarita - Vista principal',  order: 0 },
    { apartmentId: apt6.id, url: cld('https://images.unsplash.com/photo-1600585154340-be6161a56a0c'), alt: 'Villa Margarita - Sala',             order: 1 },
    { apartmentId: apt6.id, url: cld('https://images.unsplash.com/photo-1556909172-54557c7e4fb7'), alt: 'Villa Margarita - Cocina gourmet',     order: 2 },
    { apartmentId: apt6.id, url: cld('https://images.unsplash.com/photo-1600607687644-c7171b42498f'), alt: 'Villa Margarita - Terraza',          order: 3 },
  ]})
  await prisma.apartmentAmenity.createMany({ data: [
    { apartmentId: apt6.id, amenityId: wifi.id },
    { apartmentId: apt6.id, amenityId: piscina.id },
    { apartmentId: apt6.id, amenityId: ac.id },
    { apartmentId: apt6.id, amenityId: cocina.id },
    { apartmentId: apt6.id, amenityId: parqueadero.id },
    { apartmentId: apt6.id, amenityId: vistaAlMar.id },
    { apartmentId: apt6.id, amenityId: balcon.id },
    { apartmentId: apt6.id, amenityId: tv.id },
    { apartmentId: apt6.id, amenityId: lavadora.id },
  ]})

  // ── Reservas de prueba ─────────────────────
  const today = new Date()
  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000)

  await prisma.reservation.createMany({ data: [
    {
      apartmentId: apt1.id, guestName: 'María García',
      guestEmail: 'maria@ejemplo.com', guestPhone: '3001234567',
      checkIn: addDays(today, 7), checkOut: addDays(today, 10),
      adults: 2, children: 0, status: 'CONFIRMED',
      notes: 'Reserva de prueba confirmada',
    },
    {
      apartmentId: apt2.id, guestName: 'Carlos Rodríguez',
      guestEmail: 'carlos@ejemplo.com', guestPhone: '3009876543',
      checkIn: addDays(today, 14), checkOut: addDays(today, 18),
      adults: 3, children: 1, status: 'PENDING',
      notes: 'Llegan tarde, después de las 8pm',
    },
    {
      apartmentId: apt3.id, guestName: 'Ana Martínez',
      guestEmail: 'ana@ejemplo.com', guestPhone: '3151112233',
      checkIn: addDays(today, 3), checkOut: addDays(today, 6),
      adults: 4, children: 2, status: 'CONFIRMED',
      notes: null,
    },
  ]})

  console.log('✅ Seed completado')
  console.log('   → 1 usuario admin (admin@santamarina.com / Admin2026.)')
  console.log('   → 6 apartamentos · 10 comodidades · 3 reservas de prueba')
  console.log(`   → Imágenes sirviendo desde Cloudinary (cloud: ${CLOUD})`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

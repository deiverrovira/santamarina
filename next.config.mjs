/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — imágenes propias del conjunto (producción)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Unsplash — placeholders durante desarrollo
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig

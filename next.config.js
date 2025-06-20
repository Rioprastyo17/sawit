/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false,
  // Tambahkan baris ini untuk memberitahu Next.js
  // agar memproses paket 'undici'
  experimental: {
    serverComponentsExternalPackages: ['axios', 'cheerio'],
  },
}

module.exports = nextConfig


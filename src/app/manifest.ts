import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cafe App By Natakenshi Developer',
    short_name: 'Cafe App By Natakenshi Developer',
    description: 'Aplikasi Pemesanan Cafe Senja',
    start_url: '/',
    display: 'standalone', // Ini yang bikin dia kayak aplikasi native (hilang address bar)
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon-192.png', // Kita harus siapkan gambar ini
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png', // Kita harus siapkan gambar ini
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
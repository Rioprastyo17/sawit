// src/app/layout.tsx (MODIFIKASI)

import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

// HAPUS: import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cattani - Monitoring Perkebunan Sawit',
  description: 'Aplikasi untuk mengelola dan memonitor perkebunan kelapa sawit.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      {/* Body sekarang hanya berisi children, tanpa header */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
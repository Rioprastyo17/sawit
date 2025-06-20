// src/app/(app)/component/header.tsx (MODIFIKASI)

"use client"; // <-- Tambahkan baris ini untuk menjadikannya Client Component

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <-- Import useRouter untuk navigasi
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter(); // <-- Inisialisasi router

  const handleLogout = async () => {
    // Panggil API logout yang baru kita buat
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (res.ok) {
      // Jika berhasil, arahkan ke halaman utama (login)
      router.push('/');
      router.refresh(); // Refresh untuk memastikan state server terupdate
    } else {
      alert('Logout gagal!');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/monitor" className={styles.logo}> {/* Ubah href ke /monitor */}
          Cattani
        </Link>
        <nav className={styles.nav}>
          <ul>
            {/* 1. UBAH LINK HOME */}
            <li><Link href="/monitor">Home</Link></li>
            <li><Link href="/pasar">Pasar</Link></li>
            <li><Link href="/catatan">Catatan</Link></li>
            <li><Link href="/monitor">Monitor</Link></li>
            <li><Link href="/profil">Profil</Link></li>
            
            {/* 2. UBAH LINK LOGOUT MENJADI TOMBOL DENGAN FUNGSI */}
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
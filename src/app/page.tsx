// src/app/page.tsx (MODIFIKASI)

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login gagal.');
      } else {
        // Redirect ke halaman monitor setelah login berhasil
        router.push('/monitor');
        router.refresh();
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Login ke Cattani</h1>
        <p className={styles.subtitle}>Silakan masuk untuk melanjutkan.</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="nama@email.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className={styles.signupText}>
          Belum punya akun? <Link href="/signup">Daftar di sini</Link>
        </p>
      </div>
    </main>
  );
}
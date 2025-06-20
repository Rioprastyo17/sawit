// src/app/signup/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css'; // Kita bisa pakai style yang sama
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registrasi gagal.');
      } else {
        setSuccess('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
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
        <h1 className={styles.title}>Daftar Akun Baru</h1>
        <p className={styles.subtitle}>Buat akun Cattani Anda.</p>
        
        <form onSubmit={handleSignup} className={styles.form}>
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
              placeholder="Minimal 8 karakter"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className={styles.signupText}>
          Sudah punya akun? <Link href="/login">Login di sini</Link>
        </p>
      </div>
    </main>
  );
}
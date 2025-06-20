// src/app/(app)/catatan/components/AddNoteModal.tsx

"use client";

import { useState } from 'react';
import styles from '../page.module.css'; // Kita gunakan style dari parent

// Ambil nilai Enum dari skema Prisma untuk dropdown
const categories = ["PEMUPUKAN", "PESTISIDA", "BIBIT", "PEMELIHARAAN", "PANEN", "SUPPLIER", "KEUANGAN"];
const statuses = ["PROSES", "SELESAI", "BATAL"];

// Definisikan tipe untuk props
interface AddNoteModalProps {
  onClose: () => void;
  onNoteAdded: () => void;
}

export default function AddNoteModal({ onClose, onNoteAdded }: AddNoteModalProps) {
  // State untuk setiap input form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]); // Default ke kategori pertama
  const [status, setStatus] = useState(statuses[0]); // Default ke status pertama
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal menyimpan catatan.');
      }

      // Jika berhasil:
      onNoteAdded(); // Panggil fungsi untuk refresh data di halaman utama
      onClose(); // Tutup modal

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Tambah Catatan Baru</h2>
        <p>Isi detail catatan di bawah ini.</p>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Judul Catatan</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Kategori</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={styles.select}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Isi Catatan (Opsional)</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className={styles.select}
            >
              {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formActions}>
            <button type="button" className={styles.closeButton} onClick={onClose}>
              Batal
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Catatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
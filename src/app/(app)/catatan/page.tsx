// src/app/(app)/catatan/page.tsx (PERBAIKAN)

"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
// PERBAIKI BARIS DI BAWAH INI
import AddNoteModal from './components/AddNoteModal';

// Tipe data ini akan kita gunakan di beberapa tempat
type Note = {
  id: number;
  title: string;
  content: string | null;
  category: string;
  status: string;
  createdAt: string;
};

export default function CatatanPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data catatan:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className={styles.container}>
      {isModalOpen && <AddNoteModal onClose={() => setIsModalOpen(false)} onNoteAdded={fetchNotes} />}
      
      <div className={styles.header}>
        <h1 className={styles.title}>Catatan Saya</h1>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          + Tambah Catatan
        </button>
      </div>
      
      <div className={styles.notesList}>
        {loading && <p>Memuat catatan...</p>}
        {!loading && notes.length === 0 && (
          <div className={styles.emptyState}>
            <p>Tidak ada catatan ditemukan</p>
            <span>Mulai dengan menambahkan catatan baru</span>
          </div>
        )}
        {!loading && notes.map(note => (
            <div key={note.id} className={styles.noteCard}>
                <h3>{note.title}</h3>
                <p>{note.content || 'Tidak ada konten.'}</p>
                <div className={styles.noteFooter}>
                    <span className={styles.categoryTag}>{note.category}</span>
                    <span className={styles.statusTag}>{note.status}</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
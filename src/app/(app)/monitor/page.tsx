// src/app/(app)/monitor/page.tsx

"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type PriceData = {
  today: { price: number } | null;
  history: { date: string, price: number }[];
}

// Fungsi untuk memformat tanggal di sumbu X grafik
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
    });
}

export default function MonitorPage() {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  // Fungsi untuk mengambil data harga dari API Next.js
  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prices');
      if (res.ok) {
        const priceData = await res.json();
        setData(priceData);
      } else {
        console.error("Gagal mengambil data harga dari server.");
      }
    } catch (error) {
      console.error("Gagal terhubung ke API harga:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetchPrices saat komponen pertama kali dimuat
  useEffect(() => {
    fetchPrices();
  }, []);

  // Fungsi yang dijalankan saat tombol "Refresh Data" diklik
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage('Memulai proses scraping...');
    
    try {
        const res = await fetch('/api/trigger-scrape', { method: 'POST' });
        const result = await res.json();

        if(!res.ok) {
            throw new Error(result.message || 'Gagal memicu scraper.');
        }

        setRefreshMessage('Scraping selesai, memuat ulang data harga...');
        await fetchPrices(); // Ambil data harga terbaru setelah scraping selesai
        setRefreshMessage('Data berhasil diperbarui!');

    } catch (error: any) {
        setRefreshMessage(`Error: ${error.message}`);
    } finally {
        setIsRefreshing(false);
        // Hapus pesan status setelah 5 detik
        setTimeout(() => setRefreshMessage(''), 5000);
    }
  };

  // Tampilkan pesan loading jika data belum siap
  if (loading && !data) {
    return (
        <div className={styles.container}>
            <p>Memuat data harga...</p>
        </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Monitoring Harga Sawit</h1>
        <button onClick={handleRefresh} disabled={isRefreshing} className={styles.refreshButton}>
            {isRefreshing ? 'Memproses...' : 'Refresh Data'}
        </button>
      </div>

      {/* Tampilkan pesan status dari proses refresh */}
      {refreshMessage && <p className={styles.refreshStatus}>{refreshMessage}</p>}
      
      <div className={styles.todayPriceCard}>
        <h2>Harga Hari Ini</h2>
        {data?.today?.price ? (
          <p>Rp {data.today.price.toLocaleString('id-ID')}/kg</p>
        ) : (
          <span>Data hari ini belum tersedia. Coba refresh.</span>
        )}
      </div>

      <div className={styles.chartContainer}>
        <h2>Grafik Harga sawit</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data?.history}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border-color)' 
                }}
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Harga']}
            />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#27ae60" name="Harga" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
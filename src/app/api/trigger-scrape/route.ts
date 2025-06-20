// src/app/api/trigger-scrape/route.ts

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Panggil endpoint /scrape di server Flask yang berjalan di port 5000
    const flaskResponse = await fetch('http://127.0.0.1:5000/scrape', {
      method: 'POST',
    });

    if (!flaskResponse.ok) {
      // Jika Flask mengembalikan error, teruskan pesan errornya
      const errorData = await flaskResponse.json();
      return NextResponse.json(
        { message: 'Gagal memicu scraping', error: errorData.message || 'Error tidak diketahui dari server Flask' },
        { status: 500 }
      );
    }

    const data = await flaskResponse.json();
    return NextResponse.json({ message: 'Scraping berhasil dipicu', data });

  } catch (error) {
    console.error('Gagal menghubungi server Flask:', error);
    return NextResponse.json(
      { message: 'Tidak dapat terhubung ke server scraping Python.' },
      { status: 503 } // 503 Service Unavailable
    );
  }
}
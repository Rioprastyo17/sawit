// src/app/api/cron/scrape/route.ts

import { scrapeAndSavePrice } from '@/lib/scraper';
import { NextResponse } from 'next/server';

// Handler ini bisa dipanggil oleh Vercel Cron
export async function GET() {
  try {
    await scrapeAndSavePrice();
    return NextResponse.json({ message: 'Scraping berhasil' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Scraping gagal', error: error.message }, { status: 500 });
  }
}
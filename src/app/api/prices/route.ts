// src/app/api/prices/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  const payload = await verifyAuth();
  if (!payload) {
    return NextResponse.json({ message: 'Akses ditolak' }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Fungsi untuk mendapatkan tanggal N bulan yang lalu
    const getPastDate = (months: number) => {
        const date = new Date();
        date.setMonth(date.getMonth() - months);
        return date;
    }

    const priceToday = await prisma.palmOilPrice.findFirst({
      where: { date: today },
      orderBy: { date: 'desc' }
    });

    const pricesLast6Months = await prisma.palmOilPrice.findMany({
      where: {
        date: {
          gte: getPastDate(6)
        }
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({
      today: priceToday,
      history: pricesLast6Months
    });

  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengambil data harga' }, { status: 500 });
  }
}
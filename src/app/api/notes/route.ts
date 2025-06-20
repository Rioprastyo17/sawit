// src/app/api/notes/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// Handler untuk GET (mengambil catatan)
export async function GET() {
  const payload = await verifyAuth();
  if (!payload) {
    return NextResponse.json({ message: 'Akses ditolak' }, { status: 401 });
  }

  const notes = await prisma.note.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(notes);
}

// Handler untuk POST (membuat catatan)
export async function POST(request: Request) {
  const payload = await verifyAuth();
  if (!payload) {
    return NextResponse.json({ message: 'Akses ditolak' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, category, status } = body;

    if (!title || !category) {
        return NextResponse.json({ message: 'Judul dan kategori wajib diisi' }, { status: 400 });
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        category,
        status,
        userId: payload.userId, // Link catatan ke user yang login
      },
    });

    return NextResponse.json(newNote, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Gagal membuat catatan' }, { status: 500 });
  }
}
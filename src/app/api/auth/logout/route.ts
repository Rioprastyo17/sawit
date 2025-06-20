// src/app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Hapus cookie dengan nama 'token'
    cookies().delete('token');

    return NextResponse.json({ message: 'Logout berhasil' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
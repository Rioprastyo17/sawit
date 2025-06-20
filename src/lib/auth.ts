// src/lib/auth.ts

import { jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';

// Definisikan tipe untuk payload token kita
interface UserJwtPayload extends JWTPayload {
  userId: number;
}

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyAuth(): Promise<UserJwtPayload | null> {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, secretKey);
    return verified.payload as UserJwtPayload;
  } catch (err) {
    console.error('JWT Verification Failed:', err);
    return null;
  }
}
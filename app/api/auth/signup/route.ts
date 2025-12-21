import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Expected shape of signup payload
const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

// Type for users returned from DB
type UserRow = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = signupSchema.parse(body);

    // Check if user already exists
    const existing = await query<UserRow[]>('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (name, email, password, createdAt) VALUES (?, ?, ?, ?)', [
      name,
      email,
      hashed,
      new Date()
    ]);

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (error) {
    console.error('Signup error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

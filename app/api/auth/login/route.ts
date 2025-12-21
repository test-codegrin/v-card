import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type UserRow = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const rows = await query<UserRow[]>('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not set');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, secret, { expiresIn: '7d' });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
  } catch (error) {
    console.error('Login error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

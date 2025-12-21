import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

type UserRow = { id: number; name: string; email: string };

// GET /api/auth/me - returns current user if JWT is valid
export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = auth.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as { sub?: number; email?: string };
    if (!decoded?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await query<UserRow[]>('SELECT id, name, email FROM users WHERE email = ?', [decoded.email]);
    if (!rows.length) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('GET /api/auth/me failed', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/*  
   ADMIN AUTH
  */
function getAdminFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;

  try {
    return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET!) as {
      admin_id?: number;
    };
  } catch {
    return null;
  }
}

/*  
   GET – USERS / CARDS
  */
export async function GET(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin?.admin_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const type = params.get('type');
  const userEmail = params.get('userEmail');

  try {
    /*   USER-SPECIFIC CARDS   */
    if (userEmail) {
      const cards = await query<any[]>(
        `
        SELECT
          slug,
          cardType,
          ownerEmail,
          template,
          fullName,
          businessName,
          email,
          phone,
          website,
          role,
          tagline,
          company,
          profileImage,
          logo,
          createdAt
        FROM cards
        WHERE ownerEmail = ?
        ORDER BY createdAt DESC
        `,
        [userEmail]
      );

      return NextResponse.json({ cards });
    }

    /*   USERS   */
    if (type === 'users') {
      const users = await query<any[]>(
        `
        SELECT
          id,
          name,
          email,
          createdAt
        FROM users
        ORDER BY createdAt DESC
        `
      );

      return NextResponse.json({ users });
    }

    /*   ALL CARDS   */
    if (type === 'cards') {
      const cards = await query<any[]>(
        `
        SELECT
          slug,
          cardType,
          ownerEmail,
          template,
          fullName,
          businessName,
          email,
          phone,
          website,
          role,
          tagline,
          company,
          profileImage,
          logo,
          createdAt
        FROM cards
        ORDER BY createdAt DESC
        `
      );

      return NextResponse.json({ cards });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (err) {
    console.error('ADMIN GET failed', err);
    return NextResponse.json(
      { error: 'Failed to load admin data' },
      { status: 500 }
    );
  }
}

/*  
   DELETE – USER or CARD
  */
export async function DELETE(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin?.admin_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const userEmail = params.get('userEmail');
  const slug = params.get('slug');

  try {
    /* DELETE USER + THEIR CARDS */
    if (userEmail) {
      await query('DELETE FROM cards WHERE ownerEmail = ?', [userEmail]);
      await query('DELETE FROM users WHERE email = ?', [userEmail]);

      return NextResponse.json({
        success: true,
        message: 'User and all cards deleted'
      });
    }

    /* DELETE CARD */
    if (slug) {
      await query('DELETE FROM cards WHERE slug = ?', [slug]);

      return NextResponse.json({
        success: true,
        message: 'Card deleted'
      });
    }

    return NextResponse.json(
      { error: 'Missing delete parameter' },
      { status: 400 }
    );
  } catch (err) {
    console.error('ADMIN DELETE failed', err);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}

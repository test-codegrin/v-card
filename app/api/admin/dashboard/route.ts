import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { Card } from '@/types/card';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/*  
   SQL
  */

const selectAllCards = `
  SELECT 
    slug, cardType, ownerEmail, template,
    fullName, role, company, businessName, tagline,
    email, phone, website, address, bio,
    services, products, socials, profileImage, logo,
    createdAt
  FROM cards
  ORDER BY createdAt DESC
`;

/*  
   SAFE JSON
  */

const safeJson = (value: any, fallback: any) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/*  
   ROW → CARD
  */

const mapRowToCard = (row: any): Card => ({
  cardType: row.cardType,
  slug: row.slug,
  ownerEmail: row.ownerEmail,
  template: row.template,

  fullName: row.fullName || undefined,
  role: row.role || undefined,
  company: row.company || undefined,
  businessName: row.businessName || undefined,
  tagline: row.tagline || undefined,

  email: row.email,
  phone: row.phone || undefined,
  website: row.website || undefined,
  address: row.address || undefined,
  bio: row.bio || undefined,

  services: safeJson(row.services, []),
  products: safeJson(row.products, []),
  socials: safeJson(row.socials, {}),

  profileImage: row.profileImage || undefined,
  logo: row.logo || undefined,
  createdAt: row.createdAt?.toISOString?.() ?? row.createdAt
});

/*  
   ADMIN AUTH
  */

function getAdminFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;

  const token = auth.split(' ')[1];
  if (!process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as {
      admin_id?: number;
      email?: string;
    };
  } catch {
    return null;
  }
}

/*  
   GET – ALL CARDS (ADMIN)
  */

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin?.admin_id) {
      return NextResponse.json(
        { error: 'Unauthorized (admin only)' },
        { status: 401 }
      );
    }

    const rows = await query<any[]>(selectAllCards);
    const cards = rows.map(mapRowToCard);

    return NextResponse.json(
      {
        total: cards.length,
        cards
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/admin/dashboard failed', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

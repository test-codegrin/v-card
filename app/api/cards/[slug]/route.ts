import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { Card } from '@/types/card';
import { cardUpdateSchema } from '@/lib/validators';

// Avoid static optimization
export const dynamic = 'force-dynamic';

const selectBase = `
  SELECT slug, cardType, ownerEmail, fullName, role, company, businessName, tagline,
         email, phone, website, address, bio,
         services, products, socials, profileImage, logo, createdAt
  FROM cards
  WHERE slug = ?
`;

const safeJson = (value: any) => {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

const mapRowToCard = (row: any): Card => ({
  cardType: row.cardType,
  slug: row.slug,
  ownerEmail: row.ownerEmail,
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
  services: safeJson(row.services),
  products: safeJson(row.products),
  socials: safeJson(row.socials),
  profileImage: row.profileImage || undefined,
  logo: row.logo || undefined,
  createdAt: row.createdAt?.toISOString?.() ?? row.createdAt
});

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret) as { email?: string; sub?: number; name?: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const rows = await query<any[]>(selectBase, [params.slug]);
    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(mapRowToCard(rows[0]), { status: 200 });
  } catch (error) {
    console.error('GET /api/cards/[slug] failed', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = getUserFromRequest(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await query<any[]>(selectBase, [params.slug]);
    if (!existing.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (existing[0].ownerEmail !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const parsed = cardUpdateSchema.parse(json);

    const sql = `
      UPDATE cards
      SET cardType = COALESCE(?, cardType),
          ownerEmail = COALESCE(?, ownerEmail),
          fullName = ?,
          role = ?,
          company = ?,
          businessName = ?,
          tagline = ?,
          email = ?,
          phone = ?,
          website = ?,
          address = ?,
          bio = ?,
          services = ?,
          products = ?,
          socials = ?,
          profileImage = ?,
          logo = ?
      WHERE slug = ?
    `;

    const paramsSql = [
      parsed.cardType || null,
      parsed.ownerEmail || null,
      parsed.fullName || null,
      parsed.role || null,
      parsed.company || null,
      parsed.businessName || null,
      parsed.tagline || null,
      parsed.email || null,
      parsed.phone || null,
      parsed.website || null,
      parsed.address || null,
      parsed.bio || null,
      parsed.services ? JSON.stringify(parsed.services) : null,
      parsed.products ? JSON.stringify(parsed.products) : null,
      parsed.socials ? JSON.stringify(parsed.socials) : null,
      parsed.profileImage || null,
      parsed.logo || null,
      params.slug
    ];

    await query(sql, paramsSql);
    const rows = await query<any[]>(selectBase, [params.slug]);
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(mapRowToCard(rows[0]), { status: 200 });
  } catch (error) {
    console.error('PUT /api/cards/[slug] failed', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = getUserFromRequest(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await query<any[]>(selectBase, [params.slug]);
    if (!existing.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (existing[0].ownerEmail !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await query('DELETE FROM cards WHERE slug = ?', [params.slug]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/cards/[slug] failed', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}

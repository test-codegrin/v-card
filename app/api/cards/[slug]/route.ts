// 'use client';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { Card } from '@/types/card';
import { cardUpdateSchema } from '@/lib/validators';

export const dynamic = 'force-dynamic';

/*  SQL */

const selectBase = `
  SELECT slug, cardType, ownerEmail, template,
         fullName, role, company, businessName, tagline,
         email, phone, website, address, bio,
         services, products, socials, profileImage, logo, createdAt
  FROM cards
`;

const selectBySlug = `
  ${selectBase}
  WHERE slug = ?
  LIMIT 1
`;

/* SAFE JSON  */

const safeJson = (value: any, fallback: any) => {
  if (value === null || value === undefined) return fallback;

  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/*  ROW → CARD = */

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

/*  AUTH  */

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;

  const token = auth.split(' ')[1];
  if (!process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as { email?: string };
  } catch {
    return null;
  }
}

/* GET */

export async function GET(
  _: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const rows = await query<any[]>(selectBySlug, [params.slug]);

    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(mapRowToCard(rows[0]), { status: 200 });
  } catch (error) {
    console.error('GET /api/cards/[slug] failed', error);
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}

/* PUT  */

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    //  Auth check
    const user = getUserFromRequest(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if card exists
    const existing = await query<any[]>(selectBySlug, [params.slug]);
    if (!existing.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Ownership check
    if (existing[0].ownerEmail !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Read request body
    const json = await req.json();

  
    const parsed = cardUpdateSchema.parse({
      ...json,
      socials: json.social ?? json.socials ?? {}
    });

    // Update query
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

      // JSON fields (never null)
      JSON.stringify(parsed.services ?? []),
      JSON.stringify(parsed.products ?? []),
      JSON.stringify(parsed.socials ?? {}),

      parsed.profileImage || null,
      parsed.logo || null,
      params.slug
    ];

    // Execute update
    await query(sql, paramsSql);

    //  Return updated card
    const rows = await query<any[]>(selectBySlug, [params.slug]);
    return NextResponse.json(mapRowToCard(rows[0]), { status: 200 });
  } catch (error) {
    console.error('PUT /api/cards/[slug] failed', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    );
  }
}


/*  DELETE */

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = getUserFromRequest(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await query<any[]>(selectBySlug, [params.slug]);
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
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    );
  }
}

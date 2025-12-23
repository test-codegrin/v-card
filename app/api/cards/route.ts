import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { Card } from '@/types/card';
import { slugify } from '@/lib/utils';
import { cardCreateSchema } from '@/lib/validators';

// Mark dynamic to avoid static optimization conflicts.
export const dynamic = 'force-dynamic';

// Define create schema explicitly (avoids extending discriminated union)
// Include ownerEmail + optional slug alongside the discriminated union
const createPayloadSchema = z.discriminatedUnion('cardType', [
  cardCreateSchema.options[0].extend({
    ownerEmail: z.string().email('Owner email is required'),
    slug: z.string().optional()
  }),
  cardCreateSchema.options[1].extend({
    ownerEmail: z.string().email('Owner email is required'),
    slug: z.string().optional()
  })
]);

const selectBase = `
  SELECT slug, cardType, ownerEmail, template,fullName, role, company, businessName, tagline,
         email, phone, website, address, bio,
         services, products, socials, profileImage, logo, createdAt
  FROM cards
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
   template: row.template ,
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

// Extract user from JWT in Authorization header
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

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const rows = await query<any[]>(`${selectBase} WHERE ownerEmail = ? ORDER BY createdAt DESC`, [user.email]);
    return NextResponse.json(rows.map(mapRowToCard), { status: 200 });
  } catch (error) {
    console.error('GET /api/cards failed', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const parsed = createPayloadSchema.parse({ ...json, ownerEmail: user.email });

    const slugBase =
      parsed.cardType === 'business'
        ? parsed.businessName || parsed.fullName || 'card'
        : parsed.fullName || 'card';
    const slug = parsed.slug || `${slugify(slugBase)}-${Math.random().toString(36).slice(2, 6)}`;

    const sql = `
      INSERT INTO cards
      (slug, cardType, ownerEmail, template ,fullName, role, company, businessName, tagline, email, phone, website, address, bio, services, products, socials, profileImage, logo, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const payload = [
      slug,
      parsed.cardType,
      parsed.ownerEmail,
      parsed.template ,
      parsed.fullName || null,
      parsed.role || null,
      parsed.company || null,
      parsed.businessName || null,
      parsed.tagline || null,
      parsed.email,
      parsed.phone || null,
      parsed.website || null,
      parsed.address || null,
      parsed.bio || null,
      parsed.services ? JSON.stringify(parsed.services) : null,
      parsed.products ? JSON.stringify(parsed.products) : null,
      (parsed as any).social ? JSON.stringify((parsed as any).social) : (parsed as any).socials ? JSON.stringify((parsed as any).socials) : null,
      parsed.profileImage || null,
      parsed.logo || null,
      new Date()
    ];

    await query(sql, payload);

 return NextResponse.json(
  {
    ...parsed,
    socials: (parsed as any).social ?? (parsed as any).socials ?? {},
    slug,
    createdAt: new Date().toISOString()
  },
  { status: 201 }
);
  } catch (error) {
    console.error('POST /api/cards failed', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}

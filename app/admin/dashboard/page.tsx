'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { formatDate } from '@/lib/utils';

type CardItem = {
  slug: string;
  cardType: 'personal' | 'business';
  ownerEmail: string;
  template: string;
  fullName?: string;
  role?: string;
  company?: string;
  businessName?: string;
  tagline?: string;
  email: string;
  phone?: string;
  website?: string;
  profileImage?: string;
  logo?: string;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, admin, initialized } = useAdminAuthStore();

  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================================
     FETCH ALL CARDS (ADMIN)
  ================================ */
  useEffect(() => {
    if (!initialized) return;

    if (!admin || !token) {
      router.replace('/admin');
      return;
    }

    const fetchCards = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load cards');

        setCards(data.cards || []);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [admin, token, initialized, router]);

  /* ================================
     FILTERS (optional later)
  ================================ */
  const sortedCards = useMemo(() => {
    return [...cards].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [cards]);

  /* ================================
     UI STATES
  ================================ */
  if (loading) {
    return <div className="text-gray-600">Loading admin dashboard…</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <p className="caption text-[#9f2b34]">Admin Dashboard</p>
        <h1 className="text-4xl font-semibold text-black">
          All User V-Cards
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Cards created by all users on the platform
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Total Cards</p>
          <p className="text-2xl font-semibold">{cards.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Personal Cards</p>
          <p className="text-2xl font-semibold">
            {cards.filter(c => c.cardType === 'personal').length}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-gray-500">Business Cards</p>
          <p className="text-2xl font-semibold">
            {cards.filter(c => c.cardType === 'business').length}
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {sortedCards.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-xl font-semibold">No cards found</h2>
          <p className="mt-1 text-sm text-gray-600">
            No users have created cards yet.
          </p>
        </div>
      ) : (
        /* CARD GRID */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedCards.map((card) => (
            <div
              key={card.slug}
              className="group rounded-2xl border border-[#9f2b34] bg-[#9f2b34]/10 p-4
                shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* TOP */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl
                  bg-[#9f2b34]/10 text-lg font-bold text-[#9f2b34]"
                >
                  {card.profileImage || card.logo ? (
                    <img
                      src={card.profileImage || card.logo}
                      alt={card.fullName || card.businessName || 'V'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (card.fullName || card.businessName || 'V')[0]?.toUpperCase()
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-black">
                    {card.fullName || card.businessName}
                  </h3>

                  <p className="text-xs text-gray-600">
                    {[card.role || card.tagline, card.company || card.businessName]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>

                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Created {formatDate(card.createdAt)}
                  </p>
                </div>
              </div>

              {/* META */}
              <div className="mt-4 grid gap-2 text-xs text-gray-700">
                <span className="rounded-lg bg-gray-100 px-2 py-1">
                  Owner: {card.ownerEmail}
                </span>

                {card.email && (
                  <span className="rounded-lg bg-gray-100 px-2 py-1">
                    {card.email}
                  </span>
                )}

                {card.website && (
                  <span className="rounded-lg bg-gray-100 px-2 py-1">
                    {card.website}
                  </span>
                )}

                <span className="rounded-lg bg-[#9f2b34]/10 px-2 py-1 capitalize text-[#9f2b34]">
                  {card.template || 'modern'} template
                </span>
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/share/${card.slug}`)}
                >
                  View Card
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { useCardStore } from '@/store/cardStore';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { cards, loading, fetchCards, deleteCard } = useCardStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (user) fetchCards();
  }, [fetchCards, user]);

  const filteredCards = useMemo(() => {
    const ownerEmail = user?.email;
    if (!ownerEmail) return [];

    const query = search.trim().toLowerCase();

    return cards
      .filter((card) => card.ownerEmail === ownerEmail)
      .filter((card) => {
        if (!query) return true;

        const searchableText = [
          card.fullName,
          card.businessName,
          card.company,
          card.role,
          card.tagline,
          card.email,
          card.phone,
          card.website,
          card.address,
          card.template
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort((a, b) =>
        sort === 'newest'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [cards, search, sort, user?.email]);

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Delete this card?')) return;
    await deleteCard(slug);
  };

  if (loading && cards.length === 0) {
    return <div className="text-gray-600">Loading your cards…</div>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[15px] caption text-[#9f2b34]">
            Dashboard
          </p>
          <h1 className="text-4xl font-semibold text-black">
            Your V-Cards
          </h1>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => fetchCards()}>
            Refresh
          </Button>
          <Link href="/cards/new">
            <Button>+ New Card</Button>
          </Link>
        </div>
      </div>

      {/* SEARCH & SORT */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border order-[#9f2b34] bg-[#9f2b34]/10 p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, email…"
          className="w-full max-w-md rounded-xl border border-black/10 bg-white px-4 py-3 text-sm
            placeholder:text-gray-400
            focus:border-[#9f2b34] focus:outline-none"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
          className="rounded-xl border border-black/10 bg-white px-3 py-3 text-sm
            focus:border-[#9f2b34] focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {filteredCards.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black">
            No cards yet
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Create your first digital card to get started.
          </p>

          <Link href="/cards/new" className="mt-4 inline-block">
            <Button>New Card</Button>
          </Link>
        </div>
      ) : (
        /* CARD GRID */
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCards.map((card) => (
            <Link
              key={card.slug}
              href={`/cards/${encodeURIComponent(card.slug)}`}
              className="group block rounded-2xl border border-[#9f2b34] bg-[#9f2b34]/10 p-4
                shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* TOP */}
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl
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
                {card.email && (
                  <span className="rounded-lg bg-gray-100 px-2 py-1">
                    {card.email}
                  </span>
                )}
                {card.phone && (
                  <span className="rounded-lg bg-gray-100 px-2 py-1">
                    {card.phone}
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
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/share/${card.slug}`} onClick={(e) => e.stopPropagation()}>
                  <Button variant="secondary" size="sm">
                    Share
                  </Button>
                </Link>

                <Button variant="ghost" size="sm">
                  Open
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(card.slug);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

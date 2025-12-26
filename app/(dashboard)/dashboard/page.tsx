'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { useCardStore } from '@/store/cardStore';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import SortSelect from '@/components/ui/Select';

export default function DashboardPage() {
  const router = useRouter();
  const { cards, loading, fetchCards, deleteCard } = useCardStore();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

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

  const confirmDelete = async () => {
    if (!deleteSlug) return;
    await deleteCard(deleteSlug);
    setDeleteSlug(null);
  };

  if (loading && cards.length === 0) {
    return <div className="text-gray-600">Loading your cards…</div>;
  }

  return (
    <div className="">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="caption text-[#9f2b34]">Dashboard</p>
          <h1 className="text-4xl font-semibold text-black">Your V-Cards</h1>
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
      <div className="flex flex-wrap items-center gap-3 mt-5 rounded-2xl border bg-[#9f2b34]/10 p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, email…"
          className="w-full max-w-md rounded-xl border border-black/10 bg-white px-4 py-3 text-sm
            placeholder:text-gray-400 focus:border-[#9f2b34] focus:outline-none"
        />

        <SortSelect value={sort} onChange={setSort} />

      </div>

      {/* EMPTY STATE */}
      {filteredCards.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 mt-5 shadow-sm">
          <h2 className="text-xl font-semibold text-black">No cards yet</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create your first digital card to get started.
          </p>

          <Link href="/cards/new" className="mt-4 inline-block">
            <Button>New Card</Button>
          </Link>
        </div>
      ) : (
        /* CARD GRID */
        <div className="grid gap-5 mt-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCards.map((card) => (
            <div
              key={card.slug}
              className="group rounded-2xl border border-[#9f2b34] bg-[#9f2b34]/10 p-4
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
                <Link href={`/share/${card.slug}`}>
                  <Button variant="secondary" size="sm">
                    Share
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/cards/${card.slug}`)}
                >
                  Open
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteSlug(card.slug)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteSlug && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-black">Delete Card?</h3>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteSlug(null)}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

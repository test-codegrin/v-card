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

  // Load cards for the signed-in user
  useEffect(() => {
    if (user) fetchCards();
  }, [fetchCards, user]);

  const filteredCards = useMemo(() => {
    const ownerEmail = user?.email;
    if (!ownerEmail) return [];
    const query = search.toLowerCase();
    return cards
      .filter((card) => card.ownerEmail === ownerEmail)
      .filter((card) => {
        const name = (card.fullName || card.businessName || '').toLowerCase();
        const company = (card.company || card.businessName || '').toLowerCase();
        return name.includes(query) || company.includes(query);
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
    return <div className="text-white/70">Loading your cards...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Dashboard</p>
          <h1 className="text-3xl font-semibold text-white">Your V-Cards</h1>
        </div>
        <Link href="/cards/new">
          <Button>Create New Card</Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or company"
          className="w-full max-w-sm rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {filteredCards.length === 0 ? (
        <div className="glass-panel flex flex-col items-start gap-3 rounded-2xl p-6 text-white/80">
          <h2 className="text-xl font-semibold text-white">No cards yet</h2>
          <p>Create your first card to see it listed here.</p>
          <Link href="/cards/new">
            <Button variant="primary">New card</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((card) => (
            <div key={card.slug} className="glass-panel rounded-2xl p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{card.fullName || card.businessName}</h3>
                  <p className="text-sm text-white/60">
                    {[card.role || card.tagline, card.company || card.businessName].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-xs text-white/50">Created {formatDate(card.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/share/${card.slug}`}>
                    <Button variant="secondary" size="sm">
                      Share link
                    </Button>
                  </Link>
                  <Link href={`/cards/${card.slug}`}>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(card.slug)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

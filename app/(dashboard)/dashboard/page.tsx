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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="caption">Dashboard</p>
          <h1 className="heading-2">Your V-Cards</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => fetchCards()}>
            Refresh
          </Button>
          <Link href="/cards/new">
            <Button>Create New Card</Button>
          </Link>
        </div>
      </div>

      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or company"
          className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-primary focus:outline-none"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-primary focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {filteredCards.length === 0 ? (
        <div className="glass flex flex-col items-start gap-3 p-6 text-white/80">
          <h2 className="text-xl font-semibold text-white">No cards yet</h2>
          <p>Create your first card to see it listed here.</p>
          <Link href="/cards/new">
            <Button variant="primary">New card</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCards.map((card) => (
            <Link
  key={card.slug}
  href={`/cards/${encodeURIComponent(card.slug)}`}
  className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-card-hover transition hover:-translate-y-1"
>
  <div className="flex items-start gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-lg font-bold text-primary">
      {(card.fullName || card.businessName || 'V')[0]?.toUpperCase()}
    </div>

    <div className="flex-1 space-y-1">
      <h3 className="text-lg font-semibold">
        {card.fullName || card.businessName}
      </h3>

      <p className="text-xs text-white/60">
        {[card.role || card.tagline, card.company || card.businessName]
          .filter(Boolean)
          .join(' • ')}
      </p>

      <p className="text-[11px] uppercase tracking-wide text-white/50">
        Created {formatDate(card.createdAt)}
      </p>
    </div>
  </div>

  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/70">
    {card.email && <span className="rounded-lg bg-white/5 px-2 py-1">Email</span>}
    {card.phone && <span className="rounded-lg bg-white/5 px-2 py-1">Phone</span>}
    {card.website && <span className="rounded-lg bg-white/5 px-2 py-1">Website</span>}
    <span className="rounded-lg bg-white/5 px-2 py-1 capitalize">
      {card.template || 'modern'} template
    </span>
  </div>

  <div className="mt-4 flex flex-wrap gap-2">
    <Link href={`/share/${card.slug}`} onClick={(e) => e.stopPropagation()}>
      <Button variant="secondary" size="sm">
        Share
      </Button>
    </Link>

    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
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

'use client';

import CardPreview from '@/components/ui/CardPreview';
import Button from '@/components/ui/Button';
import { useCardStore } from '@/store/cardStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { generateVCard } from '@/lib/vcf';
import { Card } from '@/types/card';

type Props = { slug: string };

export default function ShareClient({ slug }: Props) {
  const router = useRouter();
  const { getCard } = useCardStore();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getCard(slug, { public: true });
      setCard(data);
      setLoading(false);
    };
    load();
  }, [getCard, slug]);

  const handleSaveContact = () => {
    if (!card) return;
    const vcf = generateVCard(card);
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.fullName || 'contact'}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-white/70">Loading card...</div>;
  }

  if (!card) {
    return (
      <div className="glass space-y-4 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-semibold">Card not found</h1>
        <p className="text-white/70">This card is not available.</p>
        <Button variant="ghost" onClick={() => router.push('/')}>
          Back home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="caption">Digital card</p>
        <h1 className="heading-2">
          {card.cardType === 'business' ? card.businessName || 'Business Card' : card.fullName}
        </h1>
        <p className="text-xs uppercase tracking-wide text-white/60">Template: {card.template || 'modern'}</p>
      </div>
      <div className="glass p-6">
        <CardPreview card={card} />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={handleSaveContact}>
          Save Contact (.vcf)
        </Button>
        {card.phone && (
          <a href={`tel:${card.phone}`} className="inline-flex">
            <Button variant="light">Call</Button>
          </a>
        )}
        {card.email && (
          <a href={`mailto:${card.email}`} className="inline-flex">
            <Button variant="light">Email</Button>
          </a>
        )}
        {card.website && (
          <a href={card.website} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="light">Website</Button>
          </a>
        )}
      </div>
    </div>
  );
}

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
    link.download = `${card.fullName || card.businessName || 'contact'}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /*  LOADING  */
  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading card…
      </div>
    );
  }

  /* NOT FOUND  */
  if (!card) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-black">
          Card not found
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          This card is not available or has been removed.
        </p>

        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push('/')}
        >
          Back home
        </Button>
      </div>
    );
  }

  /*   MAIN   */
  return (
    <div className="mx-auto max-w-8xl space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <p className="text-lg uppercase tracking-widest text-[#9f2b34]">
          Digital Card
        </p>

        <h1 className="text-4xl font-semibold text-black">
          {card.cardType === 'business'
            ? card.businessName || 'Business Card'
            : card.fullName}
        </h1>

        <p className="text-md uppercase tracking-wide text-gray-500">
          Template: {card.template || 'modern'}
        </p>
      </div>

      {/* CARD PREVIEW */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <CardPreview card={card} />
      </div>

      {/* ACTIONS */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm space-y-5">
        <p className="text-center text-xs uppercase tracking-widest text-gray-400">
          Quick actions
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={handleSaveContact}>
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
            <a
              href={card.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="light">Website</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

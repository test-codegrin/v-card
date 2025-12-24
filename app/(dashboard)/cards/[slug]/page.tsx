'use client';

import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import CardPreview from '@/components/cards/CardPreview';
import { useCardStore } from '@/store/cardStore';
import { Card } from '@/types/card';

/* QR COLORS PER TEMPLATE */
const TEMPLATE_QR_COLORS: Record<string, string> = {
  modern: '#7C93C3',    // blue
  creative: '#9f2b34',  // red
  classic: '#1f2937'    // dark gray
};

export default function CardDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { getCard, deleteCard, loading } = useCardStore();

  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!params?.slug) return;

    (async () => {
      const data = await getCard(params.slug, { public: true });
      setCard(data);

      if (typeof window !== 'undefined' && data) {
        setShareUrl(`${window.location.origin}/share/${data.slug}`);
      }
    })();
  }, [params?.slug, getCard]);

  /* LOADING */
  if (loading && !card) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading card…
      </div>
    );
  }

  /*  NOT FOUND */
  if (!card) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-black">Card not found</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new card or go back to the dashboard.
        </p>

        <div className="mt-4 flex gap-3">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/cards/new">
            <Button>Create card</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* HANDLERS  */
  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const canvas = qrContainerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${card.slug}-qr.png`;
    link.click();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this card? This action cannot be undone.')) {
      return;
    }
    await deleteCard(card.slug);
    router.replace('/dashboard');
  };

  /* - QR COLOR  */
  const qrColor =
    TEMPLATE_QR_COLORS[card.template as string] || '#000000';

  /* UI  */
  return (
    <div className="mx-auto max-w-8xl space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-md uppercase tracking-widest text-[#9f2b34]">
            Card details
          </p>
          <h1 className="text-4xl font-semibold text-black">
            {card.cardType === 'business'
              ? card.businessName || 'Business Card'
              : card.fullName}
          </h1>
          <p className="pt-2 text-xs uppercase tracking-wide text-gray-500">
            Template: {card.template}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Back
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push(`/share/${card.slug}`)}
          >
            Share
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push(`/cards/new?prefill=${card.slug}`)}
          >
            Edit
          </Button>

          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* CARD PREVIEW */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <CardPreview card={card} />
        </div>

        {/* SHARE PANEL */}
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm space-y-6">
          {/* SHARE URL */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Share URL
              </p>
              <p className="break-all text-sm font-semibold text-black">
                {shareUrl}
              </p>
            </div>

            <Button variant="light" size="sm" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {/* QR */}
          <div
            ref={qrContainerRef}
            className="flex flex-col items-center gap-4 rounded-xl border border-black/10 bg-[#f9fafb] p-5"
          >
            <QRCodeCanvas
              value={shareUrl || '#'}
              size={180}
              fgColor={qrColor}
              bgColor="transparent"
              includeMargin
            />

            <div className="flex gap-2">
              <Button variant="light" size="sm" onClick={handleCopy}>
                Copy link
              </Button>
              <Button variant="light" size="sm" onClick={handleDownload}>
                Download QR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

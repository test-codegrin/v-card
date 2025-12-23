'use client';

import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import CardPreview from '@/components/cards/CardPreview';
import { useCardStore } from '@/store/cardStore';
import { Card } from '@/types/card';

export default function CardDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { getCard, deleteCard, loading } = useCardStore();
  const [shareUrl, setShareUrl] = useState<string>('');
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
  }, [params?.slug]);

  if (loading && !card) {
    return <div className="text-white/70">Loading card...</div>;
  }

  if (!card) {
    return (
      <div className="glass space-y-4 p-6 text-white">
        <h1 className="text-2xl font-semibold">Card not found</h1>
        <p className="text-white/70">
          Create a new card or go back to the dashboard.
        </p>

        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="ghost">Back to dashboard</Button>
          </Link>

          <Link href="/cards/new">
            <Button variant="primary">Create card</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Copy failed', error);
    }
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="caption">Card</p>
          <h1 className="heading-2">
            {card.cardType === 'business'
              ? card.businessName || 'Business Card'
              : card.fullName}
          </h1>
          <p className="text-xs mt-2 uppercase tracking-wide text-white/60">
            Template: {card.template}
          </p>
        </div>

        <div className="flex gap-2">
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
            Edit Card
          </Button>
          <Button variant="ghost" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass p-6">
          <CardPreview card={card} />
        </div>

        <div className="panel space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">
                Share URL
              </p>
              <p className="break-all text-sm font-semibold text-white">
                {shareUrl}
              </p>
            </div>
            <Button variant="light" size="sm" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy link'}
            </Button>
          </div>

          <div
            ref={qrContainerRef}
            className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <QRCodeCanvas
              value={shareUrl || '#'}
              size={180}
              fgColor="#FFFFFF"
              bgColor="transparent"
              includeMargin
            />

            <div className="flex gap-2">
              <Button variant="light" size="sm" onClick={handleCopy}>
                Copy Link
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

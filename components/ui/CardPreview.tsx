'use client';

import { Card, CardTemplate } from '@/types/card';
import { formatDate } from '@/lib/utils';
import clsx from 'clsx';

type Props = {
  card: Card;
};

const contactItems = (card: Card) => [
  { label: 'Email', value: card.email },
  { label: 'Phone', value: card.phone },
  { label: 'Website', value: card.website },
  { label: 'Address', value: card.address }
];

const socialEntries = (card: Card) => {
  const socials = card.socials || {};
  return Object.entries(socials)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => ({ key, value: value as string }));
};

function Avatar({ src, fallback, square }: { src?: string; fallback: string; square?: boolean }) {
  if (src) {
    return (
      <img
        src={src}
        alt={fallback}
        className={clsx(
          'h-16 w-16 shrink-0 object-cover ring-2 ring-primary/30',
          square ? 'rounded-xl' : 'rounded-full'
        )}
      />
    );
  }
  return (
    <div
      className={clsx(
        'flex h-16 w-16 shrink-0 items-center justify-center bg-primary/10 text-lg font-bold text-primary',
        square ? 'rounded-xl' : 'rounded-full'
      )}
    >
      {fallback?.[0]?.toUpperCase() ?? 'V'}
    </div>
  );
}

// Modern template: gradient hero bar with elevated card.
function ModernTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-card-hover backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white/5 to-transparent" />
      <div className="relative flex items-center gap-4">
        <Avatar
          src={card.cardType === 'business' ? card.logo : card.profileImage}
          fallback={card.cardType === 'business' ? card.businessName || 'B' : card.fullName || 'V'}
          square={card.cardType === 'business'}
        />
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">
            {card.cardType === 'business' ? card.businessName || 'Business Name' : card.fullName || 'Full Name'}
          </h3>
          <p className="text-sm text-white/70">
            {card.cardType === 'business'
              ? card.tagline || card.bio || 'Brand story and promise.'
              : [card.role || card.tagline, card.company].filter(Boolean).join(' • ')}
          </p>
        </div>
        <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
          Digital Card
        </span>
      </div>

      {card.bio && <p className="mt-4 text-sm text-white/75">{card.bio}</p>}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {contactItems(card)
          .filter((item) => item.value)
          .map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-white/60">{item.label}</p>
              <p className="text-sm font-semibold text-white">{item.value}</p>
            </div>
          ))}
      </div>

      {socialEntries(card).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {socialEntries(card).map((entry) => (
            <a
              key={entry.key}
              href={entry.value}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:-translate-y-[1px] hover:border-white/30 hover:bg-white/20"
            >
              {entry.key}
            </a>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs uppercase tracking-wide text-white/50">Created {formatDate(card.createdAt)}</p>
    </div>
  );
}

// Classic template: split layout with accent bar.
function ClassicTemplate({ card }: { card: Card }) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 text-secondary shadow-soft">
      <div className="flex items-start gap-4">
        <Avatar
          src={card.cardType === 'business' ? card.logo : card.profileImage}
          fallback={card.cardType === 'business' ? card.businessName || 'B' : card.fullName || 'V'}
          square={card.cardType === 'business'}
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold">
              {card.cardType === 'business' ? card.businessName || 'Business Name' : card.fullName || 'Full Name'}
            </h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Premium</span>
          </div>
          <p className="text-sm text-surface-500">
            {card.cardType === 'business'
              ? card.tagline || 'Brand promise in one line.'
              : [card.role || card.tagline, card.company].filter(Boolean).join(' • ')}
          </p>
        </div>
      </div>

      {card.bio && <p className="mt-4 text-sm leading-relaxed text-surface-600">{card.bio}</p>}

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {contactItems(card)
          .filter((item) => item.value)
          .map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-surface-200 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">{item.label}</p>
              <p className="text-sm font-semibold text-secondary">{item.value}</p>
            </div>
          ))}
      </div>

      {socialEntries(card).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {socialEntries(card).map((entry) => (
            <a
              key={entry.key}
              href={entry.value}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary transition hover:border-primary/40 hover:text-primary"
            >
              {entry.key}
            </a>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs uppercase tracking-wide text-surface-400">Created {formatDate(card.createdAt)}</p>
    </div>
  );
}

// Creative template: offset cards and accent gradients to emphasize shareability.
function CreativeTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-secondary via-secondary to-primary/20 p-6 text-white shadow-card-hover">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,72,0.25),transparent_35%)]" />
      <div className="relative grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={card.cardType === 'business' ? card.logo : card.profileImage}
              fallback={card.cardType === 'business' ? card.businessName || 'B' : card.fullName || 'V'}
              square={card.cardType === 'business'}
            />
            <div>
              <h3 className="text-2xl font-semibold">
                {card.cardType === 'business' ? card.businessName || 'Business Name' : card.fullName || 'Full Name'}
              </h3>
              <p className="text-sm text-white/70">
                {card.cardType === 'business'
                  ? card.tagline || 'Creative studio lead'
                  : [card.role || card.tagline, card.company].filter(Boolean).join(' • ')}
              </p>
            </div>
          </div>
          {card.bio && <p className="text-sm text-white/80">{card.bio}</p>}
          <div className="flex flex-wrap gap-3">
            {socialEntries(card).map((entry) => (
              <a
                key={entry.key}
                href={entry.value}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:-translate-y-[1px] hover:bg-white/20"
              >
                {entry.key}
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-card-hover backdrop-blur">
          <p className="text-xs uppercase tracking-wide text-white/60">Contacts</p>
          <div className="mt-3 space-y-2">
            {contactItems(card)
              .filter((item) => item.value)
              .map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/60">{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <p className="relative mt-4 text-xs uppercase tracking-wide text-white/60">Created {formatDate(card.createdAt)}</p>
    </div>
  );
}

const templates: Record<CardTemplate, (props: { card: Card }) => JSX.Element> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate
};

export default function CardPreview({ card }: Props) {
  const template = (card.template as CardTemplate) || 'modern';
  const TemplateComponent = templates[template] || templates.modern;
  return <TemplateComponent card={card} />;
}

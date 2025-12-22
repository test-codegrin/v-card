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
          'h-16 w-16 shrink-0 object-cover ring-2 ring-primary/30 shadow-card-hover',
          square ? 'rounded-xl' : 'rounded-full'
        )}
      />
    );
  }
  return (
    <div
      className={clsx(
        'flex h-16 w-16 shrink-0 items-center justify-center bg-primary/10 text-lg font-bold text-primary ring-2 ring-primary/30',
        square ? 'rounded-xl' : 'rounded-full'
      )}
    >
      {fallback?.[0]?.toUpperCase() ?? 'V'}
    </div>
  );
}

/*  MODERN */
function ModernTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-card-hover backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-white/5 to-transparent" />

      <div className="relative space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={card.cardType === 'business' ? card.logo : card.profileImage}
              fallback={card.cardType === 'business' ? card.businessName || 'B' : card.fullName || 'V'}
              square={card.cardType === 'business'}
            />
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold leading-tight">
                {card.cardType === 'business'
                  ? card.businessName || 'Business Name'
                  : card.fullName || 'Full Name'}
              </h3>
              <p className="text-sm text-white/70">
                {card.cardType === 'business'
                  ? card.tagline || card.bio || 'Brand story and promise.'
                  : [card.role || card.tagline, card.company].filter(Boolean).join(' • ')}
              </p>
            </div>
          </div>

          {/* Card type badge */}
          <span className="self-start rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70 sm:ml-auto sm:self-center">
            Digital Card
          </span>
        </div>

        {card.bio && (
          <p className="text-sm leading-relaxed text-white/80">
            {card.bio}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contactItems(card)
            .filter((item) => item.value)
            .map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <p className="text-xs uppercase tracking-wide text-white/60">{item.label}</p>
                <p className="text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
        </div>

        {socialEntries(card).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
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

        <p className="pt-2 text-xs uppercase tracking-wide text-white/50">
          Created {formatDate(card.createdAt)}
        </p>
      </div>
    </div>
  );
}
/*  CLASSIC */
function ClassicTemplate({ card }: { card: Card }) {
  return (
    <div className="relative rounded-2xl border border-surface-200 bg-white p-6 text-secondary shadow-soft space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-surface-200 pb-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={card.cardType === 'business' ? card.logo : card.profileImage}
            fallback={card.cardType === 'business' ? card.businessName || 'B' : card.fullName || 'V'}
            square={card.cardType === 'business'}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-surface-800">
              {card.cardType === 'business'
                ? card.businessName || 'Business Name'
                : card.fullName || 'Full Name'}
            </h3>
            <p className="text-sm text-surface-500">
              {card.cardType === 'business'
                ? card.tagline || 'Brand promise in one line.'
                : [card.role || card.tagline, card.company].filter(Boolean).join(' • ')}
            </p>
          </div>
        </div>

        {/* Card type badge */}
        <span className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:ml-auto sm:self-center">
          Classic
        </span>
      </div>

      {card.bio && (
        <p className="text-sm leading-relaxed text-surface-600">
          {card.bio}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {contactItems(card)
          .filter((item) => item.value)
          .map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-2"
            >
              <p className="text-xs uppercase tracking-wide text-surface-500">{item.label}</p>
              <p className="text-sm font-semibold text-secondary">{item.value}</p>
            </div>
          ))}
      </div>

      {socialEntries(card).length > 0 && (
        <div className="flex flex-wrap gap-2">
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

      <p className="text-xs uppercase tracking-wide text-surface-400">
        Created {formatDate(card.createdAt)}
      </p>
    </div>
  );
}


/* ===================== CREATIVE  ===================== */
function CreativeTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-secondary via-secondary to-primary/20 p-6 text-white shadow-card-hover">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,72,0.25),transparent_40%)]" />

      <div className="relative grid gap-6 md:grid-cols-[1fr_1fr]">
        {/* Left / Hero */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              src={card.cardType === 'business' ? card.logo : card.profileImage}
              fallback={card.cardType === 'business' ? card.businessName || 'B' : card.fullName || 'V'}
              square={card.cardType === 'business'}
            />
            <div>
              <h3 className="text-2xl font-semibold">
                {card.cardType === 'business'
                  ? card.businessName || 'Business Name'
                  : card.fullName || 'Full Name'}
              </h3>
              <p className="text-sm text-white/70">
                {card.cardType === 'business'
                  ? card.tagline || 'Creative studio lead'
                  : [card.role || card.tagline, card.company].filter(Boolean).join(' • ')}
              </p>
            </div>
          </div>

          {card.bio && (
            <p className="text-sm leading-relaxed text-white/80">
              {card.bio}
            </p>
          )}

          {socialEntries(card).length > 0 && (
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
          )}
        </div>

        {/* Right / Contacts */}
       <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur space-y-3">
  <p className="text-xs uppercase tracking-wide text-white/60">Contact</p>

  {contactItems(card)
    .filter((item) => item.value)
    .map((item) => (
      <div
        key={item.label}
        className="rounded-xl bg-white/5 px-3 py-2 space-y-1"
      >
        <span className="block text-xs font-semibold uppercase tracking-wide text-white/60">
          {item.label}
        </span>
        <span className="block text-sm font-semibold text-white break-all">
          {item.value}
        </span>
      </div>
    ))}
</div>
      </div>

      <p className="relative mt-4 text-xs uppercase tracking-wide text-white/60">
        Created {formatDate(card.createdAt)}
      </p>
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

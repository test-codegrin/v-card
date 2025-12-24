'use client';

import { Card, CardTemplate } from '@/types/card';
import { formatDate } from '@/lib/utils';
import { generateVCard } from '@/lib/vcf'; 
import clsx from 'clsx';

type Props = {
  card: Card;
};

const handleSaveContact = (card: Card) => {
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

function Avatar({
  src,
  fallback,
  square
}: {
  src?: string;
  fallback: string;
  square?: boolean;
}) {
  // Show image if available
  if (src) {
    return (
      <img
        src={src}
        alt={fallback}
        className={clsx(
          'h-40 w-40 object-cover ring-2 ring-primary/30 shadow-card-hover',
          square ? 'rounded-xl' : 'rounded-full'
        )}
      />
    );
  }

  // Solid color initial avatar
  return (
    <div
      className={clsx(
        'flex h-40 w-40 items-center justify-center text-5xl font-semibold text-white ring-2 ring-primary/30 shadow-card-hover',
        square ? 'rounded-xl' : 'rounded-full',
        'bg-slate-700'
      )}
    >
      {fallback?.charAt(0)?.toUpperCase() ?? 'V'}
    </div>
  );
}

const socialIcons: Record<string, JSX.Element> = {
  facebook: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.1V12h2.1V9.8c0-2.1 1.2-3.3 3.1-3.3.9 0 1.9.1 1.9.1v2.1h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.8A4.2 4.2 0 1 0 16.2 12 4.2 4.2 0 0 0 12 7.8Zm0 6.8A2.6 2.6 0 1 1 14.6 12 2.6 2.6 0 0 1 12 14.6Zm4.5-7.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm7 0h3.8v1.6h.1a4.2 4.2 0 0 1 3.8-2.1c4 0 4.7 2.6 4.7 6v6.5h-4v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21h-4V9Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 .5A12 12 0 0 0 0 12.7c0 5.4 3.4 10 8.2 11.6.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.3 1.8 1.3 1.1 1.9 3 1.4 3.7 1.1.1-.8.4-1.4.7-1.7-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.4-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.3a11 11 0 0 1 6 0c2.3-1.6 3.3-1.3 3.3-1.3.6 1.7.2 3 .1 3.3.7.9 1.2 2 1.2 3.3 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.3v3.4c0 .3.2.7.8.6A12.3 12.3 0 0 0 24 12.7 12 12 0 0 0 12 .5Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C17.7 2.7 12 2.7 12 2.7h-.1s-5.7 0-8.6.3c-.4.1-1.3.1-2.1.9-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v2c0 1.9.3 3.8.3 3.8s.2 1.6.8 2.3c.8.8 1.9.8 2.4.9 1.7.2 7.2.3 7.2.3s5.7 0 8.6-.3c.4-.1 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.3-1.9.3-3.8v-2c0-1.9-.3-3.8-.3-3.8ZM9.5 14.7V7.8l6.2 3.5-6.2 3.4Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M23 3a10.9 10.9 0 0 1-3.1.9A5.4 5.4 0 0 0 22.3.4a10.8 10.8 0 0 1-3.4 1.3A5.4 5.4 0 0 0 9.6 6.6 15.3 15.3 0 0 1 1.6 1.1a5.4 5.4 0 0 0 1.7 7.2 5.3 5.3 0 0 1-2.4-.6v.1a5.4 5.4 0 0 0 4.3 5.3 5.4 5.4 0 0 1-2.4.1 5.4 5.4 0 0 0 5 3.7A10.8 10.8 0 0 1 0 19.5a15.2 15.2 0 0 0 8.3 2.4c10 0 15.4-8.3 15.4-15.4v-.7A11 11 0 0 0 23 3Z" />
    </svg>
  )
};

 /* MODERN  */
function ModernTemplate({ card }: { card: Card }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-black/10
        bg-gradient-to-br from-white via-[#EEF5FF] to-white
        text-black shadow-lg"
    >
      {/* Top accent */}
      <div className="h-32 bg-gradient-to-r from-[#284b63] via-[#284b63]/85 to-[#284b63]/60" />

      {/* Avatar */}
      <div className="-mt-20 flex justify-center">
        <Avatar
          src={card.cardType === 'business' ? card.logo : card.profileImage}
          fallback={
            card.cardType === 'business'
              ? card.businessName || 'B'
              : card.fullName || 'V'
          }
          square={card.cardType === 'business'}
        />
      </div>

      {/* Content */}
      <div className="relative space-y-5 px-6 pb-6 pt-4 text-center">
        {/* Name */}
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          {card.cardType === 'business'
            ? card.businessName || 'Business Name'
            : card.fullName || 'Full Name'}
        </h2>

        {/* Role / Tagline / Company */}
        <div className="space-y-1 text-sm text-slate-600">
          {card.cardType === 'personal' && card.role && <p>{card.role}</p>}
          {card.company && (
            <p className="font-medium text-[#7C93C3]">{card.company}</p>
          )}
          {card.cardType === 'business' && card.tagline && <p>{card.tagline}</p>}
        </div>

        {/* Address */}
        {card.address && (
          <p className="text-sm text-slate-500">{card.address}</p>
        )}

        {/* Bio / About */}
        {card.bio && (
          <p className="pt-2 text-sm leading-relaxed text-slate-600">
            {card.bio}
          </p>
        )}

        {/* Social Links */}
        {socialEntries(card).length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {socialEntries(card).map((entry) => (
              <a
                key={entry.key}
                href={entry.value}
                target="_blank"
                rel="noreferrer"
                title={entry.key}
                aria-label={entry.key}
                className="flex h-10 w-10 items-center justify-center rounded-full
                  bg-[#7C93C3]/15 text-[#7C93C3]
                  transition-all
                  hover:bg-[#7C93C3]
                  hover:text-white"
              >
                {socialIcons[entry.key]}
              </a>
            ))}
          </div>
        )}

        {/* Save Contact */}
        <button
          onClick={() => handleSaveContact(card)}
          className="mt-4 w-full rounded-xl
            bg-[#7C93C3] py-3
            text-sm font-semibold text-white
            shadow-md transition hover:bg-[#6a82b5]"
        >
          Save Contact
        </button>

        {/* Services (Business) */}
        {card.cardType === 'business' && (card.services?.length ?? 0) > 0 && (
          <div className="space-y-2 pt-4 text-left">
            <p className="text-sm font-semibold text-slate-800">Services</p>
            {card.services!.map((service, index) => (
              <div
                key={index}
                className="rounded-xl border border-black/10 bg-white p-3"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {service.name}
                </p>
                {service.description && (
                  <p className="text-xs text-slate-600">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Products (Business) */}
        {card.cardType === 'business' && (card.products?.length ?? 0) > 0 && (
          <div className="space-y-2 pt-2 text-left">
            <p className="text-sm font-semibold text-slate-800">Products</p>
            {card.products!.map((product, index) => (
              <a
                key={index}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-black/10
                  bg-white p-3 transition hover:bg-[#EEF5FF]"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {product.name}
                </p>
                {product.link && (
                  <p className="text-xs text-slate-500 break-all">
                    {product.link}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-3 pt-4 text-left">
          <p className="text-sm font-semibold text-slate-800">Contact</p>
          {contactItems(card)
            .filter((item) => item.value)
            .map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-black/10
                  bg-white px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-slate-800 break-all">
                  {item.value}
                </p>
              </div>
            ))}
        </div>

        {/* Footer */}
        <p className="pt-4 text-xs uppercase tracking-wide text-slate-400">
          Created {formatDate(card.createdAt)}
        </p>
      </div>
    </div>
  );
}

/*  CLASSIC */
function ClassicTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white text-black shadow-md">
      {/* Top accent */}
      <div className="h-32 bg-gradient-to-r from-black to-black/70" />

      {/* Avatar */}
      <div className="-mt-20 flex justify-center">
        <Avatar
          src={card.cardType === 'business' ? card.logo : card.profileImage}
          fallback={
            card.cardType === 'business'
              ? card.businessName || 'B'
              : card.fullName || 'V'
          }
          square={card.cardType === 'business'}
        />
      </div>

      <div className="space-y-5 px-6 pb-6 pt-4 text-center">
        <h2 className="text-xl font-semibold">
          {card.cardType === 'business'
            ? card.businessName || 'Business Name'
            : card.fullName || 'Full Name'}
        </h2>

        <div className="space-y-1 text-sm text-gray-600">
          {card.cardType === 'personal' && card.role && <p>{card.role}</p>}
          {card.company && <p className="font-medium text-black">{card.company}</p>}
          {card.cardType === 'business' && card.tagline && <p>{card.tagline}</p>}
        </div>

        {card.address && (
          <p className="text-sm text-gray-500">{card.address}</p>
        )}

        {card.bio && (
          <p className="pt-2 text-sm leading-relaxed text-gray-700">
            {card.bio}
          </p>
        )}

        {socialEntries(card).length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {socialEntries(card).map((entry) => (
              <a
                key={entry.key}
                href={entry.value}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full
                  border border-black/15 bg-white text-black
                  transition hover:bg-black hover:text-white"
              >
                {socialIcons[entry.key]}
              </a>
            ))}
          </div>
        )}

        <button
          onClick={() => handleSaveContact(card)}
          className="mt-4 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-black/90"
        >
          Save Contact
        </button>

        {/* Services */}
        {card.cardType === 'business' && (card.services?.length ?? 0) > 0 && (
          <div className="space-y-2 pt-4 text-left">
            <p className="text-sm font-semibold">Services</p>
            {card.services!.map((service, index) => (
              <div
                key={index}
                className="rounded-xl border border-black/10 bg-white p-3"
              >
                <p className="text-sm font-semibold">{service.name}</p>
                {service.description && (
                  <p className="text-xs text-gray-600">{service.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Products */}
        {card.cardType === 'business' && (card.products?.length ?? 0) > 0 && (
          <div className="space-y-2 pt-2 text-left">
            <p className="text-sm font-semibold">Products</p>
            {card.products!.map((product, index) => (
              <a
                key={index}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-black/10 bg-white p-3 hover:bg-black/5"
              >
                <p className="text-sm font-semibold">{product.name}</p>
                {product.link && (
                  <p className="text-xs text-gray-500 break-all">{product.link}</p>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Contact */}
        <div className="grid gap-3 pt-4 text-left">
          <p className="text-sm font-semibold">Contact</p>
          {contactItems(card)
            .filter((item) => item.value)
            .map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-black/10 bg-white px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="text-sm font-semibold break-all">
                  {item.value}
                </p>
              </div>
            ))}
        </div>

        <p className="pt-4 text-xs uppercase tracking-wide text-gray-400">
          Created {formatDate(card.createdAt)}
        </p>
      </div>
    </div>
  );
}

/* CREATIVE  */
function CreativeTemplate({ card }: { card: Card }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-black/10
        bg-gradient-to-br from-white via-[#fdf2f3] to-white
        text-black shadow-lg"
    >
      {/* Top accent */}
      <div className="h-32 bg-gradient-to-r from-[#9f2b34]/70 to-[#9f2b34]/30" />

      {/* Avatar */}
      <div className="-mt-20 flex justify-center">
        <Avatar
          src={card.cardType === 'business' ? card.logo : card.profileImage}
          fallback={
            card.cardType === 'business'
              ? card.businessName || 'B'
              : card.fullName || 'V'
          }
          square={card.cardType === 'business'}
        />
      </div>

      {/* Content */}
      <div className="relative space-y-5 px-6 pb-6 pt-4 text-center">
        {/* Name */}
        <h2 className="text-xl font-semibold">
          {card.cardType === 'business'
            ? card.businessName || 'Business Name'
            : card.fullName || 'Full Name'}
        </h2>

        {/* Role / Tagline / Company */}
        <div className="space-y-1 text-sm text-gray-600">
          {card.cardType === 'personal' && card.role && <p>{card.role}</p>}
          {card.company && (
            <p className="font-medium text-[#9f2b34]">{card.company}</p>
          )}
          {card.cardType === 'business' && card.tagline && (
            <p>{card.tagline}</p>
          )}
        </div>

        {/* Address */}
        {card.address && (
          <p className="text-sm text-gray-500">{card.address}</p>
        )}

        {/* Bio / About */}
        {card.bio && (
          <p className="pt-2 text-sm leading-relaxed text-gray-700">
            {card.bio}
          </p>
        )}

        {/* Social Links */}
        {socialEntries(card).length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {socialEntries(card).map((entry) => (
              <a
                key={entry.key}
                href={entry.value}
                target="_blank"
                rel="noreferrer"
                title={entry.key}
                aria-label={entry.key}
                className="flex h-10 w-10 items-center justify-center rounded-full
                  bg-[#9f2b34]/10 text-[#9f2b34]
                  transition hover:bg-[#9f2b34] hover:text-white"
              >
                {socialIcons[entry.key]}
              </a>
            ))}
          </div>
        )}

        {/* Save Contact */}
        <button
          onClick={() => handleSaveContact(card)}
          className="mt-4 w-full rounded-xl bg-[#9f2b34] py-3
            text-sm font-semibold text-white
            shadow-md transition hover:bg-[#9f2b34]/90"
        >
          Save Contact
        </button>

        {/* Services (Business) */}
        {card.cardType === 'business' && (card.services?.length ?? 0) > 0 && (
          <div className="space-y-2 pt-4 text-left">
            <p className="text-sm font-semibold text-black">Services</p>
            {card.services!.map((service, index) => (
              <div
                key={index}
                className="rounded-xl border border-black/10 bg-white p-3"
              >
                <p className="text-sm font-semibold text-black">
                  {service.name}
                </p>
                {service.description && (
                  <p className="text-xs text-gray-600">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Products (Business) */}
        {card.cardType === 'business' && (card.products?.length ?? 0) > 0 && (
          <div className="space-y-2 pt-2 text-left">
            <p className="text-sm font-semibold text-black">Products</p>
            {card.products!.map((product, index) => (
              <a
                key={index}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-black/10
                  bg-white p-3 transition hover:bg-[#9f2b34]/5"
              >
                <p className="text-sm font-semibold text-black">
                  {product.name}
                </p>
                {product.link && (
                  <p className="text-xs text-gray-500 break-all">
                    {product.link}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-3 pt-4 text-left">
          <p className="text-sm font-semibold text-black">Contact</p>
          {contactItems(card)
            .filter((item) => item.value)
            .map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-black/10
                  bg-white px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-black break-all">
                  {item.value}
                </p>
              </div>
            ))}
        </div>

        {/* Footer */}
        <p className="pt-4 text-xs uppercase tracking-wide text-gray-400">
          Created {formatDate(card.createdAt)}
        </p>
      </div>
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

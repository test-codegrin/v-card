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

 
function ModernTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white shadow-card-hover backdrop-blur">
      {/* Top accent */}
      <div className="h-32 bg-gradient-to-r from-primary/60 to-primary/30" />

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
        <div className="space-y-1 text-sm text-white/70">
          {card.cardType === 'personal' && card.role && <p>{card.role}</p>}
          {card.company && <p className="font-medium text-white">{card.company}</p>}
          {card.cardType === 'business' && card.tagline && <p>{card.tagline}</p>}
        </div>

        {/* Address */}
        {card.address && (
          <p className="text-sm text-white/60">
            {card.address}
          </p>
        )}

        {/* Bio / About */}
        {card.bio && (
          <p className="pt-2 text-sm leading-relaxed text-white/80">
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                {socialIcons[entry.key]}
              </a>
            ))}
          </div>
        )}

        {/* Save Contact */}
        <button onClick={() => handleSaveContact(card)} className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90">
          Save Contact
        </button>

        {/* Services (Business) */}
        {card.cardType === 'business' && (card.services?.length ?? 0) > 0 && (
          <div className="space-y-2 pt-4 text-left">
            <p className="text-sm font-semibold text-white">Services</p>
            {card.services!.map((service, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <p className="text-sm font-semibold text-white">
                  {service.name}
                </p>
                {service.description && (
                  <p className="text-xs text-white/70">
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
            <p className="text-sm font-semibold text-white">Products</p>
            {card.products!.map((product, index) => (
              <a
                key={index}
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
              >
                <p className="text-sm font-semibold text-white">
                  {product.name}
                </p>
                {product.link && (
                  <p className="text-xs text-white/60 ">
                    {product.link}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-3 pt-4 text-left">
          <p className="text-sm font-semibold text-white">Contact</p>
          {contactItems(card)
            .filter((item) => item.value)
            .map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-white break-all">
                  {item.value}
                </p>
              </div>
            ))}
        </div>

        {/* Footer */}
        <p className="pt-4 text-xs uppercase tracking-wide text-white/50">
          Created {formatDate(card.createdAt)}
        </p>
      </div>
    </div>
  );
}

/*  CLASSIC */
function ClassicTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-800 shadow-soft">

      <div className="grid grid-cols-1 md:grid-cols-3">

        {/* LEFT COLUMN  */}
        <div className="border-r border-slate-200 bg-slate-50 px-6 py-8 text-center md:text-left">

          {/* Avatar */}
          <div className="mb-6 flex justify-center md:justify-start">
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

          {/* Name */}
          <h2 className="text-xl font-bold text-slate-900">
            {card.cardType === 'business'
              ? card.businessName || 'Business Name'
              : card.fullName || 'Full Name'}
          </h2>

          {/* Role / Company / Tagline */}
          <div className="mt-1 space-y-1 text-sm">
            {card.cardType === 'personal' && card.role && (
              <p className="text-slate-600">{card.role}</p>
            )}

            {card.company && (
              <p className="font-medium text-slate-700">
                {card.company}
              </p>
            )}

            {card.cardType === 'business' && card.tagline && (
              <p className="text-slate-500">
                {card.tagline}
              </p>
            )}
          </div>

          {/* Divider */}
          <hr className="my-6 border-slate-200" />

          {/* Contact Info */}
          <div className="space-y-3 text-sm">
            {contactItems(card)
              .filter((item) => item.value)
              .map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="font-medium break-all text-slate-800">
                    {item.value}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT COLUMN  */}
        <div className="px-8 py-8 md:col-span-2">

          {/* About */}
          {card.bio && (
            <div className="mb-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                About
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {card.bio}
              </p>
            </div>
          )}

          {/* Address */}
          {card.address && (
            <div className="mb-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                Address
              </h3>
              <p className="text-sm text-slate-600">
                {card.address}
              </p>
            </div>
          )}

          {/* Services */}
          {card.cardType === 'business' && (card.services?.length ?? 0) > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                Services
              </h3>
              <div className="space-y-3">
                {card.services!.map((service, index) => (
                  <div key={index}>
                    <p className="text-sm font-semibold text-slate-800">
                      {service.name}
                    </p>
                    {service.description && (
                      <p className="text-xs text-slate-500">
                        {service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {card.cardType === 'business' && (card.products?.length ?? 0) > 0 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                Products
              </h3>
              <div className="space-y-3">
                {card.products!.map((product, index) => (
                  <a
                    key={index}
                    href={product.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm font-medium text-slate-800 hover:underline"
                  >
                    {product.name}
                    {product.link && (
                      <span className="block text-xs text-slate-500 break-all">
                        {product.link}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 space-y-6">

            {/* Social Icons */}
            {socialEntries(card).length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Connect
                </h3>

                <div className="flex flex-wrap gap-3">
                  {socialEntries(card).map((entry) => (
                    <a
                      key={entry.key}
                      href={entry.value}
                      target="_blank"
                      rel="noreferrer"
                      title={entry.key}
                      className="flex h-10 w-10 items-center justify-center 
                        rounded-full border border-slate-300 
                        bg-white text-slate-700 
                        transition hover:bg-slate-100"
                    >
                      {socialIcons[entry.key]}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Save Contact */}
            <button onClick={() => handleSaveContact(card)} className="w-full rounded-xl bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              Save Contact
            </button>
          </div>

          {/* Footer */}
          <p className="mt-10 text-xs uppercase tracking-wide text-slate-400">
            Created {formatDate(card.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

/*CREATIVE  */
function CreativeTemplate({ card }: { card: Card }) {
  return (
    <div className="relative overflow-hidden rounded-3xl
      bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#eef2ff]
      text-slate-800 
      shadow-[0_30px_80px_-20px_rgba(2,6,23,0.15)]">

      {/* GLOW */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />

      {/* HERO */}
      <div className="relative px-6 pt-8 pb-10 md:p-10 md:pb-14">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200/40 via-violet-200/20 to-transparent" />

        <div className="relative flex flex-col items-start gap-4 text-left
                  md:flex-row md:items-start md:text-left md:gap-5">

          <Avatar
            src={card.cardType === 'business' ? card.logo : card.profileImage}
            fallback={
              card.cardType === 'business'
                ? card.businessName || 'B'
                : card.fullName || 'V'
            }
            square={card.cardType === 'business'}
          />

          <div className="pt-1 w-full md:max-w-[50%]">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
              {card.cardType === 'business'
                ? card.businessName || 'Business Name'
                : card.fullName || 'Full Name'}
            </h2>

            {card.cardType === 'personal' && card.role && (
              <p className="mt-1 text-sm text-slate-600">
                {card.role}
              </p>
            )}

            {card.company && (
              <p className="mt-0.5 text-sm font-semibold text-sky-600">
                {card.company}
              </p>
            )}

            {card.cardType === 'business' && card.tagline && (
              <p className="mt-1 text-sm italic text-slate-500">
                “{card.tagline}”
              </p>
            )}

            {card.bio && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {card.bio}
              </p>
            )}
          </div>
        </div>
      </div>


      {/* SOCIAL ICONS – RIGHT  */}
      {socialEntries(card).length > 0 && (
        <div className="absolute right-4 top-40 z-20 -translate-y-1/2">
          <div className="flex flex-col items-center gap-3 
                rounded-2xl 
                border border-slate-200 
                bg-gradient-to-b from-sky-100/80 via-white/80 to-violet-100/80
                p-3 
                backdrop-blur-md 
                shadow-md">

            {socialEntries(card).map((entry) => (
              <a
                key={entry.key}
                href={entry.value}
                target="_blank"
                rel="noreferrer"
                title={entry.key}
                className="group flex h-11 w-11 items-center justify-center 
                  rounded-xl 
                  bg-white 
                  text-slate-600
                  shadow-sm
                  transition-all 
                  hover:scale-110 
                  hover:bg-gradient-to-br hover:from-sky-400 hover:to-violet-400 
                  hover:text-white 
                  hover:shadow-lg"
              >
                {socialIcons[entry.key]}
              </a>
            ))}
          </div>
        </div>
      )}


      {/* BODY */}
      <div className="relative space-y-8 
        bg-gradient-to-b from-white to-slate-50 
        px-6 pb-8 pt-10">

        {/* SERVICES */}
        {card.cardType === 'business' && (card.services?.length ?? 0) > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
              Services
            </p>

            <div className="grid gap-4">
              {card.services!.map((service, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 
                    bg-white 
                    p-4 shadow-sm 
                    transition hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {service.name}
                  </p>
                  {service.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {service.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {card.cardType === 'business' && (card.products?.length ?? 0) > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
              Products
            </p>

            <div className="grid gap-4">
              {card.products!.map((product, index) => (
                <a
                  key={index}
                  href={product.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-slate-200 
                    bg-white 
                    p-4 shadow-sm 
                    transition hover:bg-sky-50 hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {product.name}
                  </p>
                  {product.link && (
                    <p className="mt-1 text-xs text-slate-500 break-all">
                      {product.link}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT */}
        <div>
          <p  className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
            Contact
          </p>

          <div className="grid gap-4">
            {contactItems(card)
              .filter((item) => item.value)
              .map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 
                    bg-white 
                    px-4 py-3 shadow-sm"
                >
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 break-all">
                    {item.value}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* CTA */}
        <button onClick={() => handleSaveContact(card)}
          className="mt-4 w-full rounded-xl 
            bg-sky-600 
            py-3.5 text-sm font-bold text-white 
            shadow-md transition-all 
            hover:bg-sky-700 hover:shadow-lg"
        >
          Save Contact
        </button>

        {/* FOOTER */}
        <p className="pt-3 text-center text-[11px] uppercase tracking-widest text-slate-400">
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

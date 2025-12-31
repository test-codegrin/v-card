'use client';

import { Card, CardTemplate } from '@/types/card';
import { formatDate } from '@/lib/utils';
import { generateVCard } from '@/lib/vcf'; 
import clsx from 'clsx';
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Twitter
} from 'lucide-react';
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
  const shape = square ? 'rounded-xl' : 'rounded-full';

  return (
    <div
      className={clsx(
        'relative h-40 w-40 overflow-hidden ring-2 ring-primary/30 shadow-card-hover',
        shape,
        src ? 'bg-slate-700' : 'bg-slate-700 flex items-center justify-center'
      )}
    >
      {src ? (
        <img
          src={src}
          alt={fallback}
          className={clsx(
            'h-full w-full',
            square
              ? 'object-contain p-4' 
              : 'object-cover'       
          )}
        />
      ) : (
        <span className="text-5xl font-semibold text-white">
          {fallback?.charAt(0)?.toUpperCase() ?? 'V'}
        </span>
      )}
    </div>
  );
}

const socialIcons: Record<string, JSX.Element> = {
  facebook: <Facebook className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />
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
      <div className="-mt-20 flex object-cover justify-center">
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
      <div className="relative space-y-2 px-6 pb-6 pt-4 text-center">
        {/* Name */}
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
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

      <div className="space-y-2 px-6 pb-6 pt-4 text-center">
        <h2 className="text-2xl font-semibold">
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
      <div className="relative space-y-2 px-6 pb-6 pt-4 text-center">
        {/* Name */}
        <h2 className="text-2xl font-semibold">
          {card.cardType === 'business'
            ? card.businessName || 'Business Name'
            : card.fullName || 'Full Name'}
        </h2>

        {/* Role / Tagline / Company */}
        <div className=" text-sm text-gray-600">
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

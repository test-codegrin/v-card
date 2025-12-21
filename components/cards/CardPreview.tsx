'use client';

import { Card } from '@/types/card';
import { formatDate } from '@/lib/utils';

type Props = {
  card: Card;
};

const contactItems = (card: Card) => [
  { label: 'Email', value: card.email },
  { label: 'Phone', value: card.phone },
  { label: 'Website', value: card.website },
  { label: 'Address', value: card.address }
];

function PersonalPreview({ card }: { card: Card }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-soft">
      <div className="flex items-center gap-4">
        {card.profileImage ? (
          <img src={card.profileImage} alt={card.fullName} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/30" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {card.fullName?.[0]?.toUpperCase() ?? 'V'}
          </div>
        )}
        <div>
          <h3 className="text-2xl font-semibold text-black">{card.fullName || 'Full Name'}</h3>
          <p className="text-sm text-gray-600">
            {card.role || 'Job Title'}
            {card.company ? ` · ${card.company}` : ''}
          </p>
        </div>
      </div>
      {card.bio && <p className="text-sm text-gray-700">{card.bio}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {contactItems(card)
          .filter((item) => item.value)
          .map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-800">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</span>
              <span className="font-medium text-black">{item.value}</span>
            </div>
          ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {card.socials?.linkedin && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {card.socials?.instagram && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        )}
        {card.socials?.youtube && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.youtube} target="_blank" rel="noreferrer">
            YouTube
          </a>
        )}
        {card.socials?.github && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {card.socials?.twitter && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.twitter} target="_blank" rel="noreferrer">
            Twitter
          </a>
        )}
      </div>
      <p className="text-xs uppercase tracking-wide text-gray-500">Created {formatDate(card.createdAt)}</p>
    </section>
  );
}

function BusinessPreview({ card }: { card: Card }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-soft">
      <div className="flex items-center gap-4">
        {card.logo ? (
          <img src={card.logo} alt={card.businessName} className="h-16 w-16 rounded-xl object-cover ring-2 ring-primary/30" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
            {card.businessName?.[0]?.toUpperCase() ?? 'B'}
          </div>
        )}
        <div>
          <h3 className="text-2xl font-semibold text-black">{card.businessName || 'Business Name'}</h3>
          <p className="text-sm text-gray-600">{card.tagline || card.bio || 'Your tagline here'}</p>
        </div>
      </div>
      {card.bio && <p className="text-sm text-gray-700">{card.bio}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {contactItems(card)
          .filter((item) => item.value)
          .map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-800">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</span>
              <span className="font-medium text-black">{item.value}</span>
            </div>
          ))}
      </div>

      {card.services && card.services.length > 0 && (
        <div className="rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-semibold text-black">Services</p>
          <ul className="mt-2 space-y-2 text-sm text-gray-800">
            {card.services.map((service, idx) => (
              <li key={`${service.name}-${idx}`}>
                <span className="font-semibold text-black">{service.name}</span>
                {service.description && <span className="text-gray-600"> — {service.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {card.products && card.products.length > 0 && (
        <div className="rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-semibold text-black">Products</p>
          <ul className="mt-2 space-y-2 text-sm text-primary">
            {card.products.map((product, idx) => (
              <li key={`${product.name}-${idx}`}>
                {product.link ? (
                  <a href={product.link} target="_blank" rel="noreferrer" className="font-semibold text-primary">
                    {product.name}
                  </a>
                ) : (
                  <span className="font-semibold text-black">{product.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {card.socials?.facebook && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}
        {card.socials?.linkedin && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {card.socials?.instagram && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        )}
        {card.socials?.youtube && (
          <a className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" href={card.socials.youtube} target="_blank" rel="noreferrer">
            YouTube
          </a>
        )}
      </div>

      <p className="text-xs uppercase tracking-wide text-gray-500">Created {formatDate(card.createdAt)}</p>
    </section>
  );
}

export default function CardPreview({ card }: Props) {
  const type = card.cardType ?? 'personal';
  if (type === 'business') {
    return <BusinessPreview card={card} />;
  }
  return <PersonalPreview card={card} />;
}

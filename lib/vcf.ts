import { Card } from '@/types/card';

const sanitize = (value?: string) => (value ? value.replace(/\n/g, '\\n') : '');

export function generateVCard(card: Card) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${sanitize(card.fullName)}`,
    `N:${sanitize(card.fullName)};;;;`,
    card.company ? `ORG:${sanitize(card.company)}` : null,
    card.role ? `TITLE:${sanitize(card.role)}` : null,
    card.phone ? `TEL;TYPE=CELL:${sanitize(card.phone)}` : null,
    card.email ? `EMAIL;TYPE=INTERNET:${sanitize(card.email)}` : null,
    card.website ? `URL:${sanitize(card.website)}` : null,
    card.address ? `ADR;TYPE=HOME:;;${sanitize(card.address)};;;;` : null,
    card.bio ? `NOTE:${sanitize(card.bio)}` : null,
    'END:VCARD'
  ].filter(Boolean);

  return lines.join('\n');
}

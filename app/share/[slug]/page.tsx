import type { Metadata } from 'next';
import ShareClient from './ShareClient';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `${params.slug} | Digital Card`,
    description: 'View and save this digital V-Card.'
  };
}

export default function SharePage({ params }: Props) {
  return <ShareClient slug={params.slug} />;
}

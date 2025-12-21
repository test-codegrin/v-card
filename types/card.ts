export type ContactLink = {
  label: string;
  url: string;
};

export type CardType = 'personal' | 'business';
export type CardTemplate = 'modern' | 'classic' | 'creative';

export type Service = { name: string; description?: string };
export type Product = { name: string; link?: string };

export type Card = {
  cardType: CardType;
  template?: CardTemplate;
  slug: string;
  ownerEmail: string;
  // Personal
  fullName?: string;
  role?: string;
  company?: string;
  // Business
  businessName?: string;
  tagline?: string;
  // Common
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  bio?: string;
  services?: Service[];
  products?: Product[];
  socials?: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
    twitter?: string;
    facebook?: string;
  };
  profileImage?: string; // base64 string for personal headshot
  logo?: string; // base64 string for business logo
  createdAt: string;
};

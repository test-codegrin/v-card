import { z } from 'zod';
import { CardType } from '@/types/card';

// ----- Shared helpers -----
// Converts empty strings to undefined so optional fields don’t fail validation.
const optionalString = () =>
  z.preprocess((val) => (typeof val === 'string' && val.trim() === '' ? undefined : val), z.string().optional());

const optionalUrl = () =>
  z.preprocess((val) => (typeof val === 'string' && val.trim() === '' ? undefined : val), z.string().url('Invalid URL').optional());

// Allow either URL or data URL for images.
const optionalImage = () =>
  z
    .preprocess((val) => (typeof val === 'string' && val.trim() === '' ? undefined : val), z.string())
    .optional()
    .refine(
      (val) => !val || /^data:image\/[a-zA-Z]+;base64,/.test(val) || /^https?:\/\/.+/i.test(val),
      'Provide a valid image URL or base64 data URL'
    );

// Shared phone rule: optional, but must be valid if present.
const phoneField = z
  .string()
  .regex(/^[+\d][\d\s-]{6,}$/, 'Use a valid phone number')
  .optional();

// ----- Auth schemas -----
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please use a valid email'),
  password: z
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
});

export const signupSchema = loginSchema
  .extend({
    name: z
      .string()
      .trim()
      .min(2, 'Name is required'),
    confirmPassword: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

// ----- Card schemas -----
const servicesSchema = z
  .array(
    z.object({
      title: z.string().min(1, 'Service title is required'),
      description: optionalString()
    })
  )
  .optional();

const productsSchema = z
  .array(
    z.object({
      title: z.string().min(1, 'Product title is required'),
      link: optionalUrl()
    })
  )
  .optional();

// Personal card validation
export const personalCardSchema = z.object({
  cardType: z.literal('personal'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please use a valid email'),
  phone: phoneField,
  jobTitle: optionalString(),
  company: optionalString(),
  website: optionalUrl(),
  location: optionalString(),
  bio: z
    .string()
    .max(200, 'Keep bio under 200 characters')
    .optional()
    .or(z.literal('')),
  social: z
    .object({
      linkedin: optionalUrl(),
      instagram: optionalUrl(),
      twitter: optionalUrl(),
      youtube: optionalUrl(),
      github: optionalUrl()
    })
    .partial()
    .optional(),
  profilePhoto: optionalImage()
});

// Business card validation
export const businessCardSchema = z.object({
  cardType: z.literal('business'),
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Please use a valid email'),
  phone: phoneField,
  tagline: optionalString(),
  website: optionalUrl(),
  address: optionalString(),
  services: servicesSchema,
  products: productsSchema,
  social: z
    .object({
      facebook: optionalUrl(),
      linkedin: optionalUrl(),
      instagram: optionalUrl(),
      youtube: optionalUrl()
    })
    .partial()
    .optional(),
  logo: optionalImage()
});

// Discriminated union used both client+server for create
export const cardCreateSchema = z.discriminatedUnion('cardType', [personalCardSchema, businessCardSchema]);

// Update schema: all fields optional; cardType optional string enum (no discriminator to avoid undefined conflicts).
export const cardUpdateSchema = z.object({
  cardType: z.enum(['personal', 'business']).optional(),
  fullName: optionalString(),
  businessName: optionalString(),
  email: z.string().email('Please use a valid email').optional(),
  phone: phoneField,
  jobTitle: optionalString(),
  role: optionalString(), // backward compatibility with existing field name
  company: optionalString(),
  tagline: optionalString(),
  website: optionalUrl(),
  location: optionalString(),
  address: optionalString(),
  bio: optionalString(),
  services: servicesSchema,
  products: productsSchema,
  social: z
    .object({
      facebook: optionalUrl(),
      linkedin: optionalUrl(),
      instagram: optionalUrl(),
      youtube: optionalUrl(),
      twitter: optionalUrl(),
      github: optionalUrl()
    })
    .partial()
    .optional(),
  socials: z.any().optional(), // backward compatibility with existing field name
  profilePhoto: optionalImage(),
  profileImage: optionalImage(), // backward compatibility
  logo: optionalImage()
});

export type CardFormValues = z.infer<typeof cardCreateSchema> & { cardType: CardType };

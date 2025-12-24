'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import CardPreview from '@/components/cards/CardPreview';
import TemplateSelector from '@/components/ui/TemplateSelector';
import { cardCreateSchema, CardFormValues } from '@/lib/validators';
import { useCardStore } from '@/store/cardStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/ToastProvider';

const defaultValues: CardFormValues = {
  cardType: 'personal',
  template: 'modern',
  fullName: '',
  role: '',
  company: '',
  businessName: '',
  tagline: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  bio: '',
  services: [],
  products: [],
 socials: {
  linkedin: '',
  instagram: '',
  youtube: '',
  github: '',
  twitter: '',
  facebook: ''
},
  profileImage: '',
  logo: ''
};

export default function NewCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillSlug = searchParams.get('prefill');

  const { createCard, getCard, fetchCards } = useCardStore();
  const authUser = useAuthStore((state) => state.user);
  const { showToast } = useToast();

  const hasPrefilled = useRef(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardCreateSchema),
    defaultValues,
    mode: 'onChange'
  });

  const values = watch();
  const cardType = useWatch({ control, name: 'cardType' });
  const template = useWatch({ control, name: 'template' });
  const err = errors as any;

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService
  } = useFieldArray({ control, name: 'services' });

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct
  } = useFieldArray({ control, name: 'products' });

  useEffect(() => {
    setUploadError(null);
  }, [values.profileImage, values.logo]);

  useEffect(() => {
    if (!prefillSlug || hasPrefilled.current) return;

    (async () => {
      const card = await getCard(prefillSlug);
      if (!card) return;

      hasPrefilled.current = true;

      setValue('cardType', card.cardType);
      setValue('template', card.template || 'modern');
      setValue('fullName', card.fullName || '');
      setValue('role', card.role || '');
      setValue('company', card.company || '');
      setValue('businessName', card.businessName || '');
      setValue('tagline', card.tagline || '');
      setValue('email', card.email || '');
      setValue('phone', card.phone || '');
      setValue('website', card.website || '');
      setValue('address', card.address || '');
      setValue('bio', card.bio || '');
      setValue('services', card.services?.length ? card.services : []);
      setValue('products', card.products?.length ? card.products : []);
      setValue('profileImage', card.profileImage || '');
      setValue('logo', card.logo || '');

      const socials = (card as any).social || (card as any).socials || {};
      setValue('social.linkedin', socials.linkedin || '');
      setValue('social.instagram', socials.instagram || '');
      setValue('social.youtube', socials.youtube || '');
      setValue('social.github', socials.github || '');
      setValue('social.twitter', socials.twitter || '');
      setValue('social.facebook', socials.facebook || '');
    })();
  }, [getCard, prefillSlug, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString() ?? '';
      const field = cardType === 'business' ? 'logo' : 'profileImage';
      setValue(field, base64, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (formValues: CardFormValues) => {
    try {
      if (!authUser?.email) {
        showToast({
          variant: 'error',
          title: 'Not signed in',
          message: 'Please log in to save your card.'
        });
        return;
      }

      const card = await createCard({
  ownerEmail: authUser.email,
  ...formValues,
  template: formValues.template || 'modern'
});


    

      await fetchCards();
      showToast({ variant: 'success', title: 'Saved', message: 'Your card has been saved.' });
      router.replace(`/cards/${card.slug}`);
    } catch (error: any) {
      showToast({
        variant: 'error',
        title: 'Save failed',
        message: error?.message || 'Could not save card.'
      });
    }
  };

 return (
  <div className="space-y-10">
    {/* HEADER */}
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="caption">Create</p>
        <h1 className="heading-2">New V-Card</h1>
        <p className="text-sm text-gray-600">
          Switch templates, keep your data, and preview changes live.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="ds-badge">Autosave ready</span>
        <span className="ds-badge">Live preview</span>
        <span className="ds-badge">QR ready</span>
      </div>
    </div>

    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="panel space-y-8 p-6 bg-white"
      >
        {/* TYPE + TEMPLATE */}
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
              Card Type
            </p>

            <div className="flex gap-3">
              {(['personal', 'business'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={clsx(
                    'flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition',
                    cardType === type
                      ? 'border-[#9f2b34] bg-[#9f2b34]/5 text-[#9f2b34]'
                      : 'border-black/10 bg-white hover:bg-black/5'
                  )}
                  onClick={() =>
                    setValue('cardType', type, {
                      shouldDirty: true,
                      shouldValidate: true
                    })
                  }
                >
                  {type === 'personal' ? 'Personal' : 'Business'}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('cardType')} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
              Template
            </p>
            <TemplateSelector
              value={template || 'modern'}
              onChange={(t) =>
                setValue('template', t, {
                  shouldDirty: true,
                  shouldValidate: true
                })
              }
            />
          </div>
        </div>

        {/* BASIC DETAILS */}
        <div className="grid gap-4 lg:grid-cols-2">
          {cardType === 'personal' ? (
            <>
              <Input tone="light" label="Full Name" {...register('fullName')} />
              <Input tone="light" label="Job Title" {...register('role')} />
              <Input tone="light" label="Company" {...register('company')} />
            </>
          ) : (
            <>
              <Input tone="light" label="Business Name" {...register('businessName')} />
              <Input tone="light" label="Tagline" {...register('tagline')} />
            </>
          )}

          <Input tone="light" label="Email" {...register('email')} />
          <Input tone="light" label="Phone" {...register('phone')} />
          <Input tone="light" label="Website" {...register('website')} />
          <Input tone="light" label="Address" {...register('address')} />

          <TextArea
            tone="light"
            label={cardType === 'business' ? 'About / Description' : 'Bio'}
            rows={3}
            {...register('bio')}
          />
        </div>

        {/* SOCIAL LINKS */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Social Links</p>

          <div className="grid gap-4 md:grid-cols-2">
            <Input tone="light" label="LinkedIn" {...register('social.linkedin')} />
            <Input tone="light" label="Instagram" {...register('social.instagram')} />
            <Input tone="light" label="YouTube" {...register('social.youtube')} />
            <Input tone="light" label="Twitter" {...register('social.twitter')} />
            <Input tone="light" label="GitHub" {...register('social.github')} />
            {cardType === 'business' && (
              <Input tone="light" label="Facebook" {...register('social.facebook')} />
            )}
          </div>
        </div>

        {/* SERVICES */}
        {cardType === 'business' && (
          <div className="space-y-4 rounded-xl border border-black/10 bg-black/5 p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Services</p>
                <p className="text-xs text-gray-600">What you offer</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => appendService({ name: '', description: '' })}
              >
                Add
              </Button>
            </div>

            {serviceFields.map((field, i) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-xl border border-black/10 bg-white p-3 sm:grid-cols-2"
              >
                <Input tone="light" label="Service Name" {...register(`services.${i}.name`)} />
                <Input tone="light" label="Description" {...register(`services.${i}.description`)} />

                <div className="sm:col-span-2 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeService(i)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCTS */}
        {cardType === 'business' && (
          <div className="space-y-4 rounded-xl border border-black/10 bg-black/5 p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">Products</p>
                <p className="text-xs text-gray-600">Key offerings</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => appendProduct({ name: '', link: '' })}
              >
                Add
              </Button>
            </div>

            {productFields.map((field, i) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-xl border border-black/10 bg-white p-3 sm:grid-cols-2"
              >
                <Input tone="light" label="Product Name" {...register(`products.${i}.name`)} />
                <Input tone="light" label="Product Link" {...register(`products.${i}.link`)} />

                <div className="sm:col-span-2 flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeProduct(i)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* IMAGE UPLOAD */}
        <div className="rounded-xl border border-black/10 bg-black/5 p-4">
          <label className="font-semibold">
            {cardType === 'business' ? 'Logo Upload' : 'Profile Image'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3"
          />
          {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
        </div>

        {/* SAVE */}
        <div className="flex justify-end">
          <Button type="submit" loading={isSubmitting}>
            Save Card
          </Button>
        </div>
      </form>

      {/* PREVIEW */}
      <div className="glass p-6 bg-white">
        <h3 className="text-lg font-semibold mb-3">Live Preview</h3>
        <CardPreview
          card={{
            cardType,
            template: values.template ?? 'modern',
            ownerEmail: authUser?.email || 'preview@example.com',
            fullName: values.fullName || 'Full Name',
            role: values.role || 'Job Title',
            businessName: values.businessName || 'Business Name',
            tagline: values.tagline,
            email: values.email,
            phone: values.phone,
            website: values.website,
            address: values.address,
            bio: values.bio,
            services: values.services,
            products: values.products,
            socials: values.social,
            profileImage: values.profileImage,
            logo: values.logo,
            slug: 'preview',
            createdAt: new Date().toISOString()
          }}
        />
      </div>
    </div>
  </div>
);

}

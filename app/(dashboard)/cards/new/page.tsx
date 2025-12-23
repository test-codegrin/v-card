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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="caption">Create</p>
          <h1 className="heading-2">New V-Card</h1>
          <p className="text-sm text-white/70">
            Switch templates, keep your data, and preview changes live.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="ds-badge">Autosave ready</span>
          <span className="ds-badge">Live preview</span>
          <span className="ds-badge">QR ready</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="panel space-y-6 p-6">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Card Type
              </p>
              <div className="flex gap-3">
                {(['personal', 'business'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={clsx(
                      'flex-1 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition',
                      cardType === type
                        ? 'border-primary/60 bg-primary/10 text-white shadow-card-hover'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
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
              <input type="hidden" {...register('cardType')} value={cardType} />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                Template
              </p>
              <TemplateSelector
                value={template || 'modern'}
                onChange={(next) =>
                  setValue('template', next, {
                    shouldDirty: true,
                    shouldValidate: true
                  })
                }
              />
            </div>
          </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
  {cardType === 'personal' ? (
    <>
      <Input
        tone="dark"
        label="Full Name"
        placeholder="Alex Doe"
        error={err.fullName?.message}
        {...register('fullName')}
      />

      <Input
        tone="dark"
        label="Job Title"
        placeholder="Product Designer"
        error={err.role?.message}
        {...register('role')}
      />

      <Input
        tone="dark"
        label="Company"
        placeholder="Acme Inc"
        error={err.company?.message}
        {...register('company')}
      />
    </>
  ) : (
    <>
      <Input
        tone="dark"
        label="Business Name"
        placeholder="Acme Studio"
        error={err.businessName?.message}
        {...register('businessName')}
      />

      <Input
        tone="dark"
        label="Business Tagline / About"
        placeholder="We build great products"
        error={err.tagline?.message}
        {...register('tagline')}
      />
    </>
  )}

  <Input
    tone="dark"
    label="Email"
    placeholder="you@company.com"
    type="email"
    error={err.email?.message}
    {...register('email')}
  />

  <Input
    tone="dark"
    label="Phone"
    placeholder="+1 555 123 4567"
    error={err.phone?.message}
    {...register('phone')}
  />

  <Input
    tone="dark"
    label="Website"
    placeholder="https://example.com"
    error={err.website?.message}
    {...register('website')}
  />

  <Input
    tone="dark"
    label="Location / Address"
    placeholder="City, Country"
    error={err.address?.message}
    {...register('address')}
  />

  <TextArea
    tone="dark"
    label={cardType === 'business' ? 'About / Description' : 'Bio'}
    rows={3}
    maxLength={200}
    placeholder={
      cardType === 'business'
        ? 'What your business does'
        : 'Tell people what you do in under 200 characters.'
    }
    error={err.bio?.message}
    {...register('bio')}
  />
</div>

<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
  {cardType === 'business' ? (
    <>
      <Input
        tone="dark"
        label="Facebook"
        placeholder="https://facebook.com/yourpage"
        error={err.social?.facebook?.message}
        {...register('social.facebook')}
      />

      <Input
        tone="dark"
        label="LinkedIn"
        placeholder="https://linkedin.com/company/you"
        error={err.social?.linkedin?.message}
        {...register('social.linkedin')}
      />

      <Input
        tone="dark"
        label="Instagram"
        placeholder="https://instagram.com/you"
        error={err.social?.instagram?.message}
        {...register('social.instagram')}
      />

      <Input
        tone="dark"
        label="YouTube"
        placeholder="https://youtube.com/@you"
        error={err.social?.youtube?.message}
        {...register('social.youtube')}
      />
    </>
  ) : (
    <>
      <Input
        tone="dark"
        label="LinkedIn"
        placeholder="https://linkedin.com/in/you"
        error={err.social?.linkedin?.message}
        {...register('social.linkedin')}
      />

      <Input
        tone="dark"
        label="Instagram"
        placeholder="https://instagram.com/you"
        error={err.social?.instagram?.message}
        {...register('social.instagram')}
      />

      <Input
        tone="dark"
        label="YouTube"
        placeholder="https://youtube.com/@you"
        error={err.social?.youtube?.message}
        {...register('social.youtube')}
      />

      <Input
        tone="dark"
        label="Twitter"
        placeholder="https://twitter.com/you"
        error={err.social?.twitter?.message}
        {...register('social.twitter')}
      />

      <Input
        tone="dark"
        label="GitHub"
        placeholder="https://github.com/you"
        error={err.social?.github?.message}
        {...register('social.github')}
      />
    </>
  )}
</div>

{cardType === 'business' && (
  <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-white">Services</p>
        <p className="text-xs text-white/60">Add what you offer</p>
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

    <div className="space-y-3">
      {serviceFields.map((field, index) => (
        <div
          key={field.id}
          className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-2"
        >
          <Input
            tone="dark"
            label="Service name"
            error={err.services?.[index]?.name?.message}
            {...register(`services.${index}.name` as const)}
          />

          <Input
            tone="dark"
            label="Short description"
            error={err.services?.[index]?.description?.message}
            {...register(`services.${index}.description` as const)}
          />

          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => removeService(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{cardType === 'business' && (
  <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-white">Products</p>
        <p className="text-xs text-white/60">Add key products with links</p>
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

    <div className="space-y-3">
      {productFields.map((field, index) => (
        <div
          key={field.id}
          className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-2"
        >
          <Input
            tone="dark"
            label="Product name"
            error={err.products?.[index]?.name?.message}
            {...register(`products.${index}.name` as const)}
          />

          <Input
            tone="dark"
            label="Product link"
            placeholder="https://example.com/product"
            error={err.products?.[index]?.link?.message}
            {...register(`products.${index}.link` as const)}
          />

          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => removeProduct(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

<div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
  <label className="text-sm font-semibold text-white">
    {cardType === 'business' ? 'Logo upload' : 'Profile image'}
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="block w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white
      file:mr-3 file:cursor-pointer file:rounded-md file:border-0
      file:bg-primary file:px-3 file:py-2 file:font-semibold file:text-white"
  />

  {uploadError && (
    <p className="text-xs text-red-400">{uploadError}</p>
  )}
</div>

<div className="flex justify-end">
  <Button
    type="submit"
    loading={isSubmitting}
    onClick={() => console.log('[NewCardPage] Save button clicked')}
  >
    Save Card
  </Button>
</div>
        </form>

        <div className="glass p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Live preview</h3>
            <span className="text-xs uppercase tracking-wide text-white/60">
              Template: {template || 'modern'}
            </span>
          </div>

          <div className="mt-4">
            <CardPreview
              card={{
                cardType,
                template: values.template ?? 'modern',
                ownerEmail: authUser?.email || 'preview@example.com',
                fullName: values.fullName || 'Full Name',
                role: values.role || 'Job Title',
                company: values.company,
                businessName: values.businessName || 'Business Name',
                tagline: values.tagline,
                email: values.email || 'you@company.com',
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
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import CardPreview from '@/components/cards/CardPreview';
import { cardCreateSchema, CardFormValues } from '@/lib/validators';
import { useCardStore } from '@/store/cardStore';
import { useAuthStore } from '@/store/authStore';

const defaultValues: CardFormValues = {
  cardType: 'personal',
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
      if (card) {
        hasPrefilled.current = true;
        setValue('cardType', card.cardType);
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
        setValue('socials.linkedin', card.socials?.linkedin || '');
        setValue('socials.instagram', card.socials?.instagram || '');
        setValue('socials.youtube', card.socials?.youtube || '');
        setValue('socials.github', card.socials?.github || '');
        setValue('socials.twitter', card.socials?.twitter || '');
        setValue('socials.facebook', card.socials?.facebook || '');
      }
    })();
  }, [getCard, prefillSlug, setValue]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const targetField = cardType === 'business' ? 'logo' : 'profileImage';
      setValue(targetField as 'logo' | 'profileImage', base64, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (formValues: CardFormValues) => {
    if (!authUser?.email) return;
    const card = await createCard({
      cardType: formValues.cardType,
      ownerEmail: authUser.email,
      ...formValues,
      socials: {
        linkedin: formValues.socials?.linkedin || undefined,
        instagram: formValues.socials?.instagram || undefined,
        youtube: formValues.socials?.youtube || undefined,
        github: formValues.socials?.github || undefined,
        twitter: formValues.socials?.twitter || undefined,
        facebook: formValues.socials?.facebook || undefined
      }
    });
    await fetchCards();
    router.replace(`/cards/${card.slug}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-primary">Create</p>
        <h1 className="text-3xl font-semibold text-white">New V-Card</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-gray-200 bg-white p-6 text-black shadow-soft"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-black">Card Type</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm">
                  <input type="radio" value="personal" checked={cardType === 'personal'} {...register('cardType')} />
                  <span>Personal</span>
                </label>
                <label className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm">
                  <input type="radio" value="business" checked={cardType === 'business'} {...register('cardType')} />
                  <span>Business</span>
                </label>
              </div>
            </div>

            {cardType === 'personal' ? (
              <>
                <Input label="Full Name" placeholder="Alex Doe" error={errors.fullName?.message} {...register('fullName')} />
                <Input label="Job Title" placeholder="Product Designer" error={errors.role?.message} {...register('role')} />
                <Input label="Company" placeholder="Acme Inc" error={errors.company?.message} {...register('company')} />
              </>
            ) : (
              <>
                <Input
                  label="Business Name"
                  placeholder="Acme Studio"
                  error={errors.businessName?.message}
                  {...register('businessName')}
                />
                <Input
                  label="Business Tagline / About"
                  placeholder="We build great products"
                  error={errors.tagline?.message}
                  {...register('tagline')}
                />
              </>
            )}

            <Input label="Email" placeholder="you@company.com" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Phone" placeholder="+1 555 123 4567" error={errors.phone?.message} {...register('phone')} />
            <Input label="Website" placeholder="https://example.com" error={errors.website?.message} {...register('website')} />
            <Input label="Location / Address" placeholder="City, Country" error={errors.address?.message} {...register('address')} />
            <TextArea
              label={cardType === 'business' ? 'About / Description' : 'Bio'}
              rows={3}
              maxLength={200}
              placeholder={cardType === 'business' ? 'What your business does' : 'Tell people what you do in under 200 characters.'}
              error={errors.bio?.message}
              {...register('bio')}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cardType === 'business' ? (
                <>
                  <Input
                    label="Facebook"
                    placeholder="https://facebook.com/yourpage"
                    error={errors.socials?.facebook?.message}
                    {...register('socials.facebook')}
                  />
                  <Input
                    label="LinkedIn"
                    placeholder="https://linkedin.com/company/you"
                    error={errors.socials?.linkedin?.message}
                    {...register('socials.linkedin')}
                  />
                  <Input
                    label="Instagram"
                    placeholder="https://instagram.com/you"
                    error={errors.socials?.instagram?.message}
                    {...register('socials.instagram')}
                  />
                  <Input
                    label="YouTube"
                    placeholder="https://youtube.com/@you"
                    error={errors.socials?.youtube?.message}
                    {...register('socials.youtube')}
                  />
                </>
              ) : (
                <>
                  <Input
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/you"
                    error={errors.socials?.linkedin?.message}
                    {...register('socials.linkedin')}
                  />
                  <Input
                    label="Instagram"
                    placeholder="https://instagram.com/you"
                    error={errors.socials?.instagram?.message}
                    {...register('socials.instagram')}
                  />
                  <Input
                    label="YouTube"
                    placeholder="https://youtube.com/@you"
                    error={errors.socials?.youtube?.message}
                    {...register('socials.youtube')}
                  />
                  <Input
                    label="Twitter"
                    placeholder="https://twitter.com/you"
                    error={errors.socials?.twitter?.message}
                    {...register('socials.twitter')}
                  />
                  <Input
                    label="GitHub"
                    placeholder="https://github.com/you"
                    error={errors.socials?.github?.message}
                    {...register('socials.github')}
                  />
                </>
              )}
            </div>

            {cardType === 'business' && (
              <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black">Services</p>
                    <p className="text-xs text-gray-500">Add what you offer</p>
                  </div>
                  <Button type="button" size="sm" variant="ghost" onClick={() => appendService({ name: '', description: '' })}>
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {serviceFields.map((field, index) => (
                    <div key={field.id} className="grid gap-2 rounded-lg border border-gray-100 p-3 sm:grid-cols-2">
                      <Input
                        label="Service name"
                        error={errors.services?.[index]?.name?.message}
                        {...register(`services.${index}.name` as const)}
                      />
                      <Input
                        label="Short description"
                        error={errors.services?.[index]?.description?.message}
                        {...register(`services.${index}.description` as const)}
                      />
                      <div className="sm:col-span-2 flex justify-end">
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeService(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cardType === 'business' && (
              <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-black">Products</p>
                    <p className="text-xs text-gray-500">Add key products with links</p>
                  </div>
                  <Button type="button" size="sm" variant="ghost" onClick={() => appendProduct({ name: '', link: '' })}>
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {productFields.map((field, index) => (
                    <div key={field.id} className="grid gap-2 rounded-lg border border-gray-100 p-3 sm:grid-cols-2">
                      <Input
                        label="Product name"
                        error={errors.products?.[index]?.name?.message}
                        {...register(`products.${index}.name` as const)}
                      />
                      <Input
                        label="Product link"
                        placeholder="https://example.com/product"
                        error={errors.products?.[index]?.link?.message}
                        {...register(`products.${index}.link` as const)}
                      />
                      <div className="sm:col-span-2 flex justify-end">
                        <Button type="button" size="sm" variant="ghost" onClick={() => removeProduct(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-black">{cardType === 'business' ? 'Logo upload' : 'Profile image'}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-black file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:font-semibold file:text-white"
              />
              {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Save Card
            </Button>
          </div>
        </form>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-black">Live preview</h3>
          <CardPreview
            card={{
              cardType,
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
              socials: values.socials,
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

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { cardSchema, CardFormValues } from '@/lib/validators';

type Props = {
  defaultValues?: Partial<CardFormValues>;
  onSubmit: (values: CardFormValues) => Promise<void> | void;
  submitLabel?: string;
};

export default function CardForm({ defaultValues, onSubmit, submitLabel = 'Save card' }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-surface flex flex-col gap-6 rounded-2xl p-6 shadow-soft"
    >
      <div>
        <h2 className="text-xl font-semibold text-black">Card details</h2>
        <p className="text-sm text-gray-600">Fill out your details to generate a polished V-Card.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Full name" placeholder="Alex Doe" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Role / Title" placeholder="Product Lead" error={errors.role?.message} {...register('role')} />
        <Input label="Company" placeholder="Acme Inc" error={errors.company?.message} {...register('company')} />
        <Input
          label="Email"
          placeholder="you@company.com"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input label="Phone" placeholder="+1 (555) 123-4567" error={errors.phone?.message} {...register('phone')} />
        <Input
          label="Website"
          placeholder="https://example.com"
          error={errors.website?.message}
          {...register('website')}
        />
        <Input label="Address" placeholder="City, Country" error={errors.address?.message} {...register('address')} />
      </div>
      <TextArea
        label="Short bio"
        placeholder="A concise note that makes your card memorable."
        rows={4}
        error={errors.bio?.message}
        {...register('bio')}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          label="GitHub"
          placeholder="https://github.com/you"
          error={errors.socials?.github?.message}
          {...register('socials.github')}
        />
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { signupSchema } from '@/lib/validators';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/ToastProvider';

type SignupValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const onSubmit = async (values: SignupValues) => {
    try {
      await signup(values);
      showToast({ variant: 'success', title: 'Account created', message: 'You are signed in.' });
      router.replace('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create account right now.';
      showToast({ variant: 'error', title: 'Signup failed', message });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-4">
        <p className="caption">Join us</p>
        <h1 className="heading-2">Create your account and launch your card in minutes.</h1>
        <p className="text-sm text-white/70">Sign-up flow mirrors the login styling so the product feels cohesive.</p>
        <div className="flex flex-wrap gap-2">
          <span className="ds-badge">Onboarding</span>
          <span className="ds-badge">Guided</span>
        </div>
      </div>

      <div className="panel space-y-6 p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Create account</h2>
          <p className="text-sm text-white/70">Set up your profile to start generating V-Cards.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input tone="dark" label="Name" placeholder="Casey Jordan" error={errors.name?.message} {...register('name')} />
          <Input tone="dark" label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
          <Input
            tone="dark"
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            tone="dark"
            label="Confirm password"
            type="password"
            placeholder="Re-enter password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            Create account
          </Button>
        </form>
        <p className="text-sm text-white/70">
          Already have an account?{' '}
          <Link className="text-primary underline" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

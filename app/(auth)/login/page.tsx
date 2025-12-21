'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { loginSchema } from '@/lib/validators';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/ToastProvider';

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values);
      showToast({ variant: 'success', title: 'Welcome back', message: 'Signed in successfully.' });
      router.replace('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
      showToast({ variant: 'error', title: 'Login failed', message });
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-10 text-black shadow-soft">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Welcome back</p>
        <h1 className="text-3xl font-semibold">Log in to your workspace</h1>
        <p className="text-sm text-gray-600">Access your dashboard to create and share V-Cards.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">
          Continue
        </Button>
      </form>
      <p className="text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link className="text-primary underline" href="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}

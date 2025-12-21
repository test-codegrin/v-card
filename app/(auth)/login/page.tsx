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
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-4">
        <p className="caption">Welcome back</p>
        <h1 className="heading-2">Sign in to your V-Card workspace.</h1>
        <p className="text-sm text-white/70">Premium form styling with live validation keeps the auth flow feeling product-ready.</p>
        <div className="flex flex-wrap gap-2">
          <span className="ds-badge">Secure</span>
          <span className="ds-badge">Instant access</span>
        </div>
      </div>

      <div className="panel space-y-6 p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Log in</h2>
          <p className="text-sm text-white/70">Access your dashboard to create and share V-Cards.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input tone="dark" label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
          <Input
            tone="dark"
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
        <p className="text-sm text-white/70">
          Don&apos;t have an account?{' '}
          <Link className="text-primary underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

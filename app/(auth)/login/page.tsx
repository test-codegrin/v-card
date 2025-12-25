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
      showToast({
        variant: 'success',
        title: 'Welcome back',
        message: 'Signed in successfully.'
      });
      router.replace('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.';
      showToast({
        variant: 'error',
        title: 'Login failed',
        message
      });
    }
  };

  return (
    <div className="grid gap-10 lg:py-48 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      {/* LEFT CONTENT */}
      <div className="space-y-4">
        <p className="text-lg uppercase tracking-widest text-[#9f2b34]">
          Welcome back
        </p>

        <h1 className="text-5xl font-semibold leading-tight text-black">
          Sign in to your V-Card workspace
        </h1>

        <p className="text-md text-gray-600">
          Secure, fast access to manage and share your digital cards.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="ds-badge">
            Secure
          </span>
          <span className="ds-badge">
            Instant access
          </span>
        </div>
      </div>

      {/* LOGIN PANEL */}
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-[0_25px_60px_-20px_rgba(159,43,52,0.35)]">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-semibold text-black">
            Log in
          </h2>
          <p className="text-sm text-gray-600">
            Access your dashboard and manage V-Cards.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            tone="light"
            label="Email"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            tone="light"
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            variant="primary"
            className="w-full"
          >
            Continue
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            className="font-semibold text-[#9f2b34] underline underline-offset-4 hover:text-[#7a1f27]"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, loading, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      fetchMe();
    }
  }, [fetchMe, initialized]);

  useEffect(() => {
    if (initialized && user) {
      router.replace('/dashboard');
    }
  }, [initialized, user, router]);

  if (!initialized || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/70">
        Checking your session...
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}

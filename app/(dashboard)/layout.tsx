'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, loading, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      fetchMe();
    }
  }, [fetchMe, initialized]);

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.replace('/login');
    }
  }, [initialized, loading, user, router]);

  if (!initialized || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/70">
        Preparing your workspace...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

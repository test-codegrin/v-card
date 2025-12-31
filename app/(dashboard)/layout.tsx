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
       <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        {/* spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#9f2b34]/30 border-t-[#9f2b34]" />

        <p className="text-sm font-medium text-[#9f2b34]">
          Preparing your workspace..
        </p>

        
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

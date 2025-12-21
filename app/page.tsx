'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useMemo } from 'react';

export default function HomePage() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const primaryCta = useMemo(() => (isAuthenticated ? '/dashboard' : '/signup'), [isAuthenticated]);
  const secondaryCta = useMemo(() => (isAuthenticated ? '/cards/new' : '/login'), [isAuthenticated]);

  return (
    <div className="flex flex-col gap-10">
      <section className="glass-panel relative overflow-hidden rounded-2xl p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-white/5" />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Modern networking</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Generate and share sleek digital V-Cards in seconds.
            </h1>
            <p className="text-lg text-white/80">
              Craft on-brand digital business cards, attach QR codes, and share instantly. All client-side for now—ready
              for backend hooks when you are.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={primaryCta}>
                <Button variant="primary" size="md">
                  {isAuthenticated ? 'Go to dashboard' : 'Start free'}
                </Button>
              </Link>
              <Link href={secondaryCta}>
                <Button variant="ghost" size="md">
                  {isAuthenticated ? 'Create new card' : 'Log in'}
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="rounded-full bg-white/10 px-3 py-1">Tailwind + App Router</span>
              <span className="rounded-full bg-white/10 px-3 py-1">QR ready</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Backend-ready</span>
            </div>
          </div>
          <div className="relative">
            <div className="card-surface rotate-1 overflow-hidden rounded-2xl p-6 shadow-soft">
              <p className="text-xs uppercase text-gray-500">Preview</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  V
                </div>
                <div>
                  <p className="text-lg font-semibold text-black">Taylor Reed</p>
                  <p className="text-sm text-gray-600">Product Designer · Atlas Studio</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-800">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase text-gray-500">Email</p>
                  <p className="font-medium">taylor@atlas.studio</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase text-gray-500">Phone</p>
                  <p className="font-medium">+1 (555) 010-0200</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase text-gray-500">Website</p>
                  <p className="font-medium">atlas.studio</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase text-gray-500">Links</p>
                  <p className="font-medium text-primary">LinkedIn · Portfolio</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <div className="rounded-xl bg-gray-100 p-4">
                  <div className="h-28 w-28 rounded bg-primary/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'App Router ready',
            body: 'Next.js 14 with shared layouts, route protection, and client-only guards.'
          },
          { title: 'Instant QR', body: 'Generate QR codes for every share link with crisp contrast.' },
          { title: 'Local-first', body: 'Persist auth and cards in localStorage via Zustand until APIs land.' }
        ].map((feature) => (
          <div key={feature.title} className="glass-panel rounded-xl p-5">
            <p className="text-sm uppercase tracking-wide text-primary">{feature.title}</p>
            <p className="mt-2 text-sm text-white/80">{feature.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

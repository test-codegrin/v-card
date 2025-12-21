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
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="caption">Modern networking</p>
          <h1 className="heading-1">Premium digital V-Cards that feel like a product launch.</h1>
          <p className="text-lg text-white/80">
            Craft on-brand cards, preview in real time, and share with QR or download-ready vCards. Built with Next.js + Tailwind for a fast, app-like experience.
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
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="ds-badge">App Router</span>
            <span className="ds-badge">Live preview</span>
            <span className="ds-badge">QR + vCard</span>
          </div>
        </div>
        <div className="relative">
          <div className="glass relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white/5 to-transparent" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/70">Preview</p>
                  <h3 className="text-xl font-semibold text-white">Atlas Studio</h3>
                </div>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">Ready to share</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: 'Email', value: 'taylor@atlas.studio' },
                  { label: 'Phone', value: '+1 (555) 010-0200' },
                  { label: 'Website', value: 'atlas.studio' },
                  { label: 'Location', value: 'Remote • Worldwide' }
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-white/60">{item.label}</p>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {['LinkedIn', 'Instagram', 'Portfolio'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -left-8 -bottom-8 hidden h-32 w-32 rounded-full bg-primary/20 blur-3xl md:block" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'App Router ready',
            body: 'Layouts, guards, and streaming-friendly components built for Next.js 14.'
          },
          { title: 'Instant QR', body: 'Generate QR codes and download PNGs without leaving the page.' },
          { title: 'Local-first', body: 'Auth + cards persist locally via Zustand until your APIs land.' }
        ].map((feature) => (
          <div key={feature.title} className="glass p-5">
            <p className="text-sm uppercase tracking-wide text-primary">{feature.title}</p>
            <p className="mt-2 text-sm text-white/80">{feature.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Button from './Button';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cards/new', label: 'Create' },
  { href: '/share/demo', label: 'Share' }
];

// Navbar is now part of the UI library so any layout can reuse it without duplicating auth logic.
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, fetchMe, initialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!initialized) {
      fetchMe();
    }
  }, [fetchMe, initialized]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-secondary/70 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-primary shadow-card-hover">V</span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm uppercase tracking-[0.22em] text-primary">V-Card</span>
            <span className="text-base font-semibold text-white">Identity Studio</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-medium text-white/80 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'rounded-full px-3 py-2 transition hover:text-white',
                pathname?.startsWith(link.href) ? 'bg-white/10 text-white' : 'text-white/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && initialized && user ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 sm:flex">
                <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">{user.name ?? 'User'}</span>
                <span className="text-white/60">{user.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/cards/new')}>
                New Card
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/signup')}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Button from '../ui/Button';
import clsx from 'clsx';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cards/new', label: 'Create' },
  { href: '/share/demo', label: 'Share' }
];

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
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-soft">
            V
          </div>
          <span className="tracking-tight">V-Card Generator</span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-medium text-white/80 sm:flex">
          {links.map((link) => (
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
              <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-white sm:flex">
                <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">{user.name ?? 'User'}</span>
                <span className="text-white/60">{user.email}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
              <Button variant="primary" onClick={() => router.push('/cards/new')}>
                New Card
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Log in
              </Button>
              <Button variant="primary" onClick={() => router.push('/signup')}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, fetchMe, initialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!initialized) fetchMe();
  }, [fetchMe, initialized]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
      <div className="container flex items-center justify-between md:px:4 lg:px-12 py-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 font-semibold text-white">
          <img src="/images/PROLIFT-Dark-Apparel-Embroidery-Logo.png" alt="" className='w-[200px]' />
        </Link>

        {/* DESKTOP + TABLET NAV */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-white/80">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'rounded-full px-4 py-2 transition hover:text-white',
                pathname?.startsWith(link.href)
                  ? 'bg-white/10 text-white'
                  : 'text-white/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {mounted && initialized && user ? (
            <>
              {/* Hide email on tablets */}
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white px-2 py-1 text-xs text-white/80">
                <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">
                  {user.name ?? 'User'}
                </span>
                <span className="text-black font-medium">{user.email}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/cards/new')}
                className="hidden sm:inline-flex"
              >
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

          {/* MOBILE / TABLET MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE / TABLET DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-secondary/90 backdrop-blur">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'rounded-xl px-4 py-3 text-sm transition',
                  pathname?.startsWith(link.href)
                    ? 'bg-white/10 text-white'
                    : 'text-white/70'
                )}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/cards/new');
                }}
              >
                New Card
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

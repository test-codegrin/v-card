'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Button from './Button';
import { useAuthStore } from '@/store/authStore';
import { useAdminAuthStore } from '@/store/adminAuthStore';

const userNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cards/new', label: 'Create' },
];

const adminNavLinks = [
  { href: '/admin/dashboard', label: 'Admin Dashboard' }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // User auth
  const { user, logout: userLogout, fetchMe, initialized } = useAuthStore();

  // Admin auth
  const {
    admin,
    logout: adminLogout,
    fetchAdminMe,
    initialized: adminInitialized
  } = useAdminAuthStore();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!initialized) fetchMe();
    if (!adminInitialized) fetchAdminMe();
  }, [fetchMe, initialized, fetchAdminMe, adminInitialized]);

  const handleUserLogout = () => {
    userLogout();
    router.push('/login');
  };

  const handleAdminLogout = () => {
    adminLogout();
    router.push('/admin');
  };

  const isAdmin = mounted && adminInitialized && !!admin;
  const isUser = mounted && initialized && !!user;

  const navLinks = isAdmin ? adminNavLinks : userNavLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
      <div className="container flex items-center justify-between py-4 md:px-8 lg:px-12">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 font-semibold text-white">
          <img
            src="/images/PROLIFT-Dark-Apparel-Embroidery-Logo.png"
            alt="Logo"
            className="w-[200px]"
          />
        </Link>

        {/* DESKTOP NAV */}
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

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-2">
          {isAdmin ? (
            <>
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white px-2 py-1 text-xs">
                <span className="rounded-full bg-red-100 px-2 py-1 text-red-700">
                  Admin
                </span>
                <span className="font-medium text-black">
                  {admin.admin_name}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleAdminLogout}>
                Logout
              </Button>
            </>
          ) : isUser ? (
            <>
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white px-2 py-1 text-xs">
                <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">
                  {user.name ?? 'User'}
                </span>
                <span className="font-medium text-black">{user.email}</span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleUserLogout}>
                Logout
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/cards/new')}
              >
                New Card
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/login')}
              >
                Log in
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/signup')}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-secondary/90 backdrop-blur">
          <div className="flex flex-col gap-2 p-4">
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

            {isAdmin ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMenuOpen(false);
                  handleAdminLogout();
                }}
              >
                Logout
              </Button>
            ) : isUser ? (
              <>
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

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMenuOpen(false);
                    handleUserLogout();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/login');
                  }}
                >
                  Log in
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/signup');
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-hero-radial">
        <div className="container mx-auto w-full max-w-6xl px-6 py-10 lg:max-w-7xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

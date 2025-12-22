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
        <div className="container w-full max-w-8xl px-13 py-10 lg:max-w-8xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

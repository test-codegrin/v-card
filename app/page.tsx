'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useMemo, useState } from 'react';

export default function HomePage() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  const primaryCta = useMemo(
    () => (isAuthenticated ? '/dashboard' : '/signup'),
    [isAuthenticated]
  );
  const secondaryCta = useMemo(
    () => (isAuthenticated ? '/cards/new' : '/login'),
    [isAuthenticated]
  );

  /* CONTACT FORM STATE */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    setName('');
    setEmail('');
    setMessage('');
    alert('Message sent successfully!');
  };

  return (
    <div className="space-y-24">
      {/*    HERO    */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <p className="text-[#9f2b34] text-xl caption">
            Modern networking
          </p>

          <h1 className="text-3xl md:text-6xl">
            Premium digital V-Cards that feel like a product launch.
          </h1>

          <p className="text-base md:text-lg text-gray-700">
            Craft on-brand cards, preview in real time, and share with QR or
            download-ready vCards. Built with Next.js + Tailwind for a fast,
            app-like experience.
          </p>

          <div className="flex flex-wrap gap-3">
            {isAuthenticated && (
              <Link href={primaryCta}>
                <Button variant="primary" size="md">
                  Go to dashboard
                </Button>
              </Link>
            )}

            <Link href={secondaryCta}>
              <Button variant="primary" size="md">
                {isAuthenticated ? 'Create new card' : 'Log in'}
              </Button>
            </Link>
          </div>
        </div>

        {/* PREVIEW CARD */}
        <div className="relative">
          <div className="glass relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-primary" />

            <div className="relative space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs bg-white text-[#9f2b34] px-2 py-0.5 w-[70px] rounded-full uppercase tracking-wide font-semibold">
                    Preview
                  </p>
                  <h3 className="text-xl font-semibold pt-1 text-white">
                    Atlas Studio
                  </h3>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#9f2b34]">
                  Ready to share
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: 'Email', value: 'taylor@atlas.studio' },
                  { label: 'Phone', value: '+1 (555) 010-0200' },
                  { label: 'Website', value: 'atlas.studio' },
                  { label: 'Location', value: 'Remote • Worldwide' }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2"
                  >
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {['LinkedIn', 'Instagram', 'Portfolio'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -left-8 -bottom-8 hidden h-32 w-32 rounded-full bg-[#9f2b34]/20 blur-3xl md:block" />
        </div>
      </section>

      {/*    VIDEO SECTION    */}
      <section className="space-y-8 text-center">
        <div className="space-y-3">
          <p className="text-[#9f2b34] uppercase tracking-widest">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold">
            Create your V-Card in minutes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch how easy it is to design, preview, and share your digital
            V-Card with just a few clicks.
          </p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-black/10 shadow-[0_25px_60px_-20px_rgba(159,43,52,0.35)]">
          <video
            src="/video/v-card-video.mp4"
            controls
            muted
            playsInline
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/*    CONTACT US    */}
      {/* <section className="lg:flex justify-between gap-14 items-center"> */}
      {/* Desktop form */}
      {/* <form
          onSubmit={handleSubmit}
          className="lg:block hidden w-[880px] rounded-2xl border border-black/10 bg-white p-8 shadow-[0_25px_60px_-20px_rgba(159,43,52,0.35)] space-y-4"
        >
          <FormFields
            name={name}
            email={email}
            message={message}
            setName={setName}
            setEmail={setEmail}
            setMessage={setMessage}
          />
          <Button variant="primary" className="w-full">
            Send Message
          </Button>
        </form> */}

      {/* Text
        <div className="space-y-4">
          <p className="text-base caption ">
            Contact us
          </p>
          <h2 className="text-4xl font-semibold">
            Let’s talk about your digital identity
          </h2>
          <p className="text-gray-600">
            Have a question, feature request, or partnership idea?
            Drop us a message and we’ll get back to you shortly.
          </p>
        </div> */}

      {/* Mobile form */}
      {/* <form
          onSubmit={handleSubmit}
          className="lg:hidden block mt-5 rounded-2xl border border-black/10 bg-white p-8 shadow-[0_25px_60px_-20px_rgba(159,43,52,0.35)] space-y-4"
        >
          <FormFields
            name={name}
            email={email}
            message={message}
            setName={setName}
            setEmail={setEmail}
            setMessage={setMessage}
          />
          <Button variant="primary" className="w-full">
            Send Message
          </Button>
        </form> */}
      {/* </section> */}

    </div>
  );
}

/*    REUSABLE FORM    */

function FormFields({
  name,
  email,
  message,
  setName,
  setEmail,
  setMessage
}: any) {
  return (
    <>
      <div>
        <label className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9f2b34]/40"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9f2b34]/40"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Tell us how we can help..."
          className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9f2b34]/40"
        />
      </div>
    </>
  );
}

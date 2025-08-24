'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#pricing',  label: 'Pricing'  },
  { href: '/#about',    label: 'About'    },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4" data-ui="navbar-glass-ok">
      <nav
        aria-label="Main"
        className={[
          'w-full max-w-7xl rounded-full px-4 lg:px-6 h-14',
          'backdrop-blur-md transition-all duration-300',
          'flex items-center justify-between',
          scrolled
            ? 'bg-white/85 shadow-lg'
            : 'bg-white/70 shadow-md',
        ].join(' ')}
        style={{ border: '1px solid rgba(255,255,255,0.55)' }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-200 via-cyan-200 to-pink-200" />
          <span className="font-bold text-lg tracking-tight text-gray-900">MotusDAO</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/get-started"
            className="hidden lg:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-gray-900 bg-white/85 shadow-md hover:shadow-lg transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.55)' }}
          >
            Get Started
          </Link>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/80"
            style={{ border: '1px solid rgba(255,255,255,0.55)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="#0F1222" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile sheet */}
        {open && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
            <div className="absolute inset-x-4 top-6 rounded-2xl bg-white/90 backdrop-blur-xl shadow-lg overflow-hidden"
                 style={{ border: '1px solid rgba(255,255,255,0.6)' }}>
              <div className="flex items-center justify-between px-4 py-4">
                <span className="font-bold text-lg text-gray-900">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/80"
                  style={{ border: '1px solid rgba(255,255,255,0.55)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6l-12 12" stroke="#0F1222" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="px-4 pb-5 pt-1 flex flex-col">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-[15px] text-gray-700 hover:bg-black/[.03]"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/get-started"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium text-gray-900 bg-white/90 shadow-md"
                  style={{ border: '1px solid rgba(255,255,255,0.55)' }}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

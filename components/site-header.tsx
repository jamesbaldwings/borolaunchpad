'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Upcoming Events' },
  { href: '/host', label: 'Host an Event' },
  { href: '/ideas', label: 'Event Ideas' },
  { href: '/space', label: 'The Space' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[hsl(38,33%,93%)]/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="Boro Launch Pad" fill className="object-cover" priority />
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-foreground hidden sm:inline">
            Boro Launch Pad
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
          <Link
            href="/host#request-form"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <CalendarPlus className="w-4 h-4" />
            Request a Date
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-border bg-[hsl(38,33%,93%)]"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base font-medium text-foreground/80 hover:text-primary py-1">
                  {l.label}
                </Link>
              ))}
              <Link
                href="/host#request-form"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold mt-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Request a Date
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

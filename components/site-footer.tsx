import Link from 'next/link';
import { Rocket } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[hsl(180,14%,13%)] text-[hsl(38,33%,93%)]">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-[hsl(40,66%,47%)]" />
            <div>
              <p className="font-display font-bold text-lg">Boro Launch Pad</p>
              <p className="text-sm text-[hsl(38,33%,93%)]/70">Small Events. New Ideas. Room to Grow.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/events" className="hover:text-[hsl(40,66%,47%)] transition-colors">Events</Link>
            <Link href="/host" className="hover:text-[hsl(40,66%,47%)] transition-colors">Host</Link>
            <Link href="/space" className="hover:text-[hsl(40,66%,47%)] transition-colors">The Space</Link>
            <Link href="/contact" className="hover:text-[hsl(40,66%,47%)] transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[hsl(38,33%,93%)]/10 text-center text-xs text-[hsl(38,33%,93%)]/50">
          <p>Murfreesboro, Tennessee Area</p>
          <p className="mt-1" suppressHydrationWarning>© 2026 Boro Launch Pad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

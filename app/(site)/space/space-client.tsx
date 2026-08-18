'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Car, MapPin, Tent, Armchair, Table, Snowflake, Truck, TreePine, Sun, Camera, Lamp, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className={className}>{children}</motion.section>;
}

const features = [
  { icon: Users, label: 'Maximum capacity: 20 people' },
  { icon: Car, label: 'Parking for up to 12 vehicles' },
  { icon: Tent, label: 'Covered barn-style/open-air gathering area with string lights' },
  { icon: Armchair, label: 'Comfortable lounge seating area' },
  { icon: TreePine, label: 'Fenced outdoor space' },
  { icon: Armchair, label: 'Additional chairs available' },
  { icon: Table, label: 'Tables available' },
  { icon: Tent, label: 'Pop-up tents available' },
  { icon: Sun, label: 'Tarps/weather protection available' },
  { icon: Snowflake, label: 'Coolers available' },
  { icon: Truck, label: 'Small food/beverage service trailer available (package dependent)' },
  { icon: MapPin, label: 'Flexible outdoor setup' },
];

const photoPlaceholders = [
  { label: 'Covered Gathering Area', icon: Tent },
  { label: 'Outdoor Space', icon: TreePine },
  { label: 'Event Setup', icon: Table },
  { label: 'The Trailer', icon: Truck },
  { label: 'Evening Lighting', icon: Lamp },
  { label: 'Lounge Area', icon: Armchair },
];

export function SpaceClient() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">The Space</h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">Designed for gatherings that actually feel like gatherings.</p>
        </div>

        {/* Logo as venue image */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="relative aspect-square max-w-md mx-auto">
            <Image src="/logo.png" alt="Boro Launch Pad venue" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Features */}
      <Section className="bg-card">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-10">Venue Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-start gap-3 bg-background rounded-lg p-4 shadow-sm">
                <f.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{f.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">Equipment and amenities vary by package. Contact us to discuss what&apos;s included with your booking.</p>
        </div>
      </Section>

      {/* Photo Gallery Placeholder */}
      <Section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-10">Photo Gallery</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photoPlaceholders.map((p) => (
            <div key={p.label} className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center gap-3 border border-dashed border-border">
              <p.icon className="w-8 h-8 text-muted-foreground/40" />
              <span className="text-sm text-muted-foreground/60 font-medium">{p.label}</span>
              <span className="text-xs text-muted-foreground/40">Photo coming soon</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Capacity strip */}
      <section className="bg-foreground text-background">
        <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium">
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> Up to 20 Guests</span>
          <span className="flex items-center gap-2"><Car className="w-4 h-4 text-accent" /> Up to 12 Vehicles</span>
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Murfreesboro, TN Area</span>
          <span className="flex items-center gap-2"><TreePine className="w-4 h-4 text-accent" /> Private Property</span>
        </div>
      </section>

      {/* CTA */}
      <Section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Ready to bring your event here?</h2>
          <Link href="/host#request-form" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md">
            Request a Date <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>
    </div>
  );
}

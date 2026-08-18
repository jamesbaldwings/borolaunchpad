'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Users, MapPin, Car, Tent, Package, ArrowRight, Rocket, Star, Sparkles, Quote } from 'lucide-react';
import { EventCard } from '@/components/event-card';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className={className} id={id}>
      {children}
    </motion.section>
  );
}

export function HomeClient({ events, spotlightHosts }: { events: any[]; spotlightHosts: any[] }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Have an idea? <span className="text-primary">Launch it.</span>
              </h1>
              <p className="mt-4 text-lg text-accent font-semibold">Workshops. Classes. Pop-ups. Celebrations. Experiences.</p>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Boro Launch Pad is a private small-event space near Murfreesboro created for gatherings of up to 20 people. Whether you&apos;re looking for something different to do or you&apos;ve been thinking about hosting an event of your own, this is a place for small beginnings and good ideas.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/events" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                  See Upcoming Events <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/host" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all">
                  Host an Event <Rocket className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <Image src="/logo.png" alt="Boro Launch Pad - Rustic event venue with covered gathering area and string lights" fill className="object-contain rounded-xl" priority />
              </div>
            </div>
          </div>
        </div>
        {/* Info strip */}
        <div className="bg-foreground text-background">
          <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> Up to 20 Guests</span>
            <span className="flex items-center gap-2"><Car className="w-4 h-4 text-accent" /> Up to 12 Vehicles</span>
            <span className="flex items-center gap-2"><Tent className="w-4 h-4 text-accent" /> Covered Gathering Area</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Outdoor Space</span>
            <span className="flex items-center gap-2"><Package className="w-4 h-4 text-accent" /> Event Equipment Available</span>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <Section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">What&apos;s Happening at BLP</h2>
        </div>
        {(events?.length ?? 0) > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {(events ?? []).map((event: any) => <EventCard key={event?.id} event={event} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl">
            <Sparkles className="w-8 h-8 mx-auto text-accent mb-3" />
            <p className="text-muted-foreground">More events coming soon — check back!</p>
          </div>
        )}
        {(events?.length ?? 0) > 0 && (
          <div className="text-center mt-8">
            <Link href="/events" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </Section>

      {/* Two Paths */}
      <Section className="bg-card">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
              <Calendar className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Looking for something to do?</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Discover workshops, classes, celebrations, creative experiences, wellness events, and other small gatherings happening at Boro Launch Pad.
              </p>
              <Link href="/events" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
                Explore Upcoming Events <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-8 rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
              <Rocket className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-display text-2xl font-bold mb-3">Have something you want to host?</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You don&apos;t need a huge audience to start something. Maybe you want to teach your first class, organize a workshop, test a business idea, host a wellness experience, run photography mini-sessions, or simply bring people together. BLP gives you somewhere to try it.
              </p>
              <Link href="/host" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all">
                Bring Us Your Idea <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Could Your Event Be Next? */}
      <Section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">Could Your Event Be Next?</h2>
          <div className="text-muted-foreground leading-relaxed space-y-4 text-base md:text-lg">
            <p>Maybe you teach something. Maybe you make something. Maybe there&apos;s an experience you&apos;ve wanted to create. Or maybe you&apos;ve been thinking about hosting a workshop, class, tasting, wellness event, pop-up, or gathering but haven&apos;t had the right place to try it.</p>
            <p>You shouldn&apos;t need to rent a venue built for 150 people just to find out whether 12 people will show up.</p>
            <p className="text-foreground font-semibold text-lg md:text-xl">Start with 10. Learn what works. Grow from there.</p>
            <p>Boro Launch Pad gives new ideas somewhere to begin.</p>
          </div>
          <Link href="/host" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all shadow-md">
            Tell Us Your Idea <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* Host Spotlight */}
      {(spotlightHosts?.length ?? 0) > 0 && (
        <Section className="bg-card">
          <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">BLP Host Spotlight</h2>
              <p className="mt-2 text-muted-foreground">Real people. Real ideas. Real events.</p>
            </div>
            <div className="grid gap-8">
              {(spotlightHosts ?? []).map((host: any) => (
                <div key={host?.id} className="bg-background rounded-xl p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-6">
                    {host?.photoUrl && (
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                        <Image src={host.photoUrl} alt={host?.name ?? 'Host'} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-accent" />
                        <span className="text-sm font-semibold text-accent">Featured Host</span>
                      </div>
                      <h3 className="font-display text-xl md:text-2xl font-bold">{host?.name ?? 'Host'}</h3>
                      <p className="text-muted-foreground mt-2 leading-relaxed">{host?.bio ?? ''}</p>
                      {host?.spotlightStory && (
                        <p className="text-muted-foreground mt-3 leading-relaxed text-sm">{host.spotlightStory}</p>
                      )}
                      {host?.spotlightQuote && (
                        <div className="mt-4 flex gap-3 bg-card rounded-lg p-4">
                          <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="italic text-foreground/80">&ldquo;{host.spotlightQuote}&rdquo;</p>
                        </div>
                      )}
                      {(host?.events?.length ?? 0) > 0 && (
                        <Link href="/events" className="inline-flex items-center gap-2 mt-4 text-primary font-semibold text-sm hover:underline">
                          See Their Next Event <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-lg font-semibold mb-4">What could you launch?</p>
              <Link href="/host" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
                Tell Us Your Idea <Rocket className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* Venue Preview */}
      <Section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">The Space</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Tent, title: 'Covered Gathering Area', desc: 'A barn-style covered outdoor space with warm string lights and comfortable lounge seating.' },
            { icon: MapPin, title: 'Outdoor Space', desc: 'A fenced property with flexible outdoor setup options, trees, and room to breathe.' },
            { icon: Package, title: 'Event Equipment', desc: 'Tables, chairs, pop-up tents, coolers, and a food/beverage trailer available by package.' },
          ].map((item: any) => (
            <div key={item.title} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/space" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            See The Space <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>
    </div>
  );
}

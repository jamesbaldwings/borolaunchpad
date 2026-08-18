'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Paintbrush, Rocket, Heart, PartyPopper, Users2, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className={className}>{children}</motion.section>;
}

const categories = [
  { icon: Paintbrush, title: 'Teach Something', color: 'text-primary', bgColor: 'bg-primary/10', ideas: ['Paint & Sip', 'Art classes', 'Photography workshops', 'Gardening classes', 'Cooking demonstrations', 'Charcuterie workshops', 'Candle making', 'Floral arranging', 'Craft workshops', 'Small professional workshops'] },
  { icon: Rocket, title: 'Build Something', color: 'text-accent', bgColor: 'bg-accent/10', ideas: ['First paid workshop', 'Small business pop-up', 'Product demonstration', 'Photography mini-sessions', 'Content creation days', 'Networking events', 'Client appreciation events', 'Small business meetups', 'Entrepreneur workshops'] },
  { icon: Heart, title: 'Wellness & Experiences', color: 'text-primary', bgColor: 'bg-primary/10', ideas: ['Yoga', 'Goat yoga', 'Meditation', 'Sound baths', 'Small wellness retreats', 'Fitness classes', 'Outdoor experiences', "Women's gatherings"] },
  { icon: PartyPopper, title: 'Celebrate Something', color: 'text-accent', bgColor: 'bg-accent/10', ideas: ['Baby showers', 'Bridal showers', 'Birthdays', 'Anniversaries', 'Graduations', 'Engagement celebrations', 'Family gatherings', 'Holiday gatherings'] },
  { icon: Users2, title: 'Bring People Together', color: 'text-primary', bgColor: 'bg-primary/10', ideas: ['Book clubs', 'Garden clubs', "Women's groups", 'Small church groups', 'Homeschool activities', 'Community groups', 'Team-building events', 'Social clubs'] },
  { icon: Lightbulb, title: 'Create Something Different', color: 'text-accent', bgColor: 'bg-accent/10', ideas: ['Outdoor brunch', 'Picnic experience', 'Supper club', 'Tastings', 'Seasonal workshops', 'Photography events', 'Themed experiences', "Creative events we haven't thought of yet"] },
];

export function IdeasClient() {
  return (
    <div>
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Event Ideas</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">Not sure what kind of event you could host? Here are some ideas to get you started. Or bring us something entirely new.</p>
        </div>

        <div className="space-y-8">
          {categories.map((cat, i) => (
            <Section key={cat.title}>
              <div className={`rounded-xl p-6 md:p-8 ${i % 2 === 0 ? 'bg-card' : 'bg-background'} shadow-sm`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${cat.bgColor}`}>
                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <h2 className="font-display text-2xl font-bold">{cat.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.ideas.map((idea) => (
                    <span key={idea} className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
            </Section>
          ))}
        </div>

        <Section className="mt-16">
          <div className="text-center bg-card rounded-xl p-8 md:p-12">
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Don&apos;t see your idea?</h2>
            <p className="text-muted-foreground text-lg mb-6">That&apos;s kind of the point. Tell us what you&apos;re thinking.</p>
            <Link href="/host#request-form" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-md">
              Tell Us Your Idea <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>
      </section>
    </div>
  );
}

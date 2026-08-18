'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Rocket, Sparkles, Check, ArrowRight, Paintbrush, ChefHat, Heart, PartyPopper, Users2, Lightbulb, Package, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return <motion.section ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} className={className} id={id}>{children}</motion.section>;
}

const eventCategories = [
  { icon: Paintbrush, title: 'Teach Something', ideas: ['Paint & Sip', 'Art classes', 'Photography workshops', 'Gardening classes', 'Cooking demonstrations', 'Charcuterie workshops', 'Candle making', 'Floral arranging', 'Craft workshops', 'Small professional workshops'] },
  { icon: Rocket, title: 'Build Something', ideas: ['First paid workshop', 'Small business pop-up', 'Product demonstration', 'Photography mini-sessions', 'Content creation days', 'Networking events', 'Client appreciation events', 'Small business meetups', 'Entrepreneur workshops'] },
  { icon: Heart, title: 'Wellness & Experiences', ideas: ['Yoga', 'Goat yoga', 'Meditation', 'Sound baths', 'Small wellness retreats', 'Fitness classes', 'Outdoor experiences', "Women's gatherings"] },
  { icon: PartyPopper, title: 'Celebrate Something', ideas: ['Baby showers', 'Bridal showers', 'Birthdays', 'Anniversaries', 'Graduations', 'Engagement celebrations', 'Family gatherings', 'Holiday gatherings'] },
  { icon: Users2, title: 'Bring People Together', ideas: ['Book clubs', 'Garden clubs', "Women's groups", 'Small church groups', 'Homeschool activities', 'Community groups', 'Team-building events', 'Social clubs'] },
  { icon: Lightbulb, title: 'Create Something Different', ideas: ['Outdoor brunch', 'Picnic experience', 'Supper club', 'Tastings', 'Seasonal workshops', 'Photography events', 'Themed experiences', "Creative events we haven't thought of yet"] },
];

export function HostClient({ packages }: { packages: any[] }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', preferredDate: '', backupDate: '',
    preferredStartTime: '', preferredEndTime: '', eventType: '',
    expectedGuests: '', estimatedVehicles: '', foodServed: false, beveragesServed: false,
    needsTables: false, needsChairs: false, needsTents: false, needsCoolers: false, needsTrailer: false,
    packageInterest: '', previousExperience: '', eventDescription: '', ideaDescription: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success('Request submitted!');
      } else {
        const data = await res.json();
        toast.error(data?.error ?? 'Something went wrong');
      }
    } catch { toast.error('Something went wrong'); }
    setSubmitting(false);
  };

  const updateForm = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none';

  return (
    <div>
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6">Could Your Event Be <span className="text-primary">Next?</span></h1>
          <div className="text-muted-foreground leading-relaxed space-y-4 text-base md:text-lg">
            <p>Maybe you teach something. Maybe you make something. Maybe there&apos;s an experience you&apos;ve wanted to create.</p>
            <p>You shouldn&apos;t need to rent a venue built for 150 people just to find out whether 12 people will show up.</p>
            <p className="text-foreground font-semibold text-lg md:text-xl">Start with 10. Learn what works. Grow from there.</p>
            <p>Boro Launch Pad gives new ideas somewhere to begin.</p>
          </div>
        </div>
      </section>

      {/* Event Inspiration */}
      <Section className="bg-card">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">What Could You Launch?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Some visitors will have an idea but not know what kind of event they could create. Here are some examples to spark inspiration.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventCategories.map((cat) => (
              <div key={cat.title} className="bg-background rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <cat.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display font-bold text-lg mb-3">{cat.title}</h3>
                <ul className="space-y-1.5">
                  {cat.ideas.map((idea) => (
                    <li key={idea} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">Don&apos;t see your idea? That&apos;s kind of the point. Tell us what you&apos;re thinking.</p>
            <a href="#request-form" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
              Pitch Your Event Idea <Sparkles className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Section>

      {/* Packages */}
      <Section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Choose Your Setup</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(packages ?? []).map((pkg: any, i: number) => (
            <div key={pkg?.id ?? i} className={`rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow ${
              i === 1 ? 'bg-foreground text-background ring-2 ring-accent' : 'bg-card'
            }`}>
              {i === 1 && <span className="text-accent text-xs font-bold uppercase tracking-wider">Most Popular</span>}
              <h3 className="font-display text-xl font-bold mt-2">{pkg?.name ?? ''}</h3>
              <p className={`text-sm mt-2 ${i === 1 ? 'text-background/70' : 'text-muted-foreground'}`}>{pkg?.description ?? ''}</p>
              <div className="my-6">
                <span className={`font-bold ${i === 1 ? 'text-accent' : 'text-accent'}`}>{pkg?.priceDisplay ?? 'Contact Us'}</span>
              </div>
              <ul className="space-y-2">
                {(Array.isArray(pkg?.features) ? pkg.features : []).map((f: string, fi: number) => (
                  <li key={fi} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${i === 1 ? 'text-accent' : 'text-primary'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#request-form" className={`block text-center mt-6 px-5 py-2.5 rounded-lg font-semibold transition-all ${
                i === 1 ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}>Get Started</a>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">Equipment and amenities vary by package. Contact us to discuss your specific needs.</p>
      </Section>

      {/* Request a Date Form */}
      <Section className="bg-card" id="request-form">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <CalendarPlus className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Request a Date</h2>
              <p className="mt-3 text-muted-foreground">Tell us about your idea and we&apos;ll be in touch to discuss availability and details.</p>
            </div>

            {success ? (
              <div className="bg-primary/10 rounded-xl p-8 text-center">
                <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-primary mb-3">Your request has been received!</h3>
                <p className="text-muted-foreground leading-relaxed">We&apos;ll review your idea and reach out within 1-2 business days to discuss availability and next steps. We can&apos;t wait to hear more about what you&apos;re planning.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact info */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => updateForm('name', e.target.value)} className={inputClass} />
                  <input type="email" placeholder="Your Email *" required value={form.email} onChange={(e) => updateForm('email', e.target.value)} className={inputClass} />
                  <input type="tel" placeholder="Your Phone *" required value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} className={inputClass} />
                </div>

                {/* Dates & times */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Preferred Event Date *</label>
                    <input type="date" required value={form.preferredDate} onChange={(e) => updateForm('preferredDate', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Backup Date (optional)</label>
                    <input type="date" value={form.backupDate} onChange={(e) => updateForm('backupDate', e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Preferred Start Time</label>
                    <input type="time" value={form.preferredStartTime} onChange={(e) => updateForm('preferredStartTime', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Preferred End Time</label>
                    <input type="time" value={form.preferredEndTime} onChange={(e) => updateForm('preferredEndTime', e.target.value)} className={inputClass} />
                  </div>
                </div>

                {/* Event details */}
                <input type="text" placeholder="Type of Event" value={form.eventType} onChange={(e) => updateForm('eventType', e.target.value)} className={inputClass} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Expected Number of Guests (max 20)</label>
                    <input type="number" min={1} max={20} value={form.expectedGuests} onChange={(e) => updateForm('expectedGuests', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Estimated Number of Vehicles (max 12)</label>
                    <input type="number" min={0} max={12} value={form.estimatedVehicles} onChange={(e) => updateForm('estimatedVehicles', e.target.value)} className={inputClass} />
                  </div>
                </div>

                {/* Yes/No */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Food will be served?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="food" checked={form.foodServed} onChange={() => updateForm('foodServed', true)} className="accent-primary" /> Yes</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="food" checked={!form.foodServed} onChange={() => updateForm('foodServed', false)} className="accent-primary" /> No</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Beverages will be served?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="bev" checked={form.beveragesServed} onChange={() => updateForm('beveragesServed', true)} className="accent-primary" /> Yes</label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="bev" checked={!form.beveragesServed} onChange={() => updateForm('beveragesServed', false)} className="accent-primary" /> No</label>
                    </div>
                  </div>
                </div>

                {/* Equipment checkboxes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Interested in any of the following?</label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      ['needsTables', 'Tables'],
                      ['needsChairs', 'Additional Chairs'],
                      ['needsTents', 'Pop-up Tents'],
                      ['needsCoolers', 'Coolers'],
                      ['needsTrailer', 'Food/Beverage Trailer'],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" checked={(form as any)[key]} onChange={(e) => updateForm(key, e.target.checked)} className="accent-primary w-4 h-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Package & experience */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Package Interest</label>
                    <select value={form.packageInterest} onChange={(e) => updateForm('packageInterest', e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Space Only">Space Only</option>
                      <option value="Event Ready">Event Ready</option>
                      <option value="Host Plus">Host Plus</option>
                      <option value="Not Sure Yet">Not Sure Yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Previous hosting experience</label>
                    <select value={form.previousExperience} onChange={(e) => updateForm('previousExperience', e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="Yes, I've hosted this before">Yes, I&apos;ve hosted this before</option>
                      <option value="No, this would be my first event">No, this would be my first event</option>
                      <option value="I've hosted something similar">I&apos;ve hosted something similar</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">First time? Perfect. That&apos;s what we&apos;re here for.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Event Description</label>
                  <textarea rows={3} placeholder="Describe your event..." value={form.eventDescription} onChange={(e) => updateForm('eventDescription', e.target.value)} className={`${inputClass} resize-none`} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-lg">Tell us your idea — what are you thinking?</label>
                  <textarea rows={5} placeholder="Share your vision... what would your event look like?" value={form.ideaDescription} onChange={(e) => updateForm('ideaDescription', e.target.value)} className={`${inputClass} resize-none`} />
                </div>

                <button type="submit" disabled={submitting} className="w-full px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 shadow-md">
                  {submitting ? 'Submitting...' : 'Request Your Date'}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

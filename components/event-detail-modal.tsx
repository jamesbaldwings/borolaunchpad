'use client';
import { useState } from 'react';
import Image from 'next/image';
import { X, Calendar, Clock, Users, DollarSign, ExternalLink, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';


export function EventDetailModal({ event, onClose }: { event: any; onClose: () => void }) {
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', spots: 1, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...regForm, eventId: event?.id }),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success('Registration successful!');
      } else {
        const data = await res.json();
        toast.error(data?.error ?? 'Something went wrong');
      }
    } catch { toast.error('Something went wrong'); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-muted transition-colors">
          <X className="w-5 h-5" />
        </button>

        {event?.imageUrl && (
          <div className="relative aspect-video">
            <Image src={event.imageUrl} alt={event?.title ?? ''} fill className="object-cover rounded-t-xl" />
            <div className="absolute top-3 left-3">
              <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">{event?.category ?? ''}</span>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">{event?.title ?? ''}</h2>

          {event?.host && (
            <div className="flex items-center gap-3 mb-4">
              {event.host?.photoUrl && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image src={event.host.photoUrl} alt={event.host?.name ?? ''} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">{event.host?.name ?? ''}</p>
                {event.host?.bio && <p className="text-xs text-muted-foreground line-clamp-1">{event.host.bio}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {event?.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
            {event?.startTime && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.startTime}{event?.endTime ? ` - ${event.endTime}` : ''}</span>}
            {event?.price != null && <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> ${Number(event.price).toFixed(0)}</span>}
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {event?.spotsRemaining ?? 0} of {event?.spotsTotal ?? 0} spots remaining</span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">{event?.description ?? ''}</p>

          {/* Registration */}
          {event?.registrationType === 'blp' && !event?.isSoldOut && !success && (
            <div className="border-t border-border pt-6">
              <h3 className="font-display text-lg font-bold mb-4">Register for This Event</h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name *" required value={regForm.name} onChange={(e) => setRegForm({...regForm, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                  <input type="email" placeholder="Your Email *" required value={regForm.email} onChange={(e) => setRegForm({...regForm, email: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="tel" placeholder="Phone (optional)" value={regForm.phone} onChange={(e) => setRegForm({...regForm, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                  <input type="number" placeholder="Number of Spots" min={1} max={event?.spotsRemaining ?? 1} value={regForm.spots} onChange={(e) => setRegForm({...regForm, spots: parseInt(e.target.value) || 1})} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
                </div>
                <textarea placeholder="Any message for the host? (optional)" rows={3} value={regForm.message} onChange={(e) => setRegForm({...regForm, message: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none" />
                <button type="submit" disabled={submitting} className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50">
                  {submitting ? 'Registering...' : 'Register Now'}
                </button>
              </form>
            </div>
          )}

          {event?.registrationType === 'external' && event?.externalUrl && (
            <a href={event.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
              Register Externally <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {event?.registrationType === 'contact' && event?.contactInfo && (
            <div className="border-t border-border pt-6">
              <h3 className="font-display text-lg font-bold mb-2">Contact to Register</h3>
              <p className="text-muted-foreground">{event.contactInfo}</p>
            </div>
          )}

          {success && (
            <div className="border-t border-border pt-6 text-center">
              <div className="bg-primary/10 rounded-xl p-6">
                <h3 className="font-display text-lg font-bold text-primary mb-2">You&apos;re Registered!</h3>
                <p className="text-muted-foreground">We&apos;ll send you details as the event gets closer. Thanks for signing up!</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

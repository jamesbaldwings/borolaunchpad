'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        toast.success('Message sent!');
      } else {
        const data = await res.json();
        toast.error(data?.error ?? 'Something went wrong');
      }
    } catch { toast.error('Something went wrong'); }
    setSubmitting(false);
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none';

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Get in Touch</h1>
          <p className="mt-3 text-muted-foreground">Have a question or want to learn more? We&apos;d love to hear from you.</p>
        </div>

        {success ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 rounded-xl p-8 text-center">
            <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-primary mb-3">Message Sent!</h3>
            <p className="text-muted-foreground">Thanks for reaching out. We&apos;ll get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputClass} />
              <input type="email" placeholder="Your Email *" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={inputClass} />
            </div>
            <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className={inputClass} />
            <select value={form.reason} onChange={(e) => setForm({...form, reason: e.target.value})} className={inputClass}>
              <option value="">Reason for contacting...</option>
              <option value="I want to host an event">I want to host an event</option>
              <option value="I have a question about an upcoming event">I have a question about an upcoming event</option>
              <option value="I want to attend an event">I want to attend an event</option>
              <option value="Vendor/partnership inquiry">Vendor/partnership inquiry</option>
              <option value="General question">General question</option>
            </select>
            <textarea rows={5} placeholder="Your Message *" required value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className={`${inputClass} resize-none`} />
            <button type="submit" disabled={submitting} className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-border space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">Located in the Murfreesboro, Tennessee area. Exact address provided upon booking confirmation.</p>
          </div>
          <p className="text-xs text-muted-foreground">Your information is kept private and will only be used to respond to your inquiry.</p>
        </div>
      </div>
    </div>
  );
}

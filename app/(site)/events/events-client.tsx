'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';
import { EventCard } from '@/components/event-card';
import { EventDetailModal } from '@/components/event-detail-modal';

const categories = ['All', 'Teach Something', 'Build Something', 'Wellness & Experiences', 'Celebrate Something', 'Bring People Together', 'Create Something Different'];

export function EventsClient() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'All') params.set('category', activeCategory);
        const res = await fetch(`/api/events?${params.toString()}`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch { setEvents([]); }
      setLoading(false);
    };
    fetchEvents();
  }, [activeCategory]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Upcoming Events at Boro Launch Pad</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Workshops, classes, pop-ups, celebrations, and small gatherings near Murfreesboro, TN.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-card rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : (events?.length ?? 0) > 0 ? (
        <motion.div layout className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {(events ?? []).map((event: any) => (
              <motion.div key={event?.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <EventCard event={event} onSelect={setSelectedEvent} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-card rounded-xl">
          <Sparkles className="w-10 h-10 mx-auto text-accent mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">No upcoming events right now</h3>
          <p className="text-muted-foreground">Check back soon! Want to host something? <a href="/host" className="text-primary font-semibold hover:underline">We&apos;d love to hear your idea.</a></p>
        </div>
      )}

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

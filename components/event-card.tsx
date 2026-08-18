'use client';
import Image from 'next/image';
import { Calendar, Clock, DollarSign, Users, MapPin } from 'lucide-react';


export function EventCard({ event, onSelect }: { event: any; onSelect?: (e: any) => void }) {
  const handleClick = () => onSelect?.(event);
  return (
    <div
      onClick={handleClick}
      className={`bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group ${onSelect ? 'cursor-pointer' : ''}`}
    >
      <div className="relative aspect-video bg-muted">
        {event?.imageUrl ? (
          <Image src={event.imageUrl} alt={event?.title ?? 'Event'} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
        {event?.isSoldOut && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider">Sold Out</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {event?.category ?? 'Event'}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-colors">{event?.title ?? 'Untitled Event'}</h3>
        {event?.host && (
          <div className="flex items-center gap-2 mb-3">
            {event.host?.photoUrl && (
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image src={event.host.photoUrl} alt={event.host?.name ?? ''} fill className="object-cover" />
              </div>
            )}
            <span className="text-sm text-muted-foreground">Hosted by {event.host?.name ?? 'TBA'}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event?.description ?? ''}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {event?.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }) : ''}
          </span>
          {event?.startTime && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.startTime}{event?.endTime ? ` - ${event.endTime}` : ''}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            {event?.price != null && event.price > 0 ? (
              <span className="font-bold text-foreground">${Number(event.price).toFixed(0)}</span>
            ) : (
              <span className="text-sm text-muted-foreground">Free</span>
            )}
          </div>
          <div className="text-xs">
            {event?.isSoldOut ? (
              <span className="text-destructive font-semibold">SOLD OUT</span>
            ) : (event?.spotsRemaining ?? 0) <= 5 && (event?.spotsRemaining ?? 0) > 0 ? (
              <span className="text-accent font-semibold">Only {event.spotsRemaining} spots left!</span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" /> {event?.spotsRemaining ?? 0} spots</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

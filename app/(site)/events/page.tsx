import { Metadata } from 'next';
import { EventsClient } from './events-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Upcoming Events',
  description: 'Discover workshops, classes, pop-ups, wellness events, and small gatherings happening at Boro Launch Pad near Murfreesboro, TN.',
};

export default function EventsPage() {
  return <EventsClient />;
}

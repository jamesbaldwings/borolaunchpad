import { Metadata } from 'next';
import { SpaceClient } from './space-client';

export const metadata: Metadata = {
  title: 'The Space',
  description: 'Explore Boro Launch Pad — a private outdoor small-event venue near Murfreesboro, TN with a covered gathering area, string lights, lounge seating, and event equipment.',
};

export default function SpacePage() {
  return <SpaceClient />;
}

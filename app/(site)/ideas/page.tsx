import { Metadata } from 'next';
import { IdeasClient } from './ideas-client';

export const metadata: Metadata = {
  title: 'Event Ideas',
  description: 'Explore event ideas for Boro Launch Pad — from workshops and classes to wellness experiences and celebrations near Murfreesboro, TN.',
};

export default function IdeasPage() {
  return <IdeasClient />;
}

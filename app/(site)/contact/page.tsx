import { Metadata } from 'next';
import { ContactClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Boro Launch Pad — small event venue near Murfreesboro, TN. Ask about hosting, upcoming events, or partnerships.',
};

export default function ContactPage() {
  return <ContactClient />;
}

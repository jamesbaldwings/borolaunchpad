import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', weight: ['400','500','600','700','800','900'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'Boro Launch Pad | Small Event Venue Near Murfreesboro, TN',
    template: '%s | Boro Launch Pad',
  },
  description: 'Boro Launch Pad is a private small-event space near Murfreesboro, TN for workshops, classes, pop-ups, celebrations, and gatherings of up to 20 people.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Boro Launch Pad | Small Events. New Ideas. Room to Grow.',
    description: 'A private small-event venue near Murfreesboro, TN for workshops, classes, pop-ups, and gatherings of up to 20 people.',
    images: ['/og-image.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

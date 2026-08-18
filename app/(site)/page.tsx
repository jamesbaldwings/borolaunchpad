import { prisma } from '@/lib/db';
import { HomeClient } from './home-client';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true, eventDate: { gte: new Date() } },
    include: { host: true },
    orderBy: { eventDate: 'asc' },
    take: 4,
  });

  const spotlightHosts = await prisma.host.findMany({
    where: { isSpotlight: true },
    include: { events: { where: { isPublished: true, eventDate: { gte: new Date() } }, take: 1, orderBy: { eventDate: 'asc' } } },
  });

  const safeEvents = events.map((e: any) => ({ ...e, price: e.price ? Number(e.price) : null, eventDate: e.eventDate.toISOString(), createdAt: e.createdAt.toISOString(), host: e.host ? { ...e.host, createdAt: e.host.createdAt.toISOString() } : null }));
  const safeHosts = spotlightHosts.map((h: any) => ({ ...h, createdAt: h.createdAt.toISOString(), events: (h.events ?? []).map((ev: any) => ({ ...ev, price: ev.price ? Number(ev.price) : null, eventDate: ev.eventDate.toISOString(), createdAt: ev.createdAt.toISOString() })) }));

  return <HomeClient events={safeEvents} spotlightHosts={safeHosts} />;
}

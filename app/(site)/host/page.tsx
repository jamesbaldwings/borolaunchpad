import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { HostClient } from './host-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Host an Event',
  description: 'Host your workshop, class, pop-up, or gathering at Boro Launch Pad — a small outdoor event venue near Murfreesboro, TN for up to 20 guests.',
};

export default async function HostPage() {
  const packages = await prisma.package.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  const safePackages = packages.map((p: any) => ({ ...p, createdAt: p.createdAt.toISOString() }));
  return <HostClient packages={safePackages} />;
}

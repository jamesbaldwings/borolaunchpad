export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Host email/phone are deliberately excluded — this endpoint is public.
    const hosts = await prisma.host.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        bio: true,
        photoUrl: true,
        isSpotlight: true,
        spotlightQuote: true,
        spotlightStory: true,
        eventsHostedCount: true,
        createdAt: true,
      },
    });
    return NextResponse.json(hosts);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

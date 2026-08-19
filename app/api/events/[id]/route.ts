export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            bio: true,
            photoUrl: true,
            isSpotlight: true,
            spotlightQuote: true,
            spotlightStory: true,
            eventsHostedCount: true,
          },
        },
      },
    });

    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!event.isPublished && !isAdminAuthenticated()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ ...event, price: event.price ? Number(event.price) : null });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

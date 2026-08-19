export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');
    const past = searchParams.get('past');

    // Unpublished / past events are admin-only.
    const isAdmin = isAdminAuthenticated();
    const includeUnpublished = published === 'all' && isAdmin;

    const where: any = {};
    if (!includeUnpublished) where.isPublished = true;
    if (category && category !== 'All') where.category = category;
    if (!(past === 'true' && isAdmin)) where.eventDate = { gte: new Date() };

    const take = limit && Number.isFinite(parseInt(limit)) ? Math.min(parseInt(limit), 100) : undefined;

    const events = await prisma.event.findMany({
      where,
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
      orderBy: { eventDate: 'asc' },
      ...(take ? { take } : {}),
    });

    return NextResponse.json(events.map((e: any) => ({ ...e, price: e.price ? Number(e.price) : null })));
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

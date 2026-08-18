export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');

    const where: any = {};
    if (published !== 'all') where.isPublished = true;
    if (category && category !== 'All') where.category = category;
    where.eventDate = { gte: new Date() };

    const events = await prisma.event.findMany({
      where,
      include: { host: true },
      orderBy: { eventDate: 'asc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    const safe = events.map((e: any) => ({
      ...e,
      price: e.price ? Number(e.price) : null,
    }));

    return NextResponse.json(safe);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

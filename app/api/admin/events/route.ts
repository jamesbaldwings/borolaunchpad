export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const events = await prisma.event.findMany({ include: { host: true }, orderBy: { eventDate: 'desc' } });
  return NextResponse.json(events.map((e: any) => ({ ...e, price: e.price ? Number(e.price) : null })));
}

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        category: body.category,
        eventDate: new Date(body.eventDate),
        startTime: body.startTime ?? null,
        endTime: body.endTime ?? null,
        price: body.price ? parseFloat(body.price) : null,
        spotsTotal: body.spotsTotal ? parseInt(body.spotsTotal) : 20,
        spotsRemaining: body.spotsRemaining ? parseInt(body.spotsRemaining) : (body.spotsTotal ? parseInt(body.spotsTotal) : 20),
        isSoldOut: body.isSoldOut ?? false,
        isPublished: body.isPublished ?? true,
        hostId: body.hostId ? parseInt(body.hostId) : null,
        imageUrl: body.imageUrl ?? null,
        registrationType: body.registrationType ?? 'blp',
        externalUrl: body.externalUrl ?? null,
        contactInfo: body.contactInfo ?? null,
      },
    });
    return NextResponse.json({ ...event, price: event.price ? Number(event.price) : null });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

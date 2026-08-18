export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, name, email, phone, spots, message } = body;
    if (!eventId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const event = await prisma.event.findUnique({ where: { id: parseInt(eventId) } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.isSoldOut || event.spotsRemaining < (spots ?? 1)) {
      return NextResponse.json({ error: 'Not enough spots available' }, { status: 400 });
    }
    const reg = await prisma.registration.create({
      data: { eventId: parseInt(eventId), name, email, phone: phone ?? null, spots: spots ?? 1, message: message ?? null },
    });
    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        spotsRemaining: { decrement: spots ?? 1 },
        isSoldOut: event.spotsRemaining - (spots ?? 1) <= 0,
      },
    });
    return NextResponse.json(reg);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

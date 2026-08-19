export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const limited = rateLimit(`registration:${clientIp(req)}`, 10, 60 * 60 * 1000);
  if (!limited.ok) return tooManyRequests(limited.retryAfterSeconds);

  try {
    const body = await req.json();
    const { eventId, name, email, phone, spots, message } = body;

    const id = parseInt(eventId);
    const requested = Number.isFinite(parseInt(spots)) ? parseInt(spots) : 1;

    if (!Number.isFinite(id) || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    if (requested < 1 || requested > 20) {
      return NextResponse.json({ error: 'Spots must be between 1 and 20' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event || !event.isPublished) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Decrement conditionally so two people registering at the same moment
    // cannot oversell the last spot.
    const registration = await prisma.$transaction(async (tx) => {
      const claimed = await tx.event.updateMany({
        where: { id, isSoldOut: false, spotsRemaining: { gte: requested } },
        data: { spotsRemaining: { decrement: requested } },
      });
      if (claimed.count === 0) return null;

      const created = await tx.registration.create({
        data: {
          eventId: id,
          name: String(name).slice(0, 200),
          email: String(email).slice(0, 200),
          phone: phone ? String(phone).slice(0, 40) : null,
          spots: requested,
          message: message ? String(message).slice(0, 2000) : null,
        },
      });

      const updated = await tx.event.findUnique({ where: { id }, select: { spotsRemaining: true } });
      if (updated && updated.spotsRemaining <= 0) {
        await tx.event.update({ where: { id }, data: { isSoldOut: true } });
      }
      return created;
    });

    if (!registration) {
      return NextResponse.json({ error: 'Not enough spots available' }, { status: 400 });
    }
    return NextResponse.json(registration);
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

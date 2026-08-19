export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const limited = rateLimit(`booking:${clientIp(req)}`, 5, 60 * 60 * 1000);
  if (!limited.ok) return tooManyRequests(limited.retryAfterSeconds);

  try {
    const body = await req.json();
    const { name, email, phone, preferredDate, backupDate, preferredStartTime, preferredEndTime,
      eventType, expectedGuests, estimatedVehicles, foodServed, beveragesServed,
      needsTables, needsChairs, needsTents, needsCoolers, needsTrailer,
      packageInterest, previousExperience, eventDescription, ideaDescription } = body;
    if (!name || !email || !phone || !preferredDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const booking = await prisma.booking.create({
      data: {
        name, email, phone,
        preferredDate: new Date(preferredDate),
        backupDate: backupDate ? new Date(backupDate) : null,
        preferredStartTime: preferredStartTime ?? null,
        preferredEndTime: preferredEndTime ?? null,
        eventType: eventType ?? null,
        expectedGuests: expectedGuests ? parseInt(expectedGuests) : null,
        estimatedVehicles: estimatedVehicles ? parseInt(estimatedVehicles) : null,
        foodServed: foodServed ?? false,
        beveragesServed: beveragesServed ?? false,
        needsTables: needsTables ?? false,
        needsChairs: needsChairs ?? false,
        needsTents: needsTents ?? false,
        needsCoolers: needsCoolers ?? false,
        needsTrailer: needsTrailer ?? false,
        packageInterest: packageInterest ?? null,
        previousExperience: previousExperience ?? null,
        eventDescription: eventDescription ?? null,
        ideaDescription: ideaDescription ?? null,
      },
    });
    return NextResponse.json(booking);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

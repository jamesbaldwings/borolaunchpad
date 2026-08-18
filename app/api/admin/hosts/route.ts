export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hosts = await prisma.host.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(hosts);
}

export async function POST(req: Request) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const host = await prisma.host.create({
      data: {
        name: body.name,
        bio: body.bio ?? null,
        photoUrl: body.photoUrl ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        isSpotlight: body.isSpotlight ?? false,
        spotlightQuote: body.spotlightQuote ?? null,
        spotlightStory: body.spotlightStory ?? null,
      },
    });
    return NextResponse.json(host);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

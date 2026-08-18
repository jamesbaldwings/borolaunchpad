export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const host = await prisma.host.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.isSpotlight !== undefined && { isSpotlight: body.isSpotlight }),
        ...(body.spotlightQuote !== undefined && { spotlightQuote: body.spotlightQuote }),
        ...(body.spotlightStory !== undefined && { spotlightStory: body.spotlightStory }),
      },
    });
    return NextResponse.json(host);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

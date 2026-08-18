export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.category !== undefined) data.category = body.category;
    if (body.eventDate !== undefined) data.eventDate = new Date(body.eventDate);
    if (body.startTime !== undefined) data.startTime = body.startTime;
    if (body.endTime !== undefined) data.endTime = body.endTime;
    if (body.price !== undefined) data.price = body.price ? parseFloat(body.price) : null;
    if (body.spotsTotal !== undefined) data.spotsTotal = parseInt(body.spotsTotal);
    if (body.spotsRemaining !== undefined) data.spotsRemaining = parseInt(body.spotsRemaining);
    if (body.isSoldOut !== undefined) data.isSoldOut = body.isSoldOut;
    if (body.isPublished !== undefined) data.isPublished = body.isPublished;
    if (body.hostId !== undefined) data.hostId = body.hostId ? parseInt(body.hostId) : null;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
    if (body.registrationType !== undefined) data.registrationType = body.registrationType;
    if (body.externalUrl !== undefined) data.externalUrl = body.externalUrl;
    if (body.contactInfo !== undefined) data.contactInfo = body.contactInfo;
    const event = await prisma.event.update({ where: { id: parseInt(params.id) }, data });
    return NextResponse.json({ ...event, price: event.price ? Number(event.price) : null });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await prisma.event.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

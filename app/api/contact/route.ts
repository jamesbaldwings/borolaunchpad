export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, phone, reason, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    const sub = await prisma.contactSubmission.create({
      data: { name, email, phone: phone ?? null, reason: reason ?? null, message },
    });
    return NextResponse.json(sub);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

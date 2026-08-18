export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(packages);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

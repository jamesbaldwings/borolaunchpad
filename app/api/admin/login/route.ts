export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminSessionToken, getAdminCookieName, passwordMatches } from '@/lib/admin-auth';
import { clientIp, rateLimit, tooManyRequests } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const limited = rateLimit(`admin-login:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!limited.ok) return tooManyRequests(limited.retryAfterSeconds);

  try {
    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Admin login is not configured' }, { status: 503 });
    }

    const { password } = await req.json();
    if (!passwordMatches(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const session = createAdminSessionToken();
    const res = NextResponse.json({ success: true });
    res.cookies.set(getAdminCookieName(), session.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: session.maxAge,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'blp_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET or NEXTAUTH_SECRET must be set to a long random value');
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

/** Creates a signed, expiring admin session token. */
export function createAdminSessionToken(): { value: string; maxAge: number } {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_MAX_AGE_SECONDS };
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [scope, expiresRaw, signature] = parts;
  if (scope !== 'admin') return false;
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;
  let expected: string;
  try {
    expected = sign(`${scope}.${expiresRaw}`);
  } catch {
    return false;
  }
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length) return false;
  return crypto.timingSafeEqual(given, want);
}

export function isAdminAuthenticated(): boolean {
  return verifyAdminSessionToken(cookies().get(ADMIN_COOKIE)?.value);
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE;
}

/** Constant-time password comparison. */
export function passwordMatches(given: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof given !== 'string' || given.length === 0) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

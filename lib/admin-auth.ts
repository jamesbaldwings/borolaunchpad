import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'blp_admin_session';
const SESSION_VALUE = 'authenticated';

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === SESSION_VALUE;
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE;
}

export function getSessionValue(): string {
  return SESSION_VALUE;
}

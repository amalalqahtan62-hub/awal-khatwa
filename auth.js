import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'awal_admin';

function secret() {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 16) throw new Error('APP_SECRET is missing or too short');
  return s;
}

export function sign(value) {
  return crypto.createHmac('sha256', secret()).update(String(value)).digest('base64url');
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function checkPassword(pw) {
  const real = process.env.ADMIN_PASSWORD;
  return !!real && safeEqual(pw || '', real);
}

export function adminToken() {
  return sign('admin:' + process.env.ADMIN_PASSWORD);
}

export function isAdmin() {
  const c = cookies().get(COOKIE)?.value;
  return !!c && safeEqual(c, adminToken());
}

export function setAdminCookie(res) {
  res.cookies.set(COOKIE, adminToken(), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12,
  });
  return res;
}

export function clearAdminCookie(res) {
  res.cookies.set(COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}

// رمز المشارك: يمنع أي أحد من الإرسال باسم مشارك آخر
export const participantToken = (pid) => sign('p:' + pid);
export const checkParticipant = (pid, token) => !!pid && !!token && safeEqual(token, participantToken(pid));

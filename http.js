import { NextResponse } from 'next/server';
import { isAdmin } from './auth';

export const ok = (data = {}) => NextResponse.json({ ok: true, ...data }, { headers: { 'Cache-Control': 'no-store' } });
export const fail = (error, status = 400) =>
  NextResponse.json({ ok: false, error }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function body(req) {
  try { return await req.json(); } catch { return {}; }
}

export function guardAdmin() {
  return isAdmin() ? null : fail('unauthorized', 401);
}

export function handle(fn) {
  return async (req, ctx) => {
    try { return await fn(req, ctx); }
    catch (e) { console.error(e); return fail(e.message || 'server_error', 500); }
  };
}

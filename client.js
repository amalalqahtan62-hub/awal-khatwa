'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

let sb = null;
export function supa() {
  if (!sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    sb = createClient(url, key, { auth: { persistSession: false }, realtime: { params: { eventsPerSecond: 20 } } });
  }
  return sb;
}

export async function api(path, data, method) {
  const res = await fetch(path, {
    method: method || (data ? 'POST' : 'GET'),
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify(data) : undefined,
    cache: 'no-store',
  });
  let json = {};
  try { json = await res.json(); } catch {}
  return { status: res.status, ...json };
}

// حالة الجلسة لحظيًا: Realtime من Supabase + قراءة احتياطية كل بضع ثوانٍ
export function useLiveSession({ fallbackMs = 4000 } = {}) {
  const [session, setSession] = useState(null);
  const [offset, setOffset] = useState(0);
  const [live, setLive] = useState(false);
  const idRef = useRef(null);

  const refresh = useCallback(async () => {
    const r = await api('/api/state');
    if (r.ok) {
      setSession(r.session);
      setOffset(r.serverNow - Date.now());
    }
    return r;
  }, []);

  useEffect(() => {
    let alive = true;
    let ch = null;
    (async () => {
      const r = await refresh();
      if (!alive || !r.ok) return;
      idRef.current = r.session.id;
      const c = supa();
      if (!c) return;
      ch = c.channel('session-' + r.session.id)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${r.session.id}` },
          (p) => setSession((s) => ({ ...(s || {}), id: p.new.id, state: p.new.state, is_test: p.new.is_test })))
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sessions' }, () => refresh())
        .subscribe((status) => setLive(status === 'SUBSCRIBED'));
    })();
    const t = setInterval(refresh, fallbackMs);
    return () => { alive = false; clearInterval(t); if (ch) supa()?.removeChannel(ch); };
  }, [refresh, fallbackMs]);

  return { session, state: session?.state, offset, live, refresh, setSession };
}

export function useInterval(fn, ms, active = true) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    if (!active) return;
    ref.current();
    const t = setInterval(() => ref.current(), ms);
    return () => clearInterval(t);
  }, [ms, active]);
}

export function useNow(offset = 0, ms = 200) {
  const [now, setNow] = useState(Date.now() + offset);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() + offset), ms);
    return () => clearInterval(t);
  }, [offset, ms]);
  return now;
}

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'x' + Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

export const arNum = (n) => String(n);

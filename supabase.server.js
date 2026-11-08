import { createClient } from '@supabase/supabase-js';

let admin = null;
export function db() {
  if (!admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase env vars are missing');
    admin = createClient(url, key, { auth: { persistSession: false } });
  }
  return admin;
}

export const EMPTY_STATE = { scene: 0, step: 0, activity: null, view: 'scene' };

export async function getActiveSession() {
  const { data, error } = await db()
    .from('sessions')
    .select('id,label,state,is_test,created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createSession(label = 'ورشة أول خطوة في عالم التصميم', isTest = false) {
  await db().from('sessions').update({ is_active: false }).eq('is_active', true);
  const { data, error } = await db()
    .from('sessions')
    .insert({ label, is_test: isTest, is_active: true, state: EMPTY_STATE })
    .select('id,label,state,is_test,created_at')
    .single();
  if (error) throw error;
  return data;
}

export async function ensureSession() {
  return (await getActiveSession()) || (await createSession());
}

export async function setState(id, state) {
  const { error } = await db().from('sessions').update({ state }).eq('id', id);
  if (error) throw error;
  return state;
}

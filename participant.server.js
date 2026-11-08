import { db, getActiveSession } from './supabase.server';
import { checkParticipant } from './auth';

// يتحقق من المشارك ويرجع الجلسة النشطة؛ يرفض إذا كانت جلسته قديمة
export async function verifyParticipant(pid, token) {
  if (!checkParticipant(pid, token)) return { error: 'bad_token' };
  const session = await getActiveSession();
  if (!session) return { error: 'no_session' };
  const { data: p } = await db()
    .from('participants').select('id,session_id,nickname').eq('id', pid).maybeSingle();
  if (!p) return { error: 'unknown_participant' };
  if (p.session_id !== session.id) return { error: 'stale_session' };
  return { session, participant: p };
}

export function cleanNickname(raw) {
  return String(raw || '')
    .replace(/[\u0000-\u001f<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 20);
}

import { db } from './supabase.server';
import { POLLS, SURVEY } from './activities';
import { rankRows } from './scoring';

async function all(table, cols, sessionId) {
  const { data, error } = await db().from(table).select(cols).eq('session_id', sessionId).limit(5000);
  if (error) throw error;
  return data || [];
}

export async function collect(sessionId) {
  const [participants, votes, answers, survey] = await Promise.all([
    all('participants', 'id,nickname,last_seen,created_at', sessionId),
    all('poll_votes', 'poll_key,participant_id,value,created_at', sessionId),
    all('quiz_answers', 'question_idx,participant_id,choice,is_correct,points,ms,created_at', sessionId),
    all('survey_responses', 'q1,q2,q3,q4,q5,contact,consent,created_at', sessionId),
  ]);
  return { participants, votes, answers, survey };
}

export function summarize({ participants, votes, answers, survey }) {
  const now = Date.now();
  const polls = {};
  for (const key of Object.keys(POLLS)) {
    const counts = Object.fromEntries(POLLS[key].options.map((o) => [o, 0]));
    let total = 0;
    for (const v of votes) if (v.poll_key === key && v.value in counts) { counts[v.value] += 1; total += 1; }
    const avg = POLLS[key].type === 'scale' && total
      ? votes.filter((v) => v.poll_key === key).reduce((a, v) => a + Number(v.value), 0) / total : null;
    polls[key] = { counts, total, avg };
  }
  const perQuestion = [0, 1, 2, 3, 4].map((q) => {
    const rows = answers.filter((a) => a.question_idx === q);
    const counts = [0, 0, 0];
    rows.forEach((a) => { if (counts[a.choice] != null) counts[a.choice] += 1; });
    return { q, answered: rows.length, correct: rows.filter((a) => a.is_correct).length, counts };
  });
  const surveySummary = { total: survey.length, contacts: survey.filter((s) => s.consent && s.contact).length, questions: {} };
  for (const q of SURVEY) {
    const counts = Object.fromEntries(q.options.map((o) => [o, 0]));
    survey.forEach((r) => { if (r[q.key] in counts) counts[r[q.key]] += 1; });
    surveySummary.questions[q.key] = counts;
  }
  return {
    participants: participants.length,
    online: participants.filter((p) => now - new Date(p.last_seen).getTime() < 45000).length,
    polls,
    quiz: { perQuestion, leaderboard: rankRows(answers, participants).slice(0, 10) },
    survey: surveySummary,
  };
}

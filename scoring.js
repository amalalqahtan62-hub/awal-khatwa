// ترتيب المتسابقين: النقاط أولًا (100 لكل إجابة صحيحة)،
// وعند التعادل: الأقل مجموع وقت في الإجابات الصحيحة.
export function rankRows(answers, participants) {
  const names = new Map((participants || []).map((p) => [p.id, p.nickname]));
  const by = new Map();
  for (const a of answers || []) {
    const r = by.get(a.participant_id) || { pid: a.participant_id, score: 0, correct: 0, answered: 0, ms: 0 };
    r.answered += 1;
    if (a.is_correct) { r.score += a.points; r.correct += 1; r.ms += a.ms; }
    by.set(a.participant_id, r);
  }
  const rows = [...by.values()].sort((x, y) => y.score - x.score || x.ms - y.ms);
  rows.forEach((r, i) => { r.rank = i + 1; r.nickname = names.get(r.pid) || ''; });
  return rows;
}

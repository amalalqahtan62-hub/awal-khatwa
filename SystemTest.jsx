'use client';
import { useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { api } from '@/lib/client';
import { SURVEY } from '@/lib/activities';

// اختبار حقيقي على الموقع المنشور: ينشئ جلسة اختبار، يدخل N مشارك فعلي عبر الـAPI،
// يفتح لكل واحد اتصال Realtime مستقل، ويقيس الحفظ والتزامن ومنع التكرار والخصوصية.
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function SystemTest({ control }) {
  const [n, setN] = useState(70);
  const [fresh, setFresh] = useState(true);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState(null);
  const boxRef = useRef(null);

  const add = (line, ok) => {
    setLog((l) => [...l, { line, ok }]);
    setTimeout(() => boxRef.current?.scrollTo(0, 1e9), 30);
  };

  async function run() {
    if (!confirm(`سيتم إنشاء جلسة اختبار وإدخال ${n} مشارك وهمي. لا تشغّليه أثناء الورشة. متابعة؟`)) return;
    setRunning(true); setLog([]); setSummary(null);
    const results = [];
    const check = (name, ok, detail = '') => { results.push(ok); add(`${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`, ok); };
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const clients = [];
    try {
      const s = await control('newSession', { label: 'اختبار النظام', test: true });
      if (!s.ok) throw new Error('تعذر إنشاء جلسة الاختبار');
      const sid = s.session.id;
      add(`جلسة اختبار: ${sid.slice(0, 8)}…`);

      // 1) اتصالات لحظية مستقلة
      const seen = Array.from({ length: n }, () => ({}));
      let t0 = performance.now();
      await Promise.all(Array.from({ length: n }, (_, i) => new Promise((res) => {
        const c = createClient(url, key, { auth: { persistSession: false } });
        const ch = c.channel('t-' + i + '-' + sid)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sid}` }, (p) => {
            const a = p.new.state?.activity;
            if (a) seen[i][a.kind + ':' + (a.key ?? a.q ?? '') + ':' + a.status] = performance.now();
          })
          .subscribe((st) => { if (st === 'SUBSCRIBED' || st === 'CHANNEL_ERROR' || st === 'TIMED_OUT') res(st); });
        clients.push({ c, ch });
      })).then((sts) => {
        const okN = sts.filter((x) => x === 'SUBSCRIBED').length;
        check('اتصالات لحظية', okN === n, `${okN}/${n} خلال ${Math.round(performance.now() - t0)}ms`);
      }));

      // 2) دخول المشاركين في نفس اللحظة
      t0 = performance.now();
      const ps = await Promise.all(Array.from({ length: n }, (_, i) => api('/api/join', { nickname: 'مختبر ' + (i + 1) })));
      const joined = ps.filter((p) => p.ok);
      check('دخول المشاركين', joined.length === n, `${joined.length}/${n} خلال ${Math.round(performance.now() - t0)}ms`);

      // 3) تصويت + زمن الوصول اللحظي
      const tOpen = performance.now();
      await control('pollOpen', { key: 'conf_pre' });
      await sleep(2500);
      const lat = seen.map((s) => s['poll:conf_pre:open']).filter(Boolean).map((t) => t - tOpen);
      check('وصول فتح التصويت للجوالات', lat.length === n, `${lat.length}/${n} · الأبطأ ${Math.round(Math.max(0, ...lat))}ms`);
      t0 = performance.now();
      const votes = await Promise.all(joined.map((p) => api('/api/vote', { pid: p.pid, token: p.token, key: 'conf_pre', value: pick(['1', '2', '3', '4', '5']) })));
      check('حفظ الأصوات', votes.filter((v) => v.saved).length === n, `${votes.filter((v) => v.saved).length}/${n} خلال ${Math.round(performance.now() - t0)}ms`);
      const dup = await api('/api/vote', { pid: joined[0].pid, token: joined[0].token, key: 'conf_pre', value: '5' });
      check('منع التصويت مرتين', !!dup.already);
      const forged = await api('/api/vote', { pid: joined[0].pid, token: 'fake', key: 'conf_pre', value: '5' });
      check('رفض رمز مزوّر', forged.status === 409 && forged.error === 'bad_token');
      await control('pollClose');
      let st = await api('/api/admin/stats');
      check('عدّ الأصوات في اللوحة', st.stats?.polls?.conf_pre?.total === n, `${st.stats?.polls?.conf_pre?.total}`);

      // 4) المسابقة
      await control('quizOpen', { q: 0, seconds: 15 });
      await sleep(1200);
      t0 = performance.now();
      const ans = await Promise.all(joined.map((p) => api('/api/answer', { pid: p.pid, token: p.token, q: 0, choice: Math.floor(Math.random() * 3) })));
      check('حفظ إجابات المسابقة', ans.filter((a) => a.saved).length === n, `${ans.filter((a) => a.saved).length}/${n} خلال ${Math.round(performance.now() - t0)}ms`);
      const dupA = await api('/api/answer', { pid: joined[1].pid, token: joined[1].token, q: 0, choice: 1 });
      check('منع الإجابة مرتين', !!dupA.already);
      await control('quizReveal');
      st = await api('/api/admin/stats');
      check('عدّ الإجابات والترتيب', st.stats?.quiz?.perQuestion?.[0]?.answered === n && (st.stats?.quiz?.leaderboard?.length || 0) > 0,
        `أجاب ${st.stats?.quiz?.perQuestion?.[0]?.answered} · الأوائل ${st.stats?.quiz?.leaderboard?.length}`);
      const me = await api('/api/me', { pid: joined[2].pid, token: joined[2].token });
      check('نتيجة المشارك في جواله', me.ok && me.last != null);
      await control('clearActivity');

      // 5) الاستبيان
      await control('surveyOpen');
      await sleep(800);
      t0 = performance.now();
      const sv = await Promise.all(joined.map((_, i) => api('/api/survey', {
        anon: 'test-' + sid + '-' + i, answers: Object.fromEntries(SURVEY.map((q) => [q.key, pick(q.options)])), contact: '', consent: false,
      })));
      check('حفظ ردود الاستبيان', sv.filter((x) => x.saved).length === n, `${sv.filter((x) => x.saved).length}/${n} خلال ${Math.round(performance.now() - t0)}ms`);
      await control('surveyClose');
      st = await api('/api/admin/stats');
      check('عدّ الاستبيان', st.stats?.survey?.total === n, `${st.stats?.survey?.total}`);

      // 6) الخصوصية: المتصفح ما يقدر يقرأ الاستبيان أو الإجابات مباشرة
      const pub = createClient(url, key, { auth: { persistSession: false } });
      const r1 = await pub.from('survey_responses').select('q4').limit(5);
      const r2 = await pub.from('quiz_answers').select('choice').limit(5);
      check('الاستبيان محمي من القراءة العامة', !r1.data?.length);
      check('إجابات المسابقة محمية من القراءة العامة', !r2.data?.length);
      const r3 = await pub.from('sessions').update({ state: {} }).eq('id', sid).select();
      check('منع تعديل الجلسة من المتصفح', !r3.data?.length);

      // 7) المتصلون
      await Promise.all(joined.map((p) => api('/api/heartbeat', { pid: p.pid, token: p.token })));
      st = await api('/api/admin/stats');
      check('عدّاد المتصلين', (st.stats?.online || 0) >= n, `${st.stats?.online}`);
    } catch (e) {
      check('خطأ غير متوقع', false, e.message);
    } finally {
      clients.forEach(({ c, ch }) => c.removeChannel(ch));
      if (fresh) {
        await control('newSession', { label: 'ورشة أول خطوة في عالم التصميم' });
        add('أُنشئت جلسة حقيقية نظيفة للورشة.');
      }
      const passed = results.filter(Boolean).length;
      setSummary({ passed, total: results.length });
      setRunning(false);
    }
  }

  return (
    <>
      <h3>اختبار النظام قبل الورشة</h3>
      <p style={{ marginTop: 6, lineHeight: 1.8, opacity: 0.8 }}>
        يدخل عدد من المشاركين الوهميين دفعة واحدة على الموقع المنشور، ويختبر: الاتصال اللحظي، والدخول، والتصويت، والمسابقة، والاستبيان، ومنع التكرار، وحماية البيانات.
        شغّليه مرة بعد النشر، ثم جرّبي بجوالك وجوالين من أهلك.
      </p>
      <div className="a-row" style={{ marginTop: 12 }}>
        <label className="a-row" style={{ gap: 6 }}>عدد المشاركين <input className="a-in en" type="number" min={5} max={150} value={n} onChange={(e) => setN(Number(e.target.value))} style={{ width: 80 }} /></label>
        <label className="a-row" style={{ gap: 6 }}><input type="checkbox" checked={fresh} onChange={(e) => setFresh(e.target.checked)} /> بعد الاختبار: ابدأ جلسة حقيقية نظيفة</label>
        <button className="a-btn p" disabled={running} onClick={run}>{running ? 'جاري الاختبار…' : 'شغّلي الاختبار'}</button>
      </div>
      {summary && (
        <div className={'a-badge' + (summary.passed === summary.total ? '' : ' c')} style={{ marginTop: 12, fontSize: 15 }}>
          {summary.passed === summary.total ? '✓ كل الاختبارات نجحت' : '✗ بعض الاختبارات فشلت'} — {summary.passed}/{summary.total}
        </div>
      )}
      {log.length > 0 && (
        <div className="a-log" ref={boxRef} style={{ marginTop: 12 }}>
          {log.map((l, i) => <div key={i} className={l.ok === true ? 'a-pass' : l.ok === false ? 'a-fail' : ''}>{l.line}</div>)}
        </div>
      )}
    </>
  );
}

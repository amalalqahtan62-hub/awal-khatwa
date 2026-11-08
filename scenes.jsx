'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, Sel, QRCard, LiveBadge, pct, EASE } from './parts';
import { Glyph, FIVE, FearIcon, Check, Warn, ArrowL, ToolGlyphs } from '../icons';
import Design from '../Design';
import { FEARS, POLLS, QUIZ_COUNT } from '@/lib/activities';
import { PARTS } from '@/lib/scenes';

const T = (d = 0, dur = 0.7) => ({ duration: dur, delay: d, ease: EASE });

/* ───────────────── 01 الافتتاح ───────────────── */
function Opening() {
  return (
    <>
      <motion.div layoutId="geo" className="abs" style={{ left: 765, top: 160, width: 70, height: 70, background: '#AC80DF' }}
        initial={{ scale: 0, rotate: 45 }} animate={{ scale: [0, 1.2, 1], rotate: [45, 45, 0] }} transition={T(0.1, 1.2)} />
      <motion.div className="abs center" style={{ top: 280 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={T(1.1, 0.9)}>
        <div className="h1" style={{ fontSize: 124 }}>أول خطوة في</div>
        <div className="h1" style={{ fontSize: 124 }}><Sel delay={1.7}>عالم التصميم</Sel></div>
      </motion.div>
      <Reveal className="abs center p1" style={{ top: 615, fontSize: 38, color: '#e5d6f8' }} delay={2.8}>مو لازم تعرف كل شيء… عشان تبدأ.</Reveal>
      <Reveal className="abs center" style={{ bottom: 70 }} delay={3.6}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22 }}>
          <span style={{ width: 60, height: 2, background: '#AC80DF' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 30 }}>أمل القحطاني</div>
            <div style={{ fontSize: 21, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>مصممة جرافيك ومدربة معتمدة من Adobe</div>
          </div>
          <span style={{ width: 60, height: 2, background: '#AC80DF' }} />
        </div>
      </Reveal>
    </>
  );
}

/* ───────────────── 02 سؤال البداية ───────────────── */
const EXCUSES = [
  { t: 'البرنامج معقد.', s: { right: 150, top: 170 }, r: -3 },
  { t: 'ما عندي موهبة.', s: { left: 170, top: 210 }, r: 3 },
  { t: 'الاشتراك غالي.', s: { right: 230, bottom: 170 }, r: 2 },
  { t: 'ما أعرف من وين أبدأ.', s: { left: 140, bottom: 190 }, r: -2 },
];
function Question({ step }) {
  return (
    <>
      <motion.div layoutId="geo" className="abs" style={{ right: 120, top: 70, width: 26, height: 26, background: '#AC80DF' }} transition={T(0, 1)} />
      <motion.div className="abs center" style={{ top: 330 }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={T(0.3, 1)}>
        <div className="h2" style={{ fontSize: 84, maxWidth: 1100, margin: '0 auto' }}>
          كم مرة فكرت تتعلم التصميم…<br /><span className="acc">وأجلت الفكرة؟</span>
        </div>
      </motion.div>
      {EXCUSES.map((e, i) => (
        <Reveal key={i} show={step >= 1} delay={i * 0.55} className="abs chip out" style={{ ...e.s, fontSize: 32, rotate: e.r, color: 'rgba(255,255,255,.82)', borderColor: 'rgba(255,255,255,.28)' }}>
          {e.t}
        </Reveal>
      ))}
    </>
  );
}

/* ───────────────── مقياس الثقة (قبل/بعد) ───────────────── */
function Scale({ data, showResults, layoutId = 'scale' }) {
  const total = data?.total || 0;
  return (
    <motion.div layoutId={layoutId} className="abs" style={{ right: 120, top: 330, display: 'flex', gap: 22 }} transition={T(0, 0.9)}>
      {['1', '2', '3', '4', '5'].map((v, i) => {
        const n = data?.counts?.[v] || 0;
        const p = pct(n, total);
        return (
          <div key={v} style={{ width: 168, textAlign: 'center' }}>
            <div className="card" style={{ height: 230, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'linear-gradient(0deg,#AC80DF,rgba(172,128,223,.55))' }}
                animate={{ height: showResults ? `${p}%` : '0%' }} transition={T(i * 0.08, 1)} />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div className="num" style={{ fontSize: 86, lineHeight: 1 }}>{v}</div>
                {showResults && <div className="num" style={{ fontSize: 26, marginTop: 8, fontWeight: 500 }}>{p}%</div>}
              </div>
            </div>
            <div className="p2" style={{ fontSize: 20, marginTop: 12, minHeight: 30 }}>{v === '1' ? 'غير واثق إطلاقًا' : v === '5' ? 'واثق جدًا' : ''}</div>
          </div>
        );
      })}
    </motion.div>
  );
}

function PollStatus({ act, pollKey, data, participants }) {
  if (!act || act.kind !== 'poll' || act.key !== pollKey) return null;
  return (
    <div className="abs" style={{ right: 120, bottom: 90 }}>
      {act.status === 'open'
        ? <LiveBadge>التصويت مفتوح · <span className="num">{data?.total || 0}</span> صوّتوا{participants ? <> من <span className="num">{participants}</span></> : null}</LiveBadge>
        : <span className="p2">صوّت <span className="num">{data?.total || 0}</span> مشارك{data?.avg ? <> · المتوسط <span className="num">{data.avg.toFixed(1)}</span></> : null}</span>}
    </div>
  );
}

function Confidence({ step, state, stats, pollKey }) {
  const act = state?.activity;
  const data = stats?.polls?.[pollKey];
  const closed = act?.kind === 'poll' && act.key === pollKey && act.status === 'closed';
  const isPost = pollKey === 'conf_post';
  const compare = isPost && step >= 2;
  return (
    <>
      <motion.div layoutId="conf-q" className="abs" style={{ right: 120, top: 110, width: compare ? 1360 : 880 }} transition={T(0, 0.9)}>
        <div className="k"><i />{isPost ? 'نرجع لنفس السؤال' : 'قبل ما نبدأ'}</div>
        <div className="h3" style={{ marginTop: 22, fontSize: compare ? 46 : 56 }}>من 1 إلى 5، قد إيش أنت واثق إنك تقدر تصمم بنفسك؟</div>
      </motion.div>
      <AnimatePresence>
        {step >= 1 && !compare && <Scale key="scale" data={data} showResults={closed} />}
      </AnimatePresence>
      <AnimatePresence>
        {step >= (isPost ? 1 : 2) && !compare && !closed && <QRCard key="qr" style={{ left: 120, top: 250 }} />}
      </AnimatePresence>
      {!compare && <PollStatus act={act} pollKey={pollKey} data={data} participants={stats?.participants} />}
      {compare && <Compare pre={stats?.polls?.conf_pre} post={stats?.polls?.conf_post} />}
    </>
  );
}

function Compare({ pre, post }) {
  const rows = [{ label: 'بداية الورشة', d: pre, c: 'rgba(110,57,171,.35)' }, { label: 'نهاية الورشة', d: post, c: '#AC80DF' }];
  if (!pre?.total && !post?.total) {
    return <Reveal className="abs center p1" style={{ top: 420 }}>ما وصلت بيانات تصويت بعد.</Reveal>;
  }
  return (
    <motion.div layoutId="scale" className="abs" style={{ right: 120, left: 120, top: 300, display: 'flex', gap: 60 }} transition={T(0, 0.9)}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 34 }}>
        {rows.map((r, ri) => (
          <div key={r.label}>
            <div className="p2" style={{ marginBottom: 12, color: 'var(--fg)' }}>{r.label} · <span className="num">{r.d?.total || 0}</span> صوت</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', height: 150 }}>
              {['1', '2', '3', '4', '5'].map((v, i) => {
                const p = pct(r.d?.counts?.[v] || 0, r.d?.total || 0);
                return (
                  <div key={v} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                    <span className="num" style={{ fontSize: 20, fontWeight: 500 }}>{p}%</span>
                    <motion.div style={{ width: '100%', borderRadius: 10, background: r.c }} initial={{ height: 0 }} animate={{ height: `${Math.max(p, 2)}%` }} transition={T(ri * 0.5 + i * 0.07, 0.9)} />
                    <span className="num" style={{ fontSize: 22 }}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ width: 380, padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
        <div className="p2">متوسط الثقة</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, direction: 'ltr', justifyContent: 'flex-end' }}>
          <span className="num" style={{ fontSize: 64, color: 'var(--fg2)' }}>{pre?.avg ? pre.avg.toFixed(1) : '—'}</span>
          <span style={{ transform: 'scaleX(-1)', color: 'var(--fg2)' }}><ArrowL size={36} /></span>
          <span className="num" style={{ fontSize: 96, color: '#6E39AB' }}>{post?.avg ? post.avg.toFixed(1) : '—'}</span>
        </div>
        <div className="p2" style={{ fontSize: 20 }}>من 5 — أرقام حقيقية من تصويتكم</div>
      </div>
    </motion.div>
  );
}

/* ───────────────── 04 خارطة الرحلة ───────────────── */
const JOURNEY = [
  { t: 'نفهم', s: 'لماذا أدوبي؟ ومتى تكفيك كانفا؟' },
  { t: 'نواجه', s: 'خمسة مخاوف تمنعنا من البدء' },
  { t: 'نثبت', s: 'تصميمنا الأول بخمس أدوات' },
];
function Journey({ step }) {
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 120 }}>
        <div className="k"><i />خارطة الرحلة</div>
        <div className="h2" style={{ marginTop: 20 }}>رحلتنا اليوم من ثلاث خطوات</div>
      </Reveal>
      <motion.div layoutId="journey" className="abs" style={{ right: 160, left: 160, top: 430, height: 300 }} transition={T(0, 0.9)}>
        <svg className="abs" style={{ inset: 0 }} width="1280" height="300" viewBox="0 0 1280 300">
          <motion.line x1="1140" y1="70" x2="140" y2="70" stroke="#AC80DF" strokeWidth="3" strokeDasharray="1 0"
            initial={{ pathLength: 0 }} animate={{ pathLength: step >= 3 ? 1 : step === 2 ? 0.5 : 0 }} transition={T(0, 0.9)} />
        </svg>
        {JOURNEY.map((j, i) => (
          <Reveal key={j.t} show={step >= i + 1} className="abs" style={{ right: [0, 500, 1000][i] + 40 - 80, top: 0, width: 360, textAlign: 'center' }} delay={0.15}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', margin: '0 auto', background: i === 0 ? '#AC80DF' : 'var(--card)', border: '2px solid #AC80DF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 40px rgba(110,57,171,.18)' }}>
              <span className="num" style={{ fontSize: 50, color: i === 0 ? '#14031f' : '#6E39AB' }}>0{i + 1}</span>
            </div>
            <div className="h3" style={{ marginTop: 22 }}>{j.t}</div>
            <div className="p2" style={{ marginTop: 6 }}>{j.s}</div>
          </Reveal>
        ))}
      </motion.div>
    </>
  );
}

/* ───────────────── 05 كانفا وإلستريتر ───────────────── */
function CanvaArt() {
  return (
    <div style={{ position: 'relative', height: 170 }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="abs" style={{ right: 40 + i * 92, top: 18 + i * 10, width: 120, height: 150, borderRadius: 14, background: ['#AC80DF', '#fff', '#3F0B79'][i], border: '1.5px solid rgba(26,5,48,.12)', boxShadow: '0 10px 24px rgba(26,5,48,.12)', padding: 14 }}
          initial={{ opacity: 0, y: 20, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: (i - 1) * 6 }} transition={T(0.2 + i * 0.12)}>
          <div style={{ height: 10, width: '70%', marginInlineStart: 'auto', borderRadius: 5, background: i === 2 ? '#AC80DF' : '#1a0530', opacity: 0.8 }} />
          <div style={{ height: 6, width: '50%', marginInlineStart: 'auto', marginTop: 8, borderRadius: 3, background: i === 2 ? '#fff' : '#6E39AB', opacity: 0.6 }} />
          <div style={{ height: 54, marginTop: 14, borderRadius: 8, background: i === 1 ? '#F2F2F2' : 'rgba(255,255,255,.25)' }} />
        </motion.div>
      ))}
    </div>
  );
}
function IllustratorArt() {
  return (
    <svg width="420" height="170" viewBox="0 0 420 170" style={{ display: 'block', margin: '0 auto' }}>
      <motion.path d="M40 130 C 110 10, 220 10, 250 90 S 360 160, 390 50" fill="none" stroke="#6E39AB" strokeWidth="5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={T(0.2, 1.4)} />
      {[[40, 130], [250, 90], [390, 50]].map(([x, y], i) => (
        <motion.rect key={i} x={x - 8} y={y - 8} width="16" height="16" fill="#fff" stroke="#6E39AB" strokeWidth="2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={T(1 + i * 0.15)} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={T(1.5)}>
        <line x1="190" y1="38" x2="310" y2="142" stroke="#AC80DF" strokeWidth="1.6" />
        <circle cx="190" cy="38" r="6" fill="#AC80DF" /><circle cx="310" cy="142" r="6" fill="#AC80DF" />
      </motion.g>
    </svg>
  );
}
function Tools({ step }) {
  const split = step >= 1;
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 110 }}>
        <div className="k"><i />لماذا يختار المحترفون أدوبي؟</div>
      </Reveal>
      <motion.div layout className="abs center" style={split ? { top: 170 } : { top: 330 }} transition={T(0, 0.9)}>
        <motion.div layout className={split ? 'h3' : 'h1'} style={{ fontSize: split ? 60 : 104 }} transition={T(0, 0.9)}>كل تصميم له أداة تناسبه</motion.div>
        {!split && <Reveal className="p1" delay={0.4} style={{ marginTop: 18 }}>عندك مهمة تصميم… بأي أداة تبدأ؟</Reveal>}
      </motion.div>
      {split && (
        <>
          <motion.div className="abs" style={{ left: 799, top: 300, width: 2, background: 'var(--line)' }} initial={{ height: 0 }} animate={{ height: 420 }} transition={T(0.2, 0.8)} />
          {[
            { name: 'Canva', art: <CanvaArt />, pts: ['سرعة الإنجاز', 'القوالب الجاهزة', 'سهولة إنتاج المحتوى اليومي'], side: { right: 140 }, show: 2 },
            { name: 'Illustrator', art: <IllustratorArt />, pts: ['تصميم عناصر أصلية', 'تحكم دقيق', 'رسومات متجهة تكبر بدون ما تفقد جودتها'], side: { left: 140 }, show: 3 },
          ].map((c, ci) => (
            <motion.div key={c.name} className="abs" style={{ ...c.side, top: 290, width: 560 }} initial={{ opacity: 0, x: ci ? -60 : 60 }} animate={{ opacity: 1, x: 0 }} transition={T(0.3 + ci * 0.15)}>
              <div className="num" style={{ fontSize: 54, textAlign: 'center' }}>{c.name}</div>
              <div style={{ marginTop: 14 }}>{c.art}</div>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                {c.pts.map((p, i) => (
                  <Reveal key={p} show={step >= c.show} delay={i * 0.25} className="chip out" style={{ fontSize: 26 }}>{p}</Reveal>
                ))}
              </div>
            </motion.div>
          ))}
          <Reveal show={step >= 4} className="abs center" style={{ bottom: 60 }}>
            <span className="chip lav" style={{ fontSize: 30, padding: '16px 34px 20px' }}>مو مين الأفضل بشكل مطلق… بل أي أداة تناسب العمل اللي عندك</span>
          </Reveal>
        </>
      )}
    </>
  );
}

/* ───────────────── 06 سؤال الأداة ───────────────── */
const SITS = [
  { key: 'tool1', label: 'الموقف الأول', text: 'تبغى تنشئ إعلانًا سريعًا لفعالية باستخدام قالب جاهز.', ans: 'Canva' },
  { key: 'tool2', label: 'الموقف الثاني', text: 'تبغى ترسم رمزًا مخصصًا لعلامة تجارية، وتتحكم في تفاصيله.', ans: 'Illustrator' },
];
function WhichTool({ step, state, stats }) {
  const si = step >= 2 ? 1 : 0;
  const s = SITS[si];
  const revealed = step === 1 || step === 3;
  const data = stats?.polls?.[s.key];
  const act = state?.activity;
  const open = act?.kind === 'poll' && act.key === s.key && act.status === 'open';
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 110 }}>
        <div className="k"><i />سؤال سريع</div>
        <div className="h3" style={{ marginTop: 18 }}>وش الأداة الأنسب للمهمة؟</div>
      </Reveal>
      <motion.div layoutId="situation" className="abs card" style={{ right: 120, left: 120, top: 300, padding: '44px 56px', textAlign: 'right' }} transition={T(0, 0.9)}>
        <AnimatePresence mode="wait">
          <motion.div key={s.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={T(0, 0.5)}>
            <div className="p2 acc" style={{ fontWeight: 700 }}>{s.label}</div>
            <div className="h4" style={{ fontSize: 46, marginTop: 10 }}>{s.text}</div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="abs" style={{ right: 120, left: 120, top: 560, display: 'flex', gap: 30 }}>
        {['Canva', 'Illustrator'].map((o) => {
          const right = revealed && o === s.ans;
          const dim = revealed && o !== s.ans;
          const p = pct(data?.counts?.[o] || 0, data?.total || 0);
          return (
            <motion.div key={o} className="card" style={{ flex: 1, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, position: 'relative', overflow: 'hidden' }}
              animate={{ opacity: dim ? 0.35 : 1, scale: right ? 1.03 : 1, backgroundColor: right ? '#AC80DF' : 'rgba(255,255,255,1)' }} transition={T(0, 0.6)}>
              {right && <Check size={44} />}
              <span className="num" style={{ fontSize: 58, color: '#1a0530' }}>{o}</span>
              {!!data?.total && !open && <span className="num abs" style={{ left: 30, bottom: 22, fontSize: 26, color: '#6E39AB' }}>{p}%</span>}
            </motion.div>
          );
        })}
      </div>
      <div className="abs" style={{ right: 120, bottom: 70 }}>
        {open ? <LiveBadge>صوّتوا من جوالاتكم · <span className="num">{data?.total || 0}</span></LiveBadge>
          : revealed ? <span className="p2" style={{ color: 'var(--fg)' }}>{si === 0 ? 'القالب الجاهز يوفّر عليك الوقت.' : 'الرمز الخاص يحتاج تحكم كامل في كل نقطة.'}</span> : null}
      </div>
    </>
  );
}

/* ───────────────── 07 بوابة المخاوف ───────────────── */
function FearCard({ i, f, n, p, showCount, small }) {
  return (
    <motion.div layout layoutId={'fear-' + i} className="card" style={{ width: small ? 178 : 252, height: small ? 250 : 330, padding: small ? '22px 18px' : '30px 26px', display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', overflow: 'hidden' }} transition={T(0, 0.9)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6E39AB' }}><FearIcon name={f.icon} size={40} /></span>
        <span className="num" style={{ fontSize: 22, color: 'var(--fg2)' }}>0{i + 1}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: small ? 25 : 30, lineHeight: 1.35 }}>{f.short}</div>
      {showCount && (
        <div style={{ marginTop: 'auto' }}>
          <div style={{ height: 10, borderRadius: 5, background: 'rgba(172,128,223,.2)', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: '#AC80DF', borderRadius: 5 }} initial={{ width: 0 }} animate={{ width: p + '%' }} transition={T(0.3, 1)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span className="num" style={{ fontSize: 30 }}>{p}%</span>
            <span className="p2" style={{ fontSize: 18 }}><span className="num">{n}</span> صوت</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
function Fears({ step, state, stats }) {
  const act = state?.activity;
  const data = stats?.polls?.fears;
  const closed = act?.kind === 'poll' && act.key === 'fears' && act.status === 'closed';
  const open = act?.kind === 'poll' && act.key === 'fears' && act.status === 'open';
  let order = FEARS.map((f, i) => ({ f, i, n: data?.counts?.[String(i + 1)] || 0 }));
  if (closed) order = [...order].sort((a, b) => b.n - a.n || a.i - b.i);
  const voting = step >= 2 && !closed;
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 100 }}>
        <div className="k"><i />نواجه</div>
        <div className="h2" style={{ marginTop: 18, fontSize: 64 }}>خمسة مخاوف… <span className="acc">قد تكون هي اللي تؤخر بدايتك</span></div>
      </Reveal>
      {step >= 1 && (
        <motion.div layout className="abs" style={{ right: 120, left: voting ? 520 : 120, top: voting ? 300 : 340, display: 'flex', flexWrap: 'nowrap', gap: voting ? 14 : 20, justifyContent: 'flex-start' }} transition={T(0, 0.9)}>
          {order.map(({ f, i, n }, k) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={T(k * 0.12)}>
              <FearCard i={i} f={f} n={n} p={pct(n, data?.total)} showCount={closed} small={voting} />
            </motion.div>
          ))}
        </motion.div>
      )}
      <AnimatePresence>{voting && <QRCard key="qr" style={{ left: 120, top: 270 }} note="اختر الخوف الأقرب لك" />}</AnimatePresence>
      <div className="abs" style={{ right: 120, bottom: 60 }}>
        {open && <LiveBadge>التصويت مفتوح · <span className="num">{data?.total || 0}</span> صوّتوا</LiveBadge>}
        {closed && <span className="p2">صوّت <span className="num">{data?.total || 0}</span> مشارك — نبدأ بالترتيب اللي تختاره المدربة</span>}
      </div>
    </>
  );
}

/* ───────────────── رأس مشهد الخوف ───────────────── */
function FearHead({ i, big }) {
  const f = FEARS[i];
  return (
    <motion.div layout layoutId={'fear-' + i} className="abs" transition={T(0, 1)}
      style={big ? { left: 160, right: 160, top: 250, textAlign: 'center' } : { right: 120, top: 100, left: 520, textAlign: 'right' }}>
      <motion.div layout className="k" style={{ justifyContent: big ? 'center' : 'flex-start', color: big ? '#AC80DF' : undefined }}>
        <FearIcon name={f.icon} size={big ? 34 : 28} /> الخوف <span className="num">0{i + 1}</span>
      </motion.div>
      <motion.div layout style={{ fontWeight: 700, fontSize: big ? 92 : 44, lineHeight: 1.25, marginTop: big ? 30 : 14, color: big ? '#fff' : 'var(--fg2)' }}>«{f.full}»</motion.div>
    </motion.div>
  );
}

/* ───────────────── 08 الخوف 1 ───────────────── */
const PANEL = ['selection', 'direct', 'magic', 'lasso', 'pen', 'curvature', 'type', 'touchType', 'line', 'arc', 'rect', 'ellipse', 'polygon', 'star',
  'brush', 'pencil', 'eraser', 'scissors', 'rotate', 'scale', 'width', 'warp', 'shapeBuilder', 'gradient', 'mesh', 'eyedropper', 'blend', 'symbol',
  'graph', 'artboard', 'slice', 'hand', 'zoom', 'fill'];
const FIVE_KEYS = FIVE.map((t) => t.key);
function Fear1({ step }) {
  return (
    <>
      <FearHead i={0} big={step === 0} />
      <AnimatePresence>
        {(step === 1 || step === 2) && (
          <motion.div key="panel" className="abs" style={{ left: 200, top: 250, width: 300, padding: 22, borderRadius: 18, background: '#241a30', boxShadow: '0 30px 70px rgba(20,3,31,.35)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, direction: 'ltr' }}
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={T(0)}>
            {PANEL.map((k, i) => {
              const keep = FIVE_KEYS.includes(k);
              return (
                <motion.div key={k} layoutId={keep ? 'tool-' + k : undefined}
                  style={{ height: 54, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: keep && step === 2 ? '#14031f' : '#e7dcf5', background: keep && step === 2 ? '#AC80DF' : 'rgba(255,255,255,.04)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: step === 2 && !keep ? 0.12 : 1 }} transition={T(step === 1 ? i * 0.025 : 0, 0.5)}>
                  <Glyph name={k} size={26} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <Reveal show={step === 1} className="abs" style={{ right: 120, top: 420, width: 760 }}>
        <div className="h3" style={{ fontSize: 50 }}>أدوات كثيرة… وقوائم أكثر.</div>
        <div className="p1" style={{ marginTop: 14 }}>كثرة الأدوات تخلي المبتدئ يحس إنه لازم يعرف كل شيء من البداية.</div>
      </Reveal>
      <Reveal show={step >= 2} className="abs" style={{ right: 120, top: step >= 3 ? 250 : 420, width: 760 }} layout>
        <div className="h3" style={{ fontSize: 54 }}>ما تحتاج تعرف كل الأدوات <span className="acc">عشان تبدأ.</span></div>
      </Reveal>
      {step >= 3 && (
        <>
          <motion.div className="abs num" style={{ left: 150, top: 150, fontSize: 420, lineHeight: 1, color: '#AC80DF' }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={T(0, 0.9)}>5</motion.div>
          <Reveal className="abs" style={{ right: 120, top: 400, width: 760 }} delay={0.3}>
            <div className="h4" style={{ fontSize: 44 }}>5 أدوات تكفي لتصميمنا الأول.</div>
          </Reveal>
          <div className="abs" style={{ right: 120, left: 120, top: 560, display: 'flex', gap: 18, justifyContent: 'center' }}>
            {FIVE.map((t, i) => (
              <motion.div key={t.key} layoutId={'tool-' + t.key} className="card" style={{ width: 240, height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }} transition={T(i * 0.06, 0.9)}>
                <span style={{ color: '#6E39AB' }}><Glyph name={t.key} size={46} /></span>
                <span className="num" style={{ fontSize: 26 }}>{t.en}</span>
                <span className="p2" style={{ fontSize: 19 }}>{t.ar}</span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ───────────────── 09 الخوف 2 ───────────────── */
function Attempt({ v }) {
  const st = [
    { bg: '#e9e4ef', title: { size: 40, color: '#e34a8e', top: 50, align: 'center' }, circle: { r: 120, c: '#5fd1a7', x: 120, y: 260 }, bar: { c: '#f5b301', y: 420 }, extra: true },
    { bg: '#3F0B79', title: { size: 70, color: '#fff', top: 470, align: 'right' }, circle: { r: 200, c: '#AC80DF', x: 380, y: 260 }, bar: { c: '#fff', y: 620 }, extra: false },
    { bg: '#3F0B79', title: { size: 88, color: '#fff', top: 600, align: 'right' }, circle: { r: 280, c: '#AC80DF', x: 470, y: 160 }, bar: { c: '#fff', y: 730 }, extra: false, sub: true },
  ][v];
  return (
    <svg viewBox="0 0 540 675" width="230" height="288" style={{ display: 'block', borderRadius: 8, boxShadow: '0 16px 40px rgba(26,5,48,.16)' }}>
      <rect width="540" height="675" fill={st.bg} />
      <circle cx={st.circle.x} cy={st.circle.y} r={st.circle.r} fill={st.circle.c} />
      {st.extra && <><rect x="300" y="120" width="160" height="160" fill="#3f8cff" transform="rotate(12 380 200)" /><circle cx="430" cy="520" r="70" fill="#ff7a2f" /></>}
      <rect x={st.extra ? 60 : 200} y={st.bar.y - 300} width={st.extra ? 420 : 290} height="10" fill={st.bar.c} />
      <text x={st.title.align === 'center' ? 270 : 490} y={st.title.top} direction="rtl" textAnchor={st.title.align === 'center' ? 'middle' : 'start'} fontFamily="Asal" fontWeight="700" fontSize={st.title.size} fill={st.title.color}>أول خطوة</text>
      {st.sub && <text x="490" y="400" direction="rtl" textAnchor="start" fontFamily="Asal" fontWeight="700" fontSize="34" fill="#AC80DF">في عالم التصميم</text>}
    </svg>
  );
}
function Fear2({ step }) {
  return (
    <>
      <FearHead i={1} big={step === 0} />
      <Reveal show={step >= 1} className="abs" style={{ right: 120, top: 250 }}>
        <div className="h3" style={{ fontSize: 54 }}>التصميم مهارة <span className="acc">تتطور بالممارسة.</span></div>
      </Reveal>
      {step >= 1 && (
        <div className="abs" style={{ right: 120, left: 120, top: 335, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
          {[0, 1, 2].map((v) => (
            <div key={v} style={{ display: 'contents' }}>
              {v > 0 && <motion.span style={{ color: 'var(--fg2)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={T(0.4 + v * 0.6)}><ArrowL size={40} /></motion.span>}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={T(0.2 + v * 0.6)} style={{ textAlign: 'center' }}>
                <Attempt v={v} />
                <div className="p2" style={{ marginTop: 12, color: 'var(--fg)' }}>المحاولة <span className="num">{v + 1}</span></div>
              </motion.div>
            </div>
          ))}
        </div>
      )}
      <Reveal show={step >= 2} className="abs center" style={{ bottom: 50 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 30, fontWeight: 700, fontSize: 46 }}>
          <span style={{ position: 'relative', color: 'var(--fg2)' }}>ما عندي موهبة
            <motion.span className="abs" style={{ left: -6, right: -6, top: '55%', height: 4, background: '#6E39AB', transformOrigin: 'right' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={T(0.4, 0.6)} />
          </span>
          <span style={{ color: 'var(--fg2)' }}><ArrowL size={40} /></span>
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={T(1)}><Sel delay={1.1}>أقدر أتعلم</Sel></motion.span>
        </div>
        <div className="p2" style={{ marginTop: 14 }}>ابدأ بمهارة واحدة، وطورها تدريجيًا.</div>
      </Reveal>
    </>
  );
}

/* ───────────────── 10 الخوف 3 ───────────────── */
const PRICE_CARDS = [
  { t: 'برنامج واحد يكفي', d: 'اشترك في البرنامج اللي تحتاجه بدل مجموعة البرامج كاملة.', icon: 'rect' },
  { t: 'جرّب قبل ما تدفع', d: 'استفد من التجربة المجانية وفق شروط Adobe الرسمية.', icon: 'star' },
  { t: 'خصومات التعليم', d: 'إذا كنت طالبًا أو معلمًا، شوف إذا تنطبق عليك الخصومات.', icon: 'artboard' },
];
function Fear3({ step }) {
  return (
    <>
      <FearHead i={2} big={step === 0} />
      <Reveal show={step >= 1} className="abs" style={{ right: 120, top: 250, width: 1100 }}>
        <div className="h3" style={{ fontSize: 54 }}>ابدأ بما تحتاجه، <span className="acc">ولا تدفع مقابل أدوات ما تستخدمها.</span></div>
      </Reveal>
      <div className="abs" style={{ right: 120, left: 120, top: 400, display: 'flex', gap: 26 }}>
        {PRICE_CARDS.map((c, i) => (
          <Reveal key={c.t} show={step >= i + 2} className="card" style={{ flex: 1, padding: '34px 34px 30px', minHeight: 230 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(172,128,223,.18)', color: '#6E39AB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Glyph name={c.icon} size={34} /></div>
            <div className="h4" style={{ fontSize: 36, marginTop: 20 }}>{c.t}</div>
            <div className="p2" style={{ marginTop: 8, fontSize: 23 }}>{c.d}</div>
          </Reveal>
        ))}
      </div>
      <Reveal show={step >= 5} className="abs" style={{ right: 120, left: 120, bottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 32px', borderRadius: 22, background: '#1a0530', color: '#fff' }}>
          <span style={{ color: '#AC80DF' }}><Warn size={36} /></span>
          <span style={{ fontWeight: 700, fontSize: 28 }}>انتبه من الاشتراكات غير الرسمية</span>
          <span style={{ fontSize: 23, color: 'rgba(255,255,255,.72)' }}>اللي تعدك بترخيص دائم أو «مدى الحياة» بسعر رمزي.</span>
        </div>
      </Reveal>
    </>
  );
}

/* ───────────────── 11 الخوف 4 ───────────────── */
const SKILLS = [
  { t: 'الفكرة', d: 'وش أبغى أوصل؟' },
  { t: 'التكوين', d: 'كيف أرتب العناصر؟' },
  { t: 'الذوق البصري', d: 'هل النتيجة جميلة ومناسبة؟' },
  { t: 'اتخاذ القرار', d: 'أي خيار يخدم الهدف؟' },
];
function Fear4({ step }) {
  return (
    <>
      <FearHead i={3} big={step === 0} />
      <Reveal show={step >= 1} className="abs" style={{ right: 120, top: 260 }}>
        <div className="h3" style={{ fontSize: 54 }}>الأدوات تتغير… <span className="acc">لكن فهم التصميم يظل مهمًا.</span></div>
      </Reveal>
      {step >= 1 && (
        <motion.div layout className="abs" style={{ right: 120, left: 120, top: step >= 2 ? 380 : 420, display: 'flex', gap: 22 }} transition={T(0, 0.8)}>
          {SKILLS.map((s, i) => (
            <motion.div key={s.t} layout className="card" style={{ flex: 1, padding: step >= 2 ? '22px 26px' : '40px 30px', textAlign: 'center' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={T(0.2 + i * 0.18)}>
              <motion.div layout className="h4" style={{ fontSize: step >= 2 ? 32 : 44 }}>{s.t}</motion.div>
              {step < 2 && <div className="p2" style={{ marginTop: 10, fontSize: 22 }}>{s.d}</div>}
            </motion.div>
          ))}
        </motion.div>
      )}
      <Reveal show={step >= 2} className="abs" style={{ right: 120, left: 120, top: 560 }} delay={0.3}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          {[['الذكاء الاصطناعي', 'يقترح فكرة أولية'], ['أنت', 'تختار الأنسب'], ['أنت', 'تعدّل حسب الهدف']].map(([a, b], i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <span style={{ color: 'var(--fg2)' }}><ArrowL size={38} /></span>}
              <motion.div className="card" style={{ padding: '26px 34px', textAlign: 'center', minWidth: 300, background: i ? '#AC80DF' : undefined, borderColor: i ? '#AC80DF' : undefined }}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={T(0.4 + i * 0.4)}>
                <div style={{ fontWeight: 700, fontSize: 32, color: i ? '#14031f' : undefined }}>{a}</div>
                <div style={{ fontSize: 24, marginTop: 6, color: i ? '#3F0B79' : 'var(--fg2)' }}>{b}</div>
              </motion.div>
            </div>
          ))}
        </div>
        <div className="p2 center" style={{ position: 'static', marginTop: 24 }}>القرار يبقى قرارك… وهذا اللي يعلّمه لك فهم التصميم.</div>
      </Reveal>
    </>
  );
}

/* ───────────────── 12 الخوف 5 ───────────────── */
const STATIONS = [
  { t: 'الأدوات', d: 'تعرّف على الأدوات الأساسية للبرنامج.' },
  { t: 'الأسس', d: 'الألوان، والتكوين، والخطوط، والتسلسل البصري.' },
  { t: 'ملف الأعمال', d: 'طبّق على مشاريع متنوعة واجمع أفضل أعمالك.' },
];
function Fear5({ step }) {
  const xs = [1260, 800, 340];
  const reach = step >= 4 ? 2 : step >= 3 ? 1 : step >= 2 ? 0 : -1;
  return (
    <>
      <FearHead i={4} big={step === 0} />
      <Reveal show={step >= 1} className="abs" style={{ right: 120, top: 250 }}>
        <div className="h3" style={{ fontSize: 54 }}>خلّها <span className="acc">ثلاث خطوات واضحة.</span></div>
      </Reveal>
      {step >= 1 && (
        <svg className="abs" style={{ left: 0, top: 420 }} width="1600" height="60" viewBox="0 0 1600 60">
          <motion.line x1={xs[0]} y1="30" x2={reach >= 0 ? xs[reach] : xs[0]} y2="30" stroke="#AC80DF" strokeWidth="4" strokeLinecap="round"
            initial={false} animate={{ x2: reach >= 0 ? xs[reach] : xs[0] }} transition={T(0, 0.9)} />
          <motion.circle cx={xs[0]} cy="30" r="14" fill="#6E39AB" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={T(0.2)} />
          {xs.map((x, i) => reach >= i && (
            <motion.circle key={i} cx={x} cy="30" r="22" fill="#AC80DF" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={T(0.7)} />
          ))}
        </svg>
      )}
      {STATIONS.map((s, i) => (
        <Reveal key={s.t} show={reach >= i} delay={0.6} className="abs" style={{ left: xs[i] - 190, top: 500, width: 380, textAlign: 'center' }}>
          <div className="num" style={{ fontSize: 34, color: '#6E39AB' }}>0{i + 1}</div>
          <div className="h3" style={{ fontSize: 50, marginTop: 6 }}>{s.t}</div>
          <div className="p2" style={{ marginTop: 8, fontSize: 23 }}>{s.d}</div>
        </Reveal>
      ))}
    </>
  );
}

/* ───────────────── 13 الاستبيان ───────────────── */
function Survey({ step, state, stats }) {
  const act = state?.activity;
  const open = act?.kind === 'survey' && act.status === 'open';
  const n = stats?.survey?.total || 0;
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 200, width: 860 }}>
        <div className="k"><i />قبل التطبيق</div>
        <div className="h2" style={{ marginTop: 22, fontSize: 80 }}>وش ودك تتعلم <span className="acc">بعد أول خطوة؟</span></div>
        <div className="p1" style={{ marginTop: 22 }}>شاركنا رأيك في 5 أسئلة تساعدنا على تقديم دورات تناسب اهتماماتك.</div>
      </Reveal>
      <Reveal show={step >= 1} className="abs" style={{ right: 120, top: 600 }}>
        <span className="chip lav" style={{ fontSize: 34, padding: '16px 34px 20px' }}><span className="num">5</span> أسئلة فقط</span>
      </Reveal>
      <AnimatePresence>{step >= 2 && <QRCard key="qr" style={{ left: 140, top: 190 }} note="سؤال واحد في كل شاشة" />}</AnimatePresence>
      <Reveal show={step >= 2} className="abs" style={{ right: 120, bottom: 90 }}>
        {open ? <LiveBadge>الاستبيان مفتوح · <span className="num">{n}</span> رد</LiveBadge> : <span className="p2">الردود: <span className="num">{n}</span></span>}
      </Reveal>
    </>
  );
}

/* ───────────────── 14 التمهيد ───────────────── */
function Preview({ step }) {
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 200, width: 760 }}>
        <div className="k"><i />نثبت</div>
        <div className="h2" style={{ marginTop: 22, fontSize: 74 }}>هل نقدر نصمم شيئًا جميلًا <span className="acc">بخمس أدوات فقط؟</span></div>
      </Reveal>
      <div className="abs" style={{ left: 230, top: 120 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="blank" layoutId="design" style={{ width: 420, aspectRatio: '1080 / 1350', background: '#fff', borderRadius: 6, boxShadow: '0 30px 80px rgba(20,3,31,.18)' }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={T(0)} />
          )}
          {step >= 2 && <motion.div key="d" initial={{ opacity: 1 }} animate={{ opacity: 1 }}><Design width={420} layoutId="design" delay={0.3} /></motion.div>}
        </AnimatePresence>
      </div>
      <Reveal show={step >= 3} className="abs" style={{ right: 120, top: 560 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <span className="num" style={{ fontSize: 140, lineHeight: 1, color: '#6E39AB' }}>15</span>
          <span className="h3" style={{ fontSize: 52 }}>دقيقة — من الصفر</span>
        </div>
      </Reveal>
    </>
  );
}

/* ───────────────── 15 التطبيق المباشر ───────────────── */
function Live({ step }) {
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 150 }}>
        <div className="k"><i />تطبيق مباشر في Illustrator</div>
        <div className="h2" style={{ marginTop: 22, fontSize: 84 }}>من صفحة بيضاء… <span className="acc">إلى أول تصميم</span></div>
      </Reveal>
      <div className="abs" style={{ left: 130, top: 120, opacity: 0.95 }}><Design width={230} layoutId="design" build={false} /></div>
      {step >= 1 && (
        <div className="abs" style={{ right: 120, left: 120, top: 500, display: 'flex', gap: 18 }}>
          {FIVE.map((t, i) => (
            <motion.div key={t.key} layoutId={'tool-' + t.key} className="card" style={{ flex: 1, height: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'rgba(255,255,255,.06)' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={T(i * 0.12)}>
              <span style={{ color: '#AC80DF' }}><Glyph name={t.key} size={50} /></span>
              <span className="num" style={{ fontSize: 28 }}>{t.en}</span>
              <span style={{ fontSize: 21, color: 'rgba(255,255,255,.7)' }}>{t.ar}</span>
              <span className="num" style={{ fontSize: 18, padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,.25)', fontWeight: 500 }}>{t.short}</span>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

/* ───────────────── 16 بداية المسابقة ───────────────── */
function QuizIntro({ step }) {
  return (
    <>
      <motion.div className="abs center" style={{ top: step >= 1 ? 90 : 160, display: 'flex', justifyContent: 'center', gap: 26, transition: 'top .8s' }}>
        {[1, 2, 3, 4, 5].map((n, i) => (
          <motion.div key={n} className="num" style={{ width: 96, height: 96, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, border: '2px solid #AC80DF' }}
            initial={{ opacity: 0, y: 40, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1, backgroundColor: ['rgba(172,128,223,0)', 'rgba(172,128,223,1)', 'rgba(172,128,223,0)'] }}
            transition={{ delay: 0.2 + i * 0.22, duration: 0.8, ease: EASE }}>{n}</motion.div>
        ))}
      </motion.div>
      <Reveal className="abs center" style={{ top: step >= 1 ? 220 : 330, transition: 'top .8s' }} delay={1.5}>
        <div className="h1" style={{ fontSize: step >= 1 ? 80 : 100, transition: 'font-size .8s' }}>جاهزين لتحدّي <Sel delay={2}>أول خطوة؟</Sel></div>
      </Reveal>
      <Reveal className="abs center" style={{ top: step >= 1 ? 380 : 540, transition: 'top .8s' }} delay={2.4}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
          {[<><span className="num">5</span> أسئلة سريعة</>, 'اختبر وش تعلمت', 'واجمع أكبر عدد من النقاط'].map((t, i) => (
            <span key={i} className="chip out" style={{ fontSize: 30, borderColor: 'rgba(255,255,255,.3)' }}>{t}</span>
          ))}
        </div>
      </Reveal>
      <AnimatePresence>{step >= 1 && <QRCard key="qr" style={{ left: 635, top: 480 }} size={190} note="ادخل من نفس الرابط" />}</AnimatePresence>
    </>
  );
}

/* ───────────────── 17 المسابقة ───────────────── */
const LETTERS = ['A', 'B', 'C'];
function Quiz({ state, stats, now }) {
  const act = state?.activity?.kind === 'quiz' ? state.activity : null;
  const view = state?.view || 'scene';
  if (view === 'leaderboard') return <Leaderboard rows={stats?.quiz?.leaderboard || []} />;
  if (view === 'winners') return <Winners rows={(stats?.quiz?.leaderboard || []).slice(0, 3)} />;
  if (!act) {
    return (
      <>
        <Reveal className="abs center" style={{ top: 330 }}>
          <div className="k" style={{ justifyContent: 'center' }}><i />المسابقة</div>
          <div className="h1" style={{ marginTop: 24, fontSize: 96 }}>استعدوا… السؤال الأول</div>
          <div className="p1" style={{ marginTop: 18 }}>متصلين الآن: <span className="num">{stats?.online || 0}</span></div>
        </Reveal>
      </>
    );
  }
  const pq = stats?.quiz?.perQuestion?.[act.q];
  const answered = pq?.answered || 0;
  const left = act.status === 'open' ? Math.max(0, Math.ceil((act.openedAt + act.seconds * 1000 - now) / 1000)) : 0;
  const frac = act.status === 'open' ? left / act.seconds : 0;
  const showDist = act.status !== 'open';
  return (
    <>
      <div className="abs" style={{ right: 120, top: 80, display: 'flex', alignItems: 'center', gap: 18 }}>
        <span className="chip lav" style={{ fontSize: 24 }}>السؤال <span className="num">{act.q + 1}</span> من <span className="num">{QUIZ_COUNT}</span></span>
        <span className="p2" style={{ fontSize: 22 }}>أجاب <span className="num">{answered}</span>{stats?.online ? <> من <span className="num">{stats.online}</span></> : null}</span>
      </div>
      <div className="abs" style={{ left: 120, top: 60, width: 130, height: 130 }}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="56" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="8" />
          <motion.circle cx="65" cy="65" r="56" fill="none" stroke="#AC80DF" strokeWidth="8" strokeLinecap="round" transform="rotate(-90 65 65)"
            strokeDasharray={2 * Math.PI * 56} animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - frac) }} transition={{ duration: 0.25 }} />
        </svg>
        <div className="abs num" style={{ inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46 }}>{act.status === 'open' ? left : <Check size={44} />}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={'q' + act.q} className="abs" style={{ right: 120, left: 300, top: 200 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={T(0, 0.6)}>
          <div className="h2" style={{ fontSize: 62 }}>{act.question.text}</div>
        </motion.div>
      </AnimatePresence>
      <div className="abs" style={{ right: 120, left: 120, top: 400, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {act.question.options.map((o, i) => {
          const correct = act.status === 'revealed' && act.answer === i;
          const wrong = act.status === 'revealed' && act.answer !== i;
          const n = pq?.counts?.[i] || 0;
          const p = pct(n, answered);
          return (
            <motion.div key={act.q + '-' + i} style={{ position: 'relative', height: 92, borderRadius: 22, overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 22, padding: '0 28px', border: '1.5px solid ' + (correct ? '#AC80DF' : 'rgba(255,255,255,.16)'), background: correct ? '#AC80DF' : 'rgba(255,255,255,.05)', color: correct ? '#14031f' : '#fff' }}
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: wrong ? 0.4 : 1, x: 0 }} transition={T(0.15 + i * 0.1, 0.5)}>
              {showDist && !correct && <motion.div className="abs" style={{ right: 0, top: 0, bottom: 0, background: 'rgba(172,128,223,.18)' }} initial={{ width: 0 }} animate={{ width: p + '%' }} transition={T(0, 0.8)} />}
              <span className="num" style={{ position: 'relative', width: 50, height: 50, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: correct ? '#14031f' : 'rgba(172,128,223,.25)', color: correct ? '#AC80DF' : '#fff' }}>{LETTERS[i]}</span>
              <span style={{ position: 'relative', fontWeight: 700, fontSize: 34, flex: 1 }}>{o}</span>
              {correct && <span style={{ position: 'relative' }}><Check size={40} /></span>}
              {showDist && <span className="num" style={{ position: 'relative', fontSize: 28, fontWeight: 500 }}>{p}%</span>}
            </motion.div>
          );
        })}
      </div>
      <Reveal show={act.status === 'revealed'} className="abs" style={{ right: 120, left: 120, bottom: 50 }} delay={0.4}>
        <div style={{ padding: '20px 30px', borderRadius: 20, background: 'rgba(255,255,255,.08)', borderInlineStart: '5px solid #AC80DF', fontSize: 27, lineHeight: 1.5, fontWeight: 500 }}>{act.explain}</div>
      </Reveal>
    </>
  );
}

function Leaderboard({ rows }) {
  return (
    <>
      <Reveal className="abs" style={{ right: 120, top: 80 }}>
        <div className="k"><i />المتصدرون</div>
        <div className="h3" style={{ marginTop: 14 }}>ترتيب المسابقة</div>
      </Reveal>
      <div className="abs" style={{ right: 120, left: 120, top: 230, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoFlow: 'column', gridTemplateRows: 'repeat(5, 1fr)', gap: '14px 30px' }}>
        {rows.length === 0 && <div className="p1">لا توجد إجابات بعد.</div>}
        {rows.map((r, i) => (
          <motion.div key={r.pid} layout style={{ height: 96, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', background: i < 3 ? 'rgba(172,128,223,.22)' : 'rgba(255,255,255,.05)', border: '1.5px solid rgba(255,255,255,.12)' }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={T(i * 0.08, 0.6)}>
            <span className="num" style={{ fontSize: 34, width: 44, color: '#AC80DF' }}>{r.rank}</span>
            <span style={{ fontWeight: 700, fontSize: 32, flex: 1 }}>{r.nickname}</span>
            <span className="num" style={{ fontSize: 32 }}>{r.score}</span>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function Winners({ rows }) {
  const pod = [rows[1], rows[0], rows[2]];
  const h = [230, 320, 170];
  return (
    <>
      <Reveal className="abs center" style={{ top: 90 }}>
        <div className="k" style={{ justifyContent: 'center' }}><i />الفائزون</div>
        <div className="h2" style={{ marginTop: 16 }}>مبروك لأبطال <Sel delay={0.6}>أول خطوة</Sel></div>
      </Reveal>
      <div className="abs" style={{ left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 26, direction: 'ltr' }}>
        {pod.map((r, i) => (
          <motion.div key={i} style={{ width: 340, textAlign: 'center' }} initial={{ opacity: 0, y: 120 }} animate={{ opacity: 1, y: 0 }} transition={T([0.8, 1.4, 0.3][i], 0.9)}>
            <div style={{ fontWeight: 700, fontSize: 38, marginBottom: 6 }}>{r?.nickname || '—'}</div>
            <div className="num" style={{ fontSize: 26, color: 'rgba(255,255,255,.7)', marginBottom: 16 }}>{r ? r.score + ' pts' : ''}</div>
            <div style={{ height: h[i], borderRadius: '24px 24px 0 0', background: i === 1 ? '#AC80DF' : 'rgba(172,128,223,.35)', display: 'flex', justifyContent: 'center', paddingTop: 22 }}>
              <span className="num" style={{ fontSize: 90, color: i === 1 ? '#14031f' : '#fff' }}>{[2, 1, 3][i]}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ───────────────── 19 الختام ───────────────── */
function Closing() {
  return (
    <>
      <motion.div layoutId="geo" className="abs" style={{ left: 735, top: 120, width: 60, height: 60, background: '#AC80DF' }} transition={T(0, 1.2)} />
      <motion.div className="abs" style={{ left: 805, top: 120, width: 60, height: 60, borderRadius: '50%', background: '#B949F5' }} initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={T(0.3, 1.1)} />
      <motion.div className="abs" style={{ left: 735, top: 190, width: 130, height: 10, background: '#fff' }} initial={{ y: 300, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={T(0.5, 1.1)} />
      <Reveal className="abs center" style={{ top: 300 }} delay={1.3}>
        <div className="h1" style={{ fontSize: 100 }}>كل مصمم محترف…<br /><Sel delay={2}>بدأ بخطوة أولى.</Sel></div>
      </Reveal>
      <Reveal className="abs center p1" style={{ top: 600, fontSize: 36, color: '#e5d6f8' }} delay={2.8}>مو لازم تكون البداية مثالية، المهم إنها تبدأ.</Reveal>
      <Reveal className="abs center" style={{ bottom: 60 }} delay={3.6}>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,.7)' }}>شكرًا لحضوركم ومشاركتكم.</div>
        <div style={{ fontWeight: 700, fontSize: 30, marginTop: 10 }}>أمل القحطاني</div>
        <div style={{ fontSize: 20, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>مصممة جرافيك ومدربة معتمدة من Adobe</div>
      </Reveal>
    </>
  );
}

/* ───────────────── التجميع ───────────────── */
export const SCENE_VIEWS = {
  opening: Opening,
  question: Question,
  conf_pre: (p) => <Confidence {...p} pollKey="conf_pre" />,
  journey: Journey,
  tools: Tools,
  which_tool: WhichTool,
  fears: Fears,
  fear1: Fear1,
  fear2: Fear2,
  fear3: Fear3,
  fear4: Fear4,
  fear5: Fear5,
  survey: Survey,
  preview: Preview,
  live: Live,
  quiz_intro: QuizIntro,
  quiz: Quiz,
  conf_post: (p) => <Confidence {...p} pollKey="conf_post" />,
  closing: Closing,
};

// المشاهد الداكنة: الافتتاح والسؤال، والخوف وهو مسيطر، والتطبيق والمسابقة والختام
export function themeOf(id, step) {
  if (['opening', 'question', 'live', 'quiz_intro', 'quiz', 'closing'].includes(id)) return 'dark';
  if (id.startsWith('fear') && id !== 'fears' && step === 0) return 'dark';
  return 'light';
}

export const NEEDS_STATS = new Set(['conf_pre', 'which_tool', 'fears', 'survey', 'quiz', 'conf_post', 'quiz_intro']);

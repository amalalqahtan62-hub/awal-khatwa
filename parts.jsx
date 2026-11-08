'use client';
import { AnimatePresence, motion } from 'framer-motion';
import QR, { useJoinUrl, shortUrl } from '../QR';
import { Phone } from '../icons';
import { PARTS } from '@/lib/scenes';

export const EASE = [0.2, 0.8, 0.2, 1];

// كشف تدريجي: يظهر العنصر عند الخطوة المطلوبة
export function Reveal({ show = true, children, delay = 0, y = 26, x = 0, scale = 1, className, style, layout, layoutId, ...rest }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={className}
          style={style}
          layout={layout}
          layoutId={layoutId}
          initial={{ opacity: 0, y, x, scale }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -y / 2, transition: { duration: 0.35 } }}
          transition={{ duration: 0.7, delay, ease: EASE }}
          {...rest}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// كلمة محددة بإطار ومقابض (عنصر من هوية البوستر)
export function Sel({ children, delay = 0, draw = true }) {
  const h = [{ right: -10, top: '12%' }, { left: -10, top: '12%' }, { right: -10, bottom: '-12%' }, { left: -10, bottom: '-12%' }];
  return (
    <span className="sel">
      <motion.span className="f" initial={draw ? { scaleX: 0 } : false} animate={{ scaleX: 1 }} transition={{ delay, duration: 0.8, ease: EASE }} />
      {children}
      {h.map((p, i) => (
        <motion.u key={i} style={p} initial={draw ? { opacity: 0, scale: 0 } : false} animate={{ opacity: 1, scale: 1 }} transition={{ delay: delay + 0.7 + i * 0.05 }} />
      ))}
    </span>
  );
}

export function QRCard({ style, note = 'نفس الرابط طوال الورشة', layoutId = 'qr', size = 250 }) {
  const url = useJoinUrl();
  return (
    <motion.div className="qr abs" style={style} layoutId={layoutId}
      initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7, ease: EASE }}>
      <div className="t"><Phone size={26} />شارك الآن</div>
      <QR size={size} />
      <div className="u">{shortUrl(url)}</div>
      <div className="s">{note}</div>
    </motion.div>
  );
}

export function JourneyHUD({ part }) {
  return (
    <motion.div className="hud" layoutId="journey" transition={{ duration: 0.8, ease: EASE }}>
      {PARTS.map((p, i) => (
        <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {i > 0 && <span className="l" />}
          <span className={'n' + (i === part ? ' on' : '')}><span className="d" />{p}</span>
        </div>
      ))}
    </motion.div>
  );
}

export function LiveBadge({ children }) {
  return <span className="live-badge"><i />{children}</span>;
}

export const pct = (n, t) => (t ? Math.round((n / t) * 100) : 0);

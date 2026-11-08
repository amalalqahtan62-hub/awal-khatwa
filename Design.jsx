'use client';
import { motion } from 'framer-motion';

// التصميم اللي تنفّذه المدربة في التطبيق المباشر (1080×1350)
// مبني فقط من: Rectangle · Ellipse · Type · Fill · Selection
export const DESIGN_SPEC = [
  { tool: 'Rectangle', what: 'الخلفية', detail: '0,0 — 1080×1350 — لون #3F0B79' },
  { tool: 'Ellipse', what: 'دائرة كبيرة', detail: '720×720 — مركزها (900, 260) — لون #AC80DF' },
  { tool: 'Ellipse', what: 'دائرة صغيرة', detail: '260×260 — مركزها (170, 1120) — لون #B949F5' },
  { tool: 'Rectangle', what: 'شريط', detail: '440,790 — 520×18 — لون #FFFFFF' },
  { tool: 'Type', what: 'العنوان', detail: '«أول خطوة» — 150pt — أبيض' },
  { tool: 'Type', what: 'السطر الثاني', detail: '«في عالم التصميم» — 64pt — #AC80DF' },
  { tool: 'Type', what: 'سطر صغير', detail: '«بدأت اليوم» — 34pt — أبيض 70%' },
];

export default function Design({ build = true, width = 360, delay = 0, layoutId }) {
  const d = (i) => ({
    initial: build ? { opacity: 0, scale: 0.92 } : false,
    animate: { opacity: 1, scale: 1 },
    transition: { delay: build ? delay + i * 0.45 : 0, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  });
  return (
    <motion.div layoutId={layoutId} style={{ width, aspectRatio: '1080 / 1350', boxShadow: '0 30px 80px rgba(20,3,31,.28)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
      <svg viewBox="0 0 1080 1350" width="100%" height="100%" style={{ display: 'block' }} aria-label="التصميم">
        <defs><clipPath id="art"><rect width="1080" height="1350" /></clipPath></defs>
        <g clipPath="url(#art)">
          <motion.rect {...d(0)} x="0" y="0" width="1080" height="1350" fill="#3F0B79" />
          <motion.circle {...d(1)} style={{ originX: '900px', originY: '260px' }} cx="900" cy="260" r="360" fill="#AC80DF" />
          <motion.circle {...d(2)} style={{ originX: '170px', originY: '1120px' }} cx="170" cy="1120" r="130" fill="#B949F5" />
          <motion.rect {...d(3)} x="440" y="790" width="520" height="18" fill="#fff" />
          <motion.text {...d(4)} x="960" y="700" textAnchor="start" direction="rtl" fontFamily="Asal" fontWeight="700" fontSize="150" fill="#fff">أول خطوة</motion.text>
          <motion.text {...d(5)} x="960" y="890" textAnchor="start" direction="rtl" fontFamily="Asal" fontWeight="700" fontSize="64" fill="#AC80DF">في عالم التصميم</motion.text>
          <motion.text {...d(6)} x="960" y="1010" textAnchor="start" direction="rtl" fontFamily="Asal" fontWeight="500" fontSize="34" fill="rgba(255,255,255,.7)">بدأت اليوم</motion.text>
        </g>
      </svg>
    </motion.div>
  );
}

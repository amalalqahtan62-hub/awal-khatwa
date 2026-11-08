// أيقونات خطية بسيطة بأسلوب الهوية (رسومات أصلية، بدون شعارات تجارية)
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const ToolGlyphs = {
  selection: <path d="M5 3l14 8.5-6.2 1.3L10 19z" fill="currentColor" stroke="none" />,
  direct: <path d="M5 3l14 8.5-6.2 1.3L10 19z" {...P} />,
  magic: <><path d="M4 20L15 9" {...P} /><path d="M17 3v3M15.5 4.5h3M20 8v2M19 9h2" {...P} /></>,
  lasso: <><ellipse cx="13" cy="9" rx="7" ry="4.5" {...P} /><path d="M7 12c-1 2 0 4 2 4l-1 4" {...P} /></>,
  pen: <><path d="M12 3l5.5 11-5.5 6-5.5-6z" {...P} /><circle cx="12" cy="12.5" r="1.6" {...P} /><path d="M12 3v8" {...P} /></>,
  curvature: <><path d="M4 18C7 6 17 6 20 18" {...P} /><circle cx="12" cy="9" r="1.5" fill="currentColor" stroke="none" /></>,
  type: <path d="M5 5h14M12 5v14M9 19h6" {...P} />,
  touchType: <><path d="M6 6h9M10.5 6v11" {...P} /><path d="M15 13l4 4" {...P} /></>,
  line: <path d="M5 19L19 5" {...P} />,
  arc: <path d="M5 19C5 10 10 5 19 5" {...P} />,
  rect: <rect x="4.5" y="6" width="15" height="12" rx="1" {...P} />,
  ellipse: <ellipse cx="12" cy="12" rx="8" ry="6.5" {...P} />,
  polygon: <path d="M12 4l7.5 5.5-3 9h-9l-3-9z" {...P} />,
  star: <path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" {...P} />,
  brush: <><path d="M20 4L10 14" {...P} /><path d="M10 14c-3 0-4 2-4 5 2.5 0 5-1 5-4" {...P} /></>,
  pencil: <path d="M5 19l1-4L16 5l3 3L9 18z M14 7l3 3" {...P} />,
  eraser: <path d="M8 19h11M5 15l8-8 5 5-6 6H8z" {...P} />,
  scissors: <><circle cx="7" cy="17" r="2.5" {...P} /><circle cx="17" cy="17" r="2.5" {...P} /><path d="M8.5 15L18 4M15.5 15L6 4" {...P} /></>,
  rotate: <><path d="M19 12a7 7 0 1 1-2-4.9" {...P} /><path d="M19 4v4h-4" {...P} /></>,
  scale: <><rect x="4" y="10" width="10" height="10" {...P} /><path d="M12 4h8v8M20 4l-7 7" {...P} /></>,
  width: <><path d="M4 12c4-6 12-6 16 0" {...P} /><path d="M9 9l-2 6M15 9l2 6" {...P} /></>,
  warp: <path d="M4 8c4-3 6 3 8 0s4-3 8 0M4 16c4-3 6 3 8 0s4-3 8 0" {...P} />,
  shapeBuilder: <><circle cx="9" cy="12" r="5" {...P} /><circle cx="15" cy="12" r="5" {...P} /></>,
  gradient: <><rect x="4" y="6" width="16" height="12" {...P} /><path d="M4 18L20 6" {...P} /></>,
  mesh: <><rect x="4" y="5" width="16" height="14" {...P} /><path d="M4 12h16M12 5v14" {...P} /></>,
  eyedropper: <path d="M14 4l6 6-2 2-6-6zM12 8l-7 7v4h4l7-7" {...P} />,
  blend: <><circle cx="7" cy="12" r="3" {...P} /><circle cx="17" cy="12" r="3" {...P} /><path d="M10 12h4" {...P} /></>,
  symbol: <path d="M7 17c0-3 2-4 5-4s5-1 5-4M8 7h0M16 17h0" {...P} />,
  graph: <path d="M5 19V9M10 19V5M15 19v-7M20 19v-4" {...P} />,
  artboard: <><rect x="6" y="6" width="12" height="12" {...P} /><path d="M3 6h2M19 6h2M6 3v2M6 19v2" {...P} /></>,
  slice: <path d="M6 18L18 6M12 18l6-6" {...P} />,
  hand: <path d="M8 12V6a1.5 1.5 0 0 1 3 0v5m0-1V5a1.5 1.5 0 0 1 3 0v6m0-1a1.5 1.5 0 0 1 3 0v4c0 3-2 6-6 6h-1c-3 0-4-2-6-5l-1.5-2.5c.8-1 2.5-1 3.5.5z" {...P} />,
  zoom: <><circle cx="10.5" cy="10.5" r="5.5" {...P} /><path d="M15 15l5 5" {...P} /></>,
  fill: <><rect x="4" y="4" width="11" height="11" fill="currentColor" stroke="none" /><rect x="9" y="9" width="11" height="11" {...P} /></>,
};

// الأدوات الخمس للتطبيق المباشر
export const FIVE = [
  { key: 'selection', en: 'Selection', ar: 'التحديد والتحريك', short: 'V' },
  { key: 'rect', en: 'Rectangle', ar: 'المستطيل', short: 'M' },
  { key: 'ellipse', en: 'Ellipse', ar: 'الدائرة', short: 'L' },
  { key: 'type', en: 'Type', ar: 'النص', short: 'T' },
  { key: 'fill', en: 'Fill Color', ar: 'لون التعبئة', short: 'Fill' },
];

export function Glyph({ name, size = 24, style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden>
      {ToolGlyphs[name]}
    </svg>
  );
}

export const FearIcons = {
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" {...P} /><rect x="14" y="4" width="6" height="6" rx="1" {...P} /><rect x="4" y="14" width="6" height="6" rx="1" {...P} /><rect x="14" y="14" width="6" height="6" rx="1" {...P} /></>,
  spark: <path d="M12 3c.8 4.5 3.7 7.4 8 8-4.3.6-7.2 3.5-8 9-.8-5.5-3.7-8.4-8-9 4.3-.6 7.2-3.5 8-8z" {...P} />,
  tag: <><path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8z" {...P} /><circle cx="8.5" cy="8.5" r="1.4" {...P} /></>,
  ai: <><rect x="6" y="6" width="12" height="12" rx="2" {...P} /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" {...P} /><path d="M10 14l1.5-4h1L14 14M10.6 12.6h2.8" {...P} /></>,
  path: <><circle cx="5" cy="18" r="2" {...P} /><circle cx="19" cy="6" r="2" {...P} /><path d="M7 18c6 0 3-12 10-12" {...P} strokeDasharray="2 3" /></>,
};

export function FearIcon({ name, size = 28 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>{FearIcons[name]}</svg>;
}

export const Check = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden><path d="M5 12.5l4.5 4.5L19 7" {...P} strokeWidth={2.6} /></svg>
);
export const Phone = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden><rect x="7" y="3" width="10" height="18" rx="2.5" {...P} /><path d="M11 18h2" {...P} /></svg>
);
export const Warn = ({ size = 26 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden><path d="M12 4l9 16H3z" {...P} /><path d="M12 10v4M12 17h0" {...P} strokeWidth={2.4} /></svg>
);
export const ArrowL = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden><path d="M19 12H5M11 6l-6 6 6 6" {...P} /></svg>
);

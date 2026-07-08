// ─── DESIGN TOKENS ──────────────────────────────────────────────────
export const C = {
  brand:   '#EC4899',   // Pink-500 — primary identity accent
  brandH:  '#DB2777',   // Pink-600 hover
  bLight:  '#FCE7F3',   // Pink-100 tint
  bMid:    '#FBCFE8',   // Pink-200
  green:   '#0EA5E9',   // Sky-500 — secondary accent
  greenH:  '#0284C7',   // Sky-600 hover
  gLight:  '#E0F2FE',   // Sky-100 tint
  page:    '#FAFAFA',   // Outer page bg
  card:    '#FFFFFF',   // Card / container
  head:    '#121214',   // Heading text
  body:    '#52525B',   // Body text
  muted:   '#A1A1AA',   // Muted text
  bdr:     '#E4E4E7',   // Border
  sub:     '#F4F4F5',   // Section divider
};

// Primary CTA gradient
export const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';
export const SIDEBAR_GRAD = 'linear-gradient(to bottom, #132238, #17304d, #1b1b3a)';
export const SKY_300 = '#7DD3FC';
export const SKY_400 = '#38BDF8';

// ─── TYPE SYSTEM ─────────────────────────────────────────────────────
export const FONT_DISPLAY = "'Sora', 'Inter', sans-serif";
export const FONT_BODY    = "'Inter', sans-serif";
export const FONT_MONO    = "'JetBrains Mono', 'Menlo', monospace";

export const SMOOTH_EASE = [0.16, 1, 0.3, 1];

// ─── ELEVATION SYSTEM ────────────────────────────────────────────────
export const SHADOW = {
  xs:   '0 1px 2px rgba(18,18,20,0.05)',
  sm:   '0 2px 8px rgba(18,18,20,0.05), 0 1px 2px rgba(236,72,153,0.04)',
  md:   '0 8px 24px rgba(18,18,20,0.07), 0 2px 8px rgba(236,72,153,0.05)',
  lg:   '0 20px 48px rgba(18,18,20,0.12), 0 4px 16px rgba(236,72,153,0.08)',
  glow: '0 10px 30px rgba(236,72,153,0.35), 0 4px 14px rgba(249,115,22,0.20)',
  navy: '0 20px 50px rgba(19,34,56,0.35)',
};

// ─── MOTION SYSTEM ────────────────────────────────────────────────────
export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: EASE },
});

export const lift = {
  y: -6,
  scale: 1.012,
  transition: { type: 'spring', stiffness: 320, damping: 22 }
};
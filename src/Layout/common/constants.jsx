// ─── DESIGN TOKENS ──────────────────────────────────────────────────
export const C = {
  body: '#1C1C1C', // Near Black
  page: '#F9FAFB', // Primary Background (Soft Gray)
  card: '#FFFFFF', // White
  bdr: '#F3F4F6', // Very Light Gray
  textSec: '#6B7280', // Secondary Text (Gray)
  head: '#111827', // Near Black
};

// Primary CTA gradient
export const CTA_GRAD = 'linear-gradient(to right, #EC4899, #F43F5E, #F97316)';
export const SIDEBAR_GRAD = 'linear-gradient(to bottom, #132238, #17304d, #1b1b3a)';
export const SKY_300 = '#7DD3FC';
export const SKY_400 = '#38BDF8';


export const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";

// export const CTA_GRAD = "linear-gradient(to right, #000000, #374151, #EC4899, #F97316)";
export const ACTIVE_GRAD_CLASSES = "bg-gradient-to-br from-gray-900 via-gray-800 to-pink-500";
export const TEXT_GRAD_CLASSES = "bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-pink-500";


// ─── TYPE SYSTEM ─────────────────────────────────────────────────────
export const FONT_DISPLAY = "'Sora', 'Inter', sans-serif";
// export const FONT_BODY    = "'Inter', sans-serif";
export const FONT_MONO    = "'JetBrains Mono', 'Menlo', monospace";

export const SMOOTH_EASE = [0.16, 1, 0.3, 1];

// ─── ELEVATION SYSTEM ────────────────────────────────────────────────
export const SHADOW = { 
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
  premium: '0 8px 30px rgba(0, 0, 0, 0.08)'
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
export const CTA_GRAD = "linear-gradient(135deg, #0F172A, #334155)";

export const fadeUp = (delay = 0) => ({ 
  initial: { opacity: 0, y: 20 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.5, ease: "easeOut", delay } 
});
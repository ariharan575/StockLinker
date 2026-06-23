// ============================================================================
// MOTION & ANIMATION CONFIGURATIONS (Ultra-Premium SaaS Easing)
// ============================================================================
export const PREMIUM_EASE = [0.16, 1, 0.3, 1];

export const containerVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.05, 
      delayChildren: 0.1, 
      ease: PREMIUM_EASE 
    } 
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.6, 
      ease: PREMIUM_EASE 
    } 
  }
};

export const cardHover = {
  hover: { 
    y: -4, 
    scale: 1.01, 
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    borderColor: "rgba(226, 232, 240, 1)",
    transition: { duration: 0.4, ease: PREMIUM_EASE } 
  }
};
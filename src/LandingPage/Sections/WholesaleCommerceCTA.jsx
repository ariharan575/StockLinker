import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ============================================================================
// PREMIUM GLASS CARD (White Mode)
// ============================================================================

const GlassCard = React.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-[34px] border border-slate-200/60 bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

// ============================================================================
// MAGNETIC BUTTON
// ============================================================================

const MagneticButton = React.forwardRef(
  ({ children, primary = false, className = "", ...props }, ref) => {
    const buttonRef = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = {
      damping: 18,
      stiffness: 180,
      mass: 0.5,
    };

    const elasticX = useSpring(x, springConfig);
    const elasticY = useSpring(y, springConfig);

    const handleMouseMove = (e) => {
      if (!buttonRef.current) return;

      const { clientX, clientY } = e;
      const rect = buttonRef.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      x.set((clientX - centerX) * 0.22);
      y.set((clientY - centerY) * 0.22);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const baseStyles =
      "inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 cursor-pointer";

    const primaryStyles =
      "bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 text-white shadow-sm hover:shadow-[0_8px_25px_rgba(14,165,233,0.25)] hover:scale-[1.02]";

    const secondaryStyles =
      "bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900";

    return (
      <motion.button
        ref={buttonRef}
        style={{ x: elasticX, y: elasticY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.96 }}
        className={`${baseStyles} ${
          primary ? primaryStyles : secondaryStyles
        } ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

// ============================================================================
// FLOATING PARTICLE (Static Entry for White Mode)
// ============================================================================

const FloatingParticle = ({ delay = 0, size = 6, left = "50%" }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: 0.4,
        y: -20,
      }}
      transition={{
        duration: 2,
        delay,
        ease: "easeOut",
      }}
      style={{
        left,
        width: size,
        height: size,
      }}
      className="absolute bottom-10 rounded-full bg-cyan-500/20 blur-[1px]"
    />
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WholesaleCommerceCTA({
  badgeText = "India’s Smartest B2B Marketplace",
  titleText = "StockLinker Powers The Future Of Wholesale Buying.",
  descriptionText = "Connect retailers, wholesalers, and distributors through one intelligent commerce platform. Compare live wholesale prices instantly, discover trusted suppliers faster, and scale operations with AI-powered inventory intelligence.",
  primaryBtnText = "Start Free Today",
  secondaryBtnText = "Book Live Demo",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  features = [
    "Realtime Price Discovery",
    "Verified Wholesale Network",
    "AI Smart Inventory",
    "Tamil & Multi-Language Ready",
  ],
}) {
  const containerRef = useRef(null);

  // Animation Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.18,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.98,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
      },
    },
  };

  return (

    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 60,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 w-full mx-auto "
      >
        <GlassCard className="p-8 sm:p-10 md:p-16 lg:p-20 xl:m-25 ">
          {/* Border Glow */}
          <div className="absolute inset-0 rounded-[34px] border border-white/80" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] via-transparent to-fuchsia-500/[0.02]" />

          {/* Rings */}
          <motion.div
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{
              duration: 2.5,
              ease: "easeOut",
            }}
            className="absolute -right-32 -top-32 hidden h-96 w-96 rounded-full border border-dashed border-slate-200/80 lg:block"
          />

          {/* ================================================================= */}
          {/* CONTENT */}
          {/* ================================================================= */}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              whileHover={{
                scale: 1.04,
              }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50/80 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700 backdrop-blur-md"
            >
              <motion.svg
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: "backOut",
                  delay: 0.5,
                }}
                className="h-3.5 w-3.5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </motion.svg>

              {badgeText}
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              className="mt-8 max-w-5xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-slate-900 via-cyan-800 to-fuchsia-800 bg-clip-text text-transparent">
                {titleText}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-7 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl md:leading-[1.8]"
            >
              {descriptionText}
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
            >
              <MagneticButton
                primary
                onClick={onPrimaryClick}
                className="group w-full justify-center sm:w-auto"
              >
                {primaryBtnText}

                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </MagneticButton>

              <MagneticButton
                onClick={onSecondaryClick}
                className="w-full justify-center sm:w-auto"
              >
                {secondaryBtnText}
              </MagneticButton>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={itemVariants}
              className="mt-16 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-5 border-t border-slate-100 pt-8"
            >
              {features.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.8 + index * 0.08,
                    duration: 0.5,
                  }}
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="group flex items-center gap-2.5"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>

                  <span className="text-sm font-medium tracking-wide text-slate-500 transition-colors duration-300 group-hover:text-slate-900 sm:text-base">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </GlassCard>
      </motion.div>
      </>
  );
}
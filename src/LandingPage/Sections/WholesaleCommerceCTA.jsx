import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

// ============================================================================
// PREMIUM GLASS CARD
// ============================================================================

const GlassCard = React.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.60)] ${className}`}
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
      "inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer";

    const primaryStyles =
      "bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 text-white shadow-[0_14px_45px_rgba(56,189,248,0.24)] hover:scale-[1.02]";

    const secondaryStyles =
      "bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.07] hover:border-cyan-400/20";

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
// FLOATING PARTICLE
// ============================================================================

const FloatingParticle = ({ delay = 0, size = 6, left = "50%" }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={{
        opacity: [0, 0.7, 0],
        y: [-20, -120],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
      style={{
        left,
        width: size,
        height: size,
      }}
      className="absolute bottom-0 rounded-full bg-cyan-400/30 blur-[2px]"
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
      y: 50,
      scale: 0.96,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 120,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#050816] px-4 py-24 sm:px-6 md:px-8"
    >
      {/* ================================================================= */}
      {/* PREMIUM SAAS BACKGROUND */}
      {/* ================================================================= */}

      {/* Main Gradient */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.10),transparent_28%)]"
      />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:90px_90px]" />

      {/* Glow Orbs */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 left-[-10%] h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-[140px]"
      />

      <motion.div
        animate={{
          x: [20, -20, 20],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] right-[-10%] h-[480px] w-[480px] rounded-full bg-fuchsia-500/18 blur-[150px]"
      />

      {/* Light Beam */}
      <motion.div
        animate={{
          x: ["-20%", "120%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 h-full w-[220px] rotate-12 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent blur-3xl"
      />

      {/* Floating Particles */}
      <FloatingParticle delay={0} left="14%" size={5} />
      <FloatingParticle delay={2} left="34%" size={7} />
      <FloatingParticle delay={1} left="58%" size={6} />
      <FloatingParticle delay={3} left="82%" size={5} />

      {/* ================================================================= */}
      {/* MAIN CARD */}
      {/* ================================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 80,
          scale: 0.94,
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
        className="relative z-10 w-full max-w-7xl"
      >
        <GlassCard className="p-7 sm:p-10 md:p-16 lg:p-20">
          {/* Border Glow */}
          <div className="absolute inset-0 rounded-[34px] border border-white/[0.05]" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-fuchsia-500/[0.07]" />

          {/* Rings */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -right-32 -top-32 hidden h-96 w-96 rounded-full border border-dashed border-white/[0.04] lg:block"
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
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300 backdrop-blur-md"
            >
              <motion.svg
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
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
              className="mt-8 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-white via-cyan-100 to-fuchsia-100 bg-clip-text text-transparent">
                {titleText}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-7 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg md:leading-[1.9]"
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
              className="mt-16 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-5 border-t border-white/[0.06] pt-8"
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
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                  </span>

                  <span className="text-xs font-medium tracking-wide text-slate-400 transition-colors duration-300 group-hover:text-white sm:text-sm">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
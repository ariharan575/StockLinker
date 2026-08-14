import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { 
  Store, Search, Layers, CheckCircle, Package, Map, ArrowRight, 
  TrendingUp, Truck, Box, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';



// Premium Apple-style Easing Curve
const easePremium = [0.16, 1, 0.3, 1];

// --- Premium Tilt Card with Dynamic Spotlight ---
const TiltCard = ({ children, className, glowColor }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // For tilt
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);

    // For spotlight
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative h-full w-full rounded-[32px] bg-white/70 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col will-change-transform translate-z-0 ${className}`}
    >
      {/* Dynamic Hover Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* Subtle Static Gradient for depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

      {/* Content Container (Lifted for 3D effect) */}
      <div 
        className="relative z-10 flex flex-col h-full p-6 sm:p-8 lg:p-10"
        style={{ transform: "translateZ(30px)" }}
      >
        {children}
      </div>
    </motion.div>
  );
};

// --- Animations (Optimized for GPU) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: easePremium } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const featuresStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.05, 
      delayChildren: 0.3,
    }
  }
};

const premiumFeatureReveal = {
  hidden: { 
    opacity: 0, 
    y: 15, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20, 
      mass: 0.8 
    } 
  },
};

const premiumIconReveal = {
  hidden: { 
    opacity: 0, 
    scale: 0.5, 
    rotate: -45 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 250, 
      damping: 16,
      mass: 1,
      delay: 0.05
    } 
  }
};

const iconHoverVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: 8, transition: { type: "spring", stiffness: 400, damping: 10 } }
};

const itemHoverVariants = {
  rest: { x: 0 },
  hover: { x: 6, transition: { type: "spring", stiffness: 400, damping: 20 } }
};

// --- Premium Feature Item ---
const PremiumFeature = ({ text, theme }) => {
  const isBlue = theme === 'blue';
  
  return (
    <motion.div 
      variants={premiumFeatureReveal}
      className="flex items-center gap-3 sm:gap-4 w-full cursor-default will-change-transform translate-z-0"
    >
      <motion.div 
        initial="rest"
        whileHover="hover"
        animate="rest"
        variants={itemHoverVariants}
        className="flex items-center gap-3 sm:gap-4 w-full"
      >
        <motion.div 
          variants={premiumIconReveal}
          className={`flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-md ${
            isBlue 
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/25 border border-blue-300/50' 
              : 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/25 border border-purple-300/50'
          }`}
        >
          <motion.div variants={iconHoverVariants} className="flex items-center justify-center w-full h-full transform-gpu">
            <Check size={14} strokeWidth={3} className="text-white" />
          </motion.div>
        </motion.div>
        <span className="text-[14px] md:text-[15px] lg:text-[16px] font-medium text-slate-700 tracking-tight lg:whitespace-nowrap whitespace-normal transition-colors duration-200 hover:text-slate-900">
          {text}
        </span>
      </motion.div>
    </motion.div>
  );
};

// --- Workflow Component ---
const WorkflowLine = ({ steps, theme }) => {
  const isBlue = theme === 'blue';
  
  return (
    <div className="flex items-center justify-between w-full mt-auto pt-8 border-t border-slate-200/60 relative z-10">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <motion.div 
            className="flex flex-col items-center gap-2 z-10 group will-change-transform translate-z-0"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white border shadow-sm transition-colors duration-300 ${
              isBlue 
                ? 'border-blue-100 text-blue-500 group-hover:border-blue-300 group-hover:shadow-blue-500/20' 
                : 'border-purple-100 text-purple-500 group-hover:border-purple-300 group-hover:shadow-purple-500/20'
            }`}>
              <step.icon size={18} />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-slate-400 group-hover:text-slate-600 transition-colors">
              {step.label}
            </span>
          </motion.div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 h-[2px] mx-2 sm:mx-4 bg-slate-100 relative top-[-10px] rounded-full overflow-hidden">
              <motion.div 
                className={`absolute top-0 left-0 h-full w-full origin-left ${
                  isBlue ? 'bg-gradient-to-r from-blue-300 to-blue-500' : 'bg-gradient-to-r from-purple-300 to-purple-500'
                }`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: 0.6 + (index * 0.2), ease: easePremium }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function RoleExperienceSection() {

  const navigate = useNavigate();


  const shopkeeperFeatures = [
    "Search products across nearby wholesalers",
    "Compare wholesale prices instantly",
    "Find the cheapest supplier automatically",
    "Discover trusted nearby wholesalers",
    "Compare delivery time before ordering",
    "Check live stock availability",
    "View minimum order quantity",
    "Save favourite suppliers",
    "Smart reorder suggestions",
    "Track every wholesale order",
    "Receive instant stock alerts",
    "Build long-term supplier connections"
  ];

  const wholesalerFeatures = [
    "Receive wholesale orders instantly",
    "Manage retailer orders efficiently",
    "Accept or reject orders quickly",
    "Optimize delivery routes automatically",
    "Track delivery status live",
    "Manage inventory in one place",
    "Expand retailer network",
    "Grow repeat business",
    "Smart wholesale analytics",
    "Faster order fulfillment",
    "Better customer relationships",
    "Increase business revenue"
  ];

  const shopkeeperSteps = [
    { icon: Search, label: "Search" },
    { icon: Layers, label: "Compare" },
    { icon: Store, label: "Select" },
    { icon: CheckCircle, label: "Confirm" }
  ];

  const supplierSteps = [
    { icon: Box, label: "Receive" },
    { icon: CheckCircle, label: "Confirm" },
    { icon: Map, label: "Route" },
    { icon: Truck, label: "Deliver" }
  ];

  return (
    <section className="relative w-full bg-slate-50 text-slate-900 py-24 sm:py-32 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-[100px] opacity-60 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-purple-200/40 blur-[120px] opacity-60 mix-blend-multiply" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[800px] h-[400px] rounded-full bg-gray-100/50 blur-[80px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* LEFT PANEL: SHOPKEEPERS */}
          <motion.div variants={fadeInUp} style={{ perspective: 2000 }} className="group h-full">
            <TiltCard glowColor="rgba(59, 130, 246, 0.08)">
              
              {/* Header Elements */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                  <Store size={16} strokeWidth={2.5} /> 
                  For Shopkeepers
                </div>
                <h3 className="text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] font-bold tracking-tight text-slate-900 mb-2">
                  Discover.<br />Compare.<br />Order Smarter.
                </h3>
              </div>

              {/* Feature Checklist */}
              <motion.div 
                className="flex flex-col gap-3 sm:gap-4 mb-12 flex-1"
                variants={featuresStaggerContainer}
              >
                {shopkeeperFeatures.map((feature, idx) => (
                  <PremiumFeature key={idx} text={feature} theme="blue" />
                ))}
              </motion.div>

              {/* Workflow & Button Container */}
              <div className="mt-auto flex flex-col gap-8">
                <WorkflowLine steps={shopkeeperSteps} theme="blue" />

                <motion.button 
                  onClick={() => navigate('/documentation?section=shopkeeper-dashboard')}
                  className="group/btn relative flex items-center justify-center gap-3 w-full py-4 sm:py-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[15px] sm:text-[16px] font-semibold shadow-lg shadow-blue-500/20 transition-all overflow-hidden hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] transform-gpu"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10">Explore Shopkeeper Experience</span>
                  <motion.div 
                    className="relative z-10"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </motion.div>
                </motion.button>
              </div>

            </TiltCard>
          </motion.div>

          {/* RIGHT PANEL: WHOLESALERS */}
          <motion.div variants={fadeInUp} style={{ perspective: 2000 }} className="group h-full">
            <TiltCard glowColor="rgba(168, 85, 247, 0.08)">
              
              {/* Header Elements */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                  <Truck size={16} strokeWidth={2.5} /> 
                  For Wholesalers
                </div>
                <h3 className="text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] font-bold tracking-tight text-slate-900 mb-2">
                  Manage.<br />Deliver.<br />Grow Faster.
                </h3>
              </div>

              {/* Feature Checklist */}
              <motion.div 
                className="flex flex-col gap-3 sm:gap-4 mb-12 flex-1"
                variants={featuresStaggerContainer}
              >
                {wholesalerFeatures.map((feature, idx) => (
                  <PremiumFeature key={idx} text={feature} theme="purple" />
                ))}
              </motion.div>

              {/* Workflow & Button Container */}
              <div className="mt-auto flex flex-col gap-8">
                <WorkflowLine steps={supplierSteps} theme="purple" />

                <motion.button 
                  onClick={() => navigate('/documentation?section=wholesaler-dashboard')}
                  className="group/btn relative flex items-center justify-center gap-3 w-full py-4 sm:py-5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[15px] sm:text-[16px] font-semibold shadow-lg shadow-purple-500/20 transition-all overflow-hidden hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98] transform-gpu"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10">Explore Supplier Experience</span>
                  <motion.div 
                    className="relative z-10"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </motion.div>
                </motion.button>
              </div>

            </TiltCard>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
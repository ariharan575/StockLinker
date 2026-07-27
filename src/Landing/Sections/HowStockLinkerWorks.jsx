'use client';

import React, { useRef } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useReducedMotion 
} from 'framer-motion';
import {
  Search,
  Scale,
  Handshake,
  MessageCircle,
  Package,
  ShoppingCart,
  ClipboardCheck,
  Truck,
  Receipt,
  TrendingUp,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

// ==========================================
// DATA CONFIGURATION (10 STEPS)
// ==========================================

const TIMELINE_STEPS = [
  {
    id: 1,
    badge: 'STEP 01',
    title: 'Discover Nearby Wholesalers',
    description: 'Find nearby verified wholesalers based on location, categories, ratings, delivery coverage, and verified business credentials.',
    icon: Search,
    tags: ['Location Search', 'Verified Ratings', 'Delivery Coverage', 'Business Profile'],
    highlightColor: 'from-blue-500 to-cyan-500',
    glowGradient: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 2,
    badge: 'STEP 02',
    title: 'Compare Suppliers',
    description: 'Compare multiple wholesalers side-by-side to evaluate pricing, minimum order quantities, and stock availability.',
    icon: Scale,
    tags: ['Wholesale Price', 'Bulk Offers', 'MOQ', 'Stock Availability', 'Delivery Options'],
    highlightColor: 'from-cyan-500 to-teal-500',
    glowGradient: 'rgba(20, 184, 166, 0.15)'
  },
  {
    id: 3,
    badge: 'STEP 03',
    title: 'Connect With Wholesalers',
    description: 'Create trusted supplier relationships through direct business connections and verified network approval.',
    icon: Handshake,
    tags: ['Verified Network', 'Direct Connection', 'Supplier Trust'],
    highlightColor: 'from-teal-500 to-emerald-500',
    glowGradient: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 4,
    badge: 'STEP 04',
    title: 'Business Chat',
    description: 'Instant, secure in-app business messaging to facilitate smooth commercial negotiations and inquiries.',
    icon: MessageCircle,
    tags: ['Price Negotiation', 'Product Enquiry', 'Custom Offers', 'Availability', 'Delivery Schedule'],
    highlightColor: 'from-emerald-500 to-indigo-500',
    glowGradient: 'rgba(99, 102, 241, 0.15)'
  },
  {
    id: 5,
    badge: 'STEP 05',
    title: 'Browse Digital Catalog',
    description: 'Explore rich, organized interactive product catalogs complete with real-time stock levels and pricing tiers.',
    icon: Package,
    tags: ['Images', 'Categories', 'Brands', 'Wholesale Pricing', 'Live Stock'],
    highlightColor: 'from-indigo-500 to-violet-500',
    glowGradient: 'rgba(139, 92, 246, 0.15)'
  },
  {
    id: 6,
    badge: 'STEP 06',
    title: 'Place Wholesale Order',
    description: 'Seamless digital ordering workflow tailored for high-volume wholesale purchasing.',
    icon: ShoppingCart,
    tags: ['Cart', 'Quantity', 'Notes', 'Confirmation'],
    highlightColor: 'from-violet-500 to-purple-500',
    glowGradient: 'rgba(168, 85, 247, 0.15)'
  },
  {
    id: 7,
    badge: 'STEP 07',
    title: 'Order Confirmation',
    description: 'Wholesaler instantly receives order details and transitions status through full fulfillment pipeline.',
    icon: ClipboardCheck,
    workflow: ['Pending', 'Accepted', 'Preparing', 'Packed'],
    highlightColor: 'from-purple-500 to-fuchsia-500',
    glowGradient: 'rgba(217, 70, 239, 0.15)'
  },
  {
    id: 8,
    badge: 'STEP 08',
    title: 'Delivery Tracking',
    description: 'Real-time logistics monitoring providing end-to-end transparency from warehouse dispatch to arrival.',
    icon: Truck,
    workflow: ['Dispatched', 'Out For Delivery', 'Delivered'],
    highlightColor: 'from-fuchsia-500 to-pink-500',
    glowGradient: 'rgba(236, 72, 153, 0.15)'
  },
  {
    id: 9,
    badge: 'STEP 09',
    title: 'Orders, Invoices & Repeat Orders',
    description: 'Comprehensive financial records management with automated digital invoices and rapid reordering.',
    icon: Receipt,
    tags: ['Order History', 'Digital Invoice', 'Download Invoice', 'Previous Purchases', 'One Click Repeat Order'],
    highlightColor: 'from-pink-500 to-rose-500',
    glowGradient: 'rgba(244, 63, 94, 0.15)'
  },
  {
    id: 10,
    badge: 'STEP 10',
    title: 'Grow Your Business',
    description: 'Strengthen supplier relationships, save time, reduce purchasing costs, and scale your business faster.',
    icon: TrendingUp,
    tags: ['Supplier Relationships', 'Save Time', 'Reduce Purchasing Costs', 'Scale Business Faster'],
    highlightColor: 'from-rose-500 to-amber-500',
    glowGradient: 'rgba(245, 158, 11, 0.15)'
  }
];

// ==========================================
// ANIMATION VARIANTS (Optimized for GPU)
// ==========================================
const easePremium = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: (isEven) => ({
    opacity: 0,
    x: isEven ? -40 : 40,
    y: 20,
    scale: 0.96 // Replaced blur with subtle scale for a premium entry feel
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easePremium,
    },
  },
};

const nodeVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 0.1,
    },
  },
};

// ==========================================
// STEP CARD SUBCOMPONENT
// ==========================================

const StepCard = ({ step, isEven, shouldReduceMotion }) => {
  const IconComponent = step.icon;

  return (
    <motion.div
      custom={isEven}
      variants={shouldReduceMotion ? {} : cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`group relative w-full rounded-2xl p-6 md:p-8 transition-all duration-500 will-change-transform translate-z-0
        bg-white/80 dark:bg-zinc-900/60 
        backdrop-blur-xl 
        border border-zinc-200/80 dark:border-zinc-800/80
        shadow-xl shadow-zinc-950/5 dark:shadow-black/40
        hover:border-zinc-300 dark:hover:border-zinc-700
        hover:shadow-2xl hover:shadow-indigo-500/10
      `}
      style={{
        backgroundImage: `radial-gradient(circle at ${isEven ? '100% 0%' : '0% 0%'}, ${step.glowGradient}, transparent 70%)`
      }}
    >
      {/* Dynamic Highlight Border Effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 dark:border-white/5 pointer-events-none" />

      {/* Header Badge & Dynamic Icon */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60">
          {step.badge}
        </span>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${step.highlightColor} bg-opacity-10 text-white shadow-sm group-hover:scale-110 transition-transform duration-300 transform-gpu`}>
          <IconComponent className="w-5 h-5 text-zinc-900 dark:text-zinc-100 group-hover:rotate-6 transition-transform duration-300" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal">
        {step.description}
      </p>

      {/* Tags Array */}
      {step.tags && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          {step.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-100/80 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/40 transition-colors duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Workflow Visualization */}
      {step.workflow && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
            Process Pipeline
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {step.workflow.map((status, index) => (
              <div
                key={status}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/40"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {status}
                  </span>
                </div>
                {index < step.workflow.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-zinc-400 hidden sm:block shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// MAIN TIMELINE COMPONENT
// ==========================================

export default function HowStockLinkerWorks() {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress calculations for animated line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 20%', 'end 85%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-14 md:py-24 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-300"
      aria-label="How StockLinker Works Timeline"
    >
      {/* Background Ambient Mesh Subtle Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easePremium }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-4 will-change-transform translate-z-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            End-To-End B2B Platform
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easePremium, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 will-change-transform translate-z-0"
          >
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">StockLinker</span> Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easePremium, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed will-change-transform translate-z-0"
          >
            Streamlining wholesale commerce. Connect, negotiate, order, and grow your retail business in one unified ecosystem.
          </motion.p>
        </div>

        {/* Timeline Structure Container */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Central Background Line */}
          <div 
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800/80 -translate-x-1/2" 
            aria-hidden="true" 
          />

          {/* Animated Scroll Progress Gradient Line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-amber-500 -translate-x-1/2 shadow-[0_0_12px_rgba(99,102,241,0.6)] origin-top z-0 will-change-transform transform-gpu"
            aria-hidden="true"
          />

          {/* Timeline Steps */}
          <div className="space-y-12 md:space-y-20">
            {TIMELINE_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.id}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content Card Column */}
                  <div className="w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0">
                    <StepCard step={step} isEven={isEven} shouldReduceMotion={shouldReduceMotion} />
                  </div>

                  {/* Central Timeline Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                    <motion.div
                      variants={shouldReduceMotion ? {} : nodeVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-100px' }}
                      className="relative flex items-center justify-center will-change-transform translate-z-0"
                    >
                      {/* Pulse Ring */}
                      <span className="absolute w-10 h-10 rounded-full bg-indigo-500/20 dark:bg-indigo-500/30 animate-ping opacity-75" />
                      
                      {/* Central Node Circle */}
                      <div className="relative w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${step.highlightColor}`} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty Spacer Column for Desktop Grid Symmetry */}
                  <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
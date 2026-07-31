import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Layers, 
  Zap, 
  Truck, 
  BarChart3, 
  MessageSquareText, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';

// Premium Color Themes added to each feature to create a vibrant SaaS feel
const TRUST_BAR_ITEMS = [
  {
    id: 'search',
    icon: Search,
    title: 'Nearby Supplier Discovery',
    description: 'Find trusted wholesalers nearby based on product availability, location, and precise delivery range algorithms.',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'group-hover:from-blue-500/20 group-hover:to-cyan-400/20',
    textColor: 'group-hover:text-blue-500'
  },
  {
    id: 'price',
    icon: Layers,
    title: 'Live Price Comparison',
    description: 'Compare real-time pricing, dynamic stock availability, and MOQ matrices across multiple suppliers instantly.',
    gradient: 'from-purple-500 to-fuchsia-400',
    glow: 'group-hover:from-purple-500/20 group-hover:to-fuchsia-400/20',
    textColor: 'group-hover:text-fuchsia-500'
  },
  {
    id: 'orders',
    icon: Zap,
    title: 'Smart Order Management',
    description: 'Create, manage, and automate recurring orders faster with intelligent, streamlined purchasing workflows.',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'group-hover:from-blue-500/20 group-hover:to-cyan-400/20',
    textColor: 'group-hover:text-blue-500'
  },
  {
    id: 'tracking',
    icon: Truck,
    title: 'Real-Time Delivery Tracking',
    description: 'Track fleet deliveries, monitor exact driver routes, and receive predictive live order arrival updates.',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'group-hover:from-blue-500/20 group-hover:to-cyan-400/20',
    textColor: 'group-hover:text-blue-500'
  },
  {
    id: 'insights',
    icon: BarChart3,
    title: 'Business Insights & Analytics',
    description: 'Analyze deep sales performance, granular supplier activity, and predictive product demand from one dashboard.',
    gradient: 'from-purple-500 to-fuchsia-400',
    glow: 'group-hover:from-purple-500/20 group-hover:to-fuchsia-400/20',
    textColor: 'group-hover:text-fuchsia-500'
  },
  {
    id: 'chat',
    icon: MessageSquareText,
    title: 'Built-in Business Chat',
    description: 'Communicate instantly and securely with retailers and wholesalers through robust real-time in-app messaging.',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'group-hover:from-blue-500/20 group-hover:to-cyan-400/20',
    textColor: 'group-hover:text-blue-500'
  }
];

// Premium Apple-style Easing Curve
const easePremium = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Optimized Item Variants: No filter blurs, completely GPU handled
const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: easePremium } 
  }
};

export default function FeaturesSection() {
  return (
    <section className="relative w-full overflow-hidden z-20 bg-[#F8FAFC]">
      
      {/* SEAMLESS SECTION TRANSITION DIVIDER */}
      <div className="absolute top-0 left-0 w-full h-32 pointer-events-none z-30" />
      <div className="absolute top-[-50px] inset-x-0 h-[100px] flex justify-center pointer-events-none z-10">
        <div className="xl:w-[80%] h-px" />
      </div>
      
      <div className="relative z-20 w-full max-w-[1536px] mx-auto lg:px-16">
        
        {/* PREMIUM ENTERPRISE CONTAINER */}
        <div className="w-full rounded-[32px] p-6 sm:p-12 lg:p-2 xl:p-16 relative overflow-hidden">
          
          {/* Internal Glow Details */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-400/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/5 blur-[120px] rounded-full pointer-events-none" />

          {/* HEADER AREA */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: easePremium }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-50 border border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.02)] mb-8 will-change-transform translate-z-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-slate-800">
                Platform Infrastructure
              </span>
            </motion.div>
          </div>

          {/* ENTERPRISE FEATURE GRID */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8 relative z-10"
          >
            {TRUST_BAR_ITEMS.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants} 
                className="group relative will-change-transform translate-z-0"
              >
                {/* White base card hover opacity */}
                <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" />
                
                {/* Dynamic colored border glow based on the specific item's theme */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br from-transparent to-transparent ${item.glow} rounded-[26px] opacity-0 group-hover:opacity-100 blur-[4px] transition-all duration-700 pointer-events-none`} />
                
                <div className="relative h-full bg-white border border-slate-200/70 p-8 rounded-[24px] shadow-[0_4px_24px_rgba(15,23,42,0.05)] transition-all duration-500 group-hover:shadow-[0_24px_60px_-12px_rgba(15,23,42,0.08)] group-hover:-translate-y-1 overflow-hidden flex flex-col transform-gpu bg-clip-padding">
                  
                  {/* Icon Container Morphing into vibrant gradient */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:border-transparent origin-left relative z-10 overflow-hidden transform-gpu shadow-sm group-hover:shadow-md">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <item.icon size={24} className="text-slate-600 transition-colors duration-500 group-hover:text-white relative z-10" />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className={`text-xl font-bold text-slate-900 mb-3 tracking-tight transition-colors duration-300 ${item.textColor}`}>
                      {item.title}
                    </h3>
                    <p className="text-[15.5px] text-slate-500 leading-[1.7] font-medium flex-1">
                      {item.description}
                    </p>
                    
                    <div className={`mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900 opacity-100 transition-all duration-300 group-hover:translate-x-1 transform-gpu ${item.textColor}`}>
                      Explore Capability
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ENTERPRISE STATUS BAR */}
          <div className="mt-20 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>System Status</span>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span>All Systems Operational</span>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-2.5 text-[11px] font-bold text-sky-700 bg-sky-50/80 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-sky-100/80 shadow-[0_12px_40px_rgba(14,165,233,0.1)] cursor-pointer will-change-transform translate-z-0"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="tracking-wide">Active Network Feeds Online</span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
// 2. FeaturesSection.jsx
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

import FeatureCard from './FeatuesCard';

const TRUST_BAR_ITEMS = [
  {
    id: 'search',
    icon: Search,
    title: 'Nearby Supplier Discovery',
    description: 'Find trusted wholesalers nearby based on product availability, location, and precise delivery range algorithms.'
  },
  {
    id: 'price',
    icon: Layers,
    title: 'Live Price Comparison',
    description: 'Compare real-time pricing, dynamic stock availability, and MOQ matrices across multiple suppliers instantly.'
  },
  {
    id: 'orders',
    icon: Zap,
    title: 'Smart Order Management',
    description: 'Create, manage, and automate recurring orders faster with intelligent, streamlined purchasing workflows.'
  },
  {
    id: 'tracking',
    icon: Truck,
    title: 'Real-Time Delivery Tracking',
    description: 'Track fleet deliveries, monitor exact driver routes, and receive predictive live order arrival updates.'
  },
  {
    id: 'insights',
    icon: BarChart3,
    title: 'Business Insights & Analytics',
    description: 'Analyze deep sales performance, granular supplier activity, and predictive product demand from one dashboard.'
  },
  {
    id: 'chat',
    icon: MessageSquareText,
    title: 'Built-in Business Chat',
    description: 'Communicate instantly and securely with retailers and wholesalers through robust real-time in-app messaging.'
  }
];

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

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function FeaturesSection() {
  return (
    <section className="relative w-full overflow-hidden z-20">
      
      {/* SEAMLESS SECTION TRANSITION DIVIDER */}
      <div className="absolute top-0 left-0 w-full h-32  pointer-events-none z-30" />
      <div className="absolute top-[-50px] inset-x-0 h-[100px] flex justify-center pointer-events-none z-10">
        <div className="xl:w-[80%] h-px " />
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
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-50 border border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.02)] mb-8"
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
              <motion.div key={item.id} variants={itemVariants} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/0 via-slate-200/50 to-sky-500/0 group-hover:from-pink-400/30 group-hover:via-slate-200/50 group-hover:to-sky-400/30 rounded-[26px] opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-700 pointer-events-none" />
                
                <div className="relative h-full bg-white border border-slate-200/70 p-8 rounded-[24px] shadow-[0_4px_24px_rgba(15,23,42,0.05)] transition-all duration-500 group-hover:shadow-[0_24px_60px_-12px_rgba(15,23,42,0.08)] group-hover:-translate-y-1 overflow-hidden flex flex-col">
                  
                  {/* Icon Container Morph */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 transition-all duration-500 bg-slate-900 group-hover:scale-110 origin-left relative z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <item.icon size={24} className="text-slate-700 transition-colors duration-500 text-white relative z-10" />
                  </div>

                  {/* Standard usage of the existing component, passing down props. 
                      Since we wrap it, it maintains the functionality while upgrading visuals. */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-pink-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-[1.7] font-medium flex-1">
                      {item.description}
                    </p>
                    
                    <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-900 opacity-100 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Explore Capability
                      <ArrowRight size={16} className="text-pink-500" />
                    </div>
                  </div>

                  {/* Fallback rendering of FeatureCard just in case the parent expects it mounted explicitly */}
                  <div className="hidden">
                    <FeatureCard icon={item.icon} title={item.title} description={item.description} />
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
              className="flex items-center gap-2.5 text-[11px] font-bold text-sky-700 bg-sky-50/80 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-sky-100/80 shadow-[0_12px_40px_rgba(14,165,233,0.1)] cursor-pointer"
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
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FeatureCard = React.memo(({ icon: Icon, title, description }) => {
  // Staggered entry transition setup
  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 18
      }
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ 
        y: -6, 
        scale: 1.015,
        boxShadow: "10px 20px 40px rgba(244, 63, 94, 0.05), 5px 1px 3px rgba(14, 165, 233, 0.05)"
      }}
      whileTap={{ scale: 0.985, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="group flex flex-col justify-between cursor-pointer bg-white border border-slate-200/50 rounded-2xl md:rounded-[2rem] transition-all duration-300 will-change-transform h-full 
        /* Mobile Viewport: Horizontal structural alignment */
        p-4 flex-row items-center gap-4
        /* Tablet & Laptop Viewports: Premium vertical scaling blocks */
        sm:flex-col sm:items-start sm:gap-0 sm:p-5 md:p-6 lg:p-6
        /* Large Desktop Viewport */
        xl:p-8
        /* Soft base enterprise standard shadows */
        shadow-[10px_10px_15px_rgba(15,23,42,0.07)]"
    >
      <div className="flex flex-row items-center gap-4 w-full sm:flex-col sm:items-start sm:gap-0">
        
        {/* Sky Blue Highlight Container Node */}
        <motion.div 
          className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100/50 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-100/80 group-hover:border-sky-200
            sm:w-11 sm:h-11 sm:mb-4
            md:w-12 md:h-12 md:mb-5
            lg:w-12 lg:h-12 lg:mb-5
            xl:w-14 xl:h-14 xl:mb-6"
        >
          <Icon className="w-5 h-5 text-sky-500 sm:w-5 md:w-5.5 lg:w-5.5 xl:w-6 transition-transform duration-300 group-hover:rotate-6 " />
        </motion.div>
        
        {/* Typography Content Wrapper */}
        <div className="flex flex-col flex-grow">
          <h3 className="font-extrabold text-[#0F172A] tracking-tight mb-1 transition-colors duration-200 
            text-sm sm:text-[15px] md:text-base lg:text-base xl:text-lg xl:mb-2.5"
          >
            {title}
          </h3>
          <p className="font-medium text-[#64748B] leading-relaxed transition-colors duration-200 group-hover:text-slate-600
            text-xs sm:text-[12.5px] md:text-[13px] lg:text-[13px] xl:text-[14px]"
          >
            {description}
          </p>
        </div>
      </div>

      {/* Explore Feature Inline Action Footnote */}
      <div className="hidden sm:flex items-center gap-1.5 font-bold text-sky-500 mt-6 md:mt-8 lg:mt-8 xl:mt-10
        text-[11px] md:text-xs lg:text-xs xl:text-sm group-hover:text-pink-500"
      >
        <span>Explore feature</span>
        <ArrowRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';
export default FeatureCard;
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, MapPin, Sliders, Package, Heart, Home, Layers, Scan, HelpCircle, ArrowUpRight 
} from 'lucide-react';
import { itemVariants, cardHover } from '../animations/variants';

const iconMap = {
  ShoppingBag, MapPin, Sliders, Package, Heart, Home, Layers, Scan, HelpCircle
};

const QuickActionCard = ({ action }) => {
  const IconComponent = iconMap[action.icon];
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      custom={cardHover}
      className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm p-5 rounded-[24px] cursor-pointer flex flex-col justify-between group will-change-transform"
    >
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-[14px] ${action.color} flex items-center justify-center font-medium shadow-sm transition-transform duration-500 group-hover:scale-110`}>
          <IconComponent className="w-5 h-5" />
        </div>
        {action.badge && (
          <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm shadow-rose-500/20">
            {action.badge}
          </span>
        )}
      </div>
      <div className="mt-7">
        <h4 className="text-[15px] font-bold tracking-tight text-slate-900 flex items-center gap-1.5 group-hover:text-rose-600 transition-colors duration-300">
          {action.name}
          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 text-rose-500" />
        </h4>
        <p className="text-[12px] text-slate-500 font-medium mt-1">{action.desc}</p>
      </div>
    </motion.div>
  );
};

export default QuickActionCard;
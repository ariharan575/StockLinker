import React from 'react';
import { motion } from 'framer-motion';
import { HOW_IT_WORKS } from '../data';
import { fadeUp, lift, SHADOW, C, FONT_DISPLAY } from '../common/constants';

export default function WhyStockLinker() {
  return (
    <section className="mb-10">
      <div className="text-center mb-10">
        <h2 className="font-bold tracking-tight mb-2" style={{ color: C.head, fontFamily: FONT_DISPLAY, fontSize: 'clamp(22px, 3vw, 30px)' }}>
          How StockLinker Works
        </h2>
        <p className="text-sm" style={{ color: C.muted }}>From search to procurement in seconds — not hours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-10 left-0 right-0 h-[1px] bg-gray-200 z-0" />

        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.title}
            {...fadeUp(i * 0.08)}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }}
            className="relative bg-white rounded-2xl p-6 text-left border border-gray-100"
            style={{ boxShadow: SHADOW.sm }}
          >
            <div className="absolute -top-3 left-6 bg-white px-2 text-[11px] font-bold text-gray-400">
              0{i + 1}
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: step.color + '16' }}>
              <step.Icon style={{ width: 22, height: 22, color: step.color }} />
            </div>
            <h3 className="text-sm font-bold mb-1" style={{ color: C.head }}>{step.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center text-xs" style={{ color: C.muted }}>
        Built for fast-moving retail businesses • Reduce procurement time by up to 70%
      </div>
    </section>
  );
}
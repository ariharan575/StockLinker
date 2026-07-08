import React from 'react';
import { motion } from 'framer-motion';
import { WHY_FEATURES } from '../data';
import { fadeUp, lift, SHADOW, C, FONT_DISPLAY } from '../common/constants';

export default function WhyStockLinkers() {
  return (
    <section className="mb-8">
      <div className="text-center mb-8">
        <h2 className="font-bold mb-2 tracking-tight" style={{ color: C.head, fontFamily: FONT_DISPLAY, fontSize: 'clamp(22px, 3vw, 28px)' }}>
          Why Choose StockLinker?
        </h2>
        <p className="text-sm" style={{ color: C.muted }}>Everything your retail business needs, in one platform</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {WHY_FEATURES.map((f, i) => (
          <motion.div key={f.title}
            {...fadeUp(i * 0.06)}
            whileHover={{ ...lift, boxShadow: SHADOW.lg }}
            className="bg-white rounded-2xl p-4 text-center"
            style={{ boxShadow: SHADOW.sm }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: f.color + '16' }}>
              <f.Icon style={{ width: 20, height: 20, color: f.color }} />
            </div>
            <p className="text-xs font-bold mb-1" style={{ color: C.head }}>{f.title}</p>
            <p className="text-[11px] leading-snug" style={{ color: C.muted }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
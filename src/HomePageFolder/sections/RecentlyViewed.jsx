import React from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from '../common';
import { RECENT_VIEWED } from '../data';
import { EASE, CTA_GRAD, FONT_MONO } from '../common/constants';

export default function RecentlyViewed() {
  return (
    <section className="mb-8">
      <SectionHead title="Recently Viewed" sub="Continue where you left off" action="View All" />

      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {RECENT_VIEWED.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
            whileHover={{ y: -5, boxShadow: "0 20px 45px rgba(15,23,42,0.12)" }}
            className="flex-shrink-0 bg-white rounded-2xl p-4 border border-slate-100 transition-all"
            style={{ width: 168, boxShadow: "0 8px 25px rgba(15,23,42,0.06)" }}
          >
            <div className="w-full h-20 rounded-xl bg-slate-50 flex items-center justify-center mb-3 overflow-hidden">
              <img src={p.img} alt={p.name} className="h-full w-full object-contain p-2 hover:scale-105 transition-transform" />
            </div>
            <p className="text-xs font-semibold text-slate-900 leading-snug">{p.name}</p>
            <p className="text-[10px] mt-0.5 text-slate-400">{p.brand} · {p.cat}</p>
            <div className="flex items-center gap-2 mt-2 mb-3">
              <span className="text-sm font-bold text-emerald-600" style={{ fontFamily: FONT_MONO }}>₹{p.price}</span>
              <span className="text-[10px] line-through text-slate-400" style={{ fontFamily: FONT_MONO }}>₹{p.orig}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                {Math.round((p.orig - p.price) / p.orig * 100)}% off
              </span>
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 py-1.5 text-[10px] font-semibold rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all">View</button>
              <button className="flex-1 py-1.5 text-[10px] font-bold text-white rounded transition-all hover:opacity-90 shadow-sm" style={{ background: CTA_GRAD }}>
                Order
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
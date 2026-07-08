import React from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from '../common';
import { QUICK_ACTIONS } from '../data';
import { fadeUp, C } from '../common/constants';

export default function QuickActions() {
  return (
    <section className="mb-8 ps-2">
      <SectionHead title="Quick Actions" sub="Jump right into what you need" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {QUICK_ACTIONS.map((a, i) => (
          <motion.button
            key={a.id}
            {...fadeUp(i * 0.05)}
            whileHover={{
              y: -5,
              scale: 1.02,
              boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
              transition: { duration: 0.15, ease: "easeOut" }
            }}
            whileTap={{
              scale: 0.96,
              y: 0,
              boxShadow: "0 5px 15px rgba(41, 105, 255, 0.12)"
            }}
            className="group bg-white rounded-2xl p-4 text-left border border-slate-100 hover:border-slate-300 active:border-slate-400 transition-all duration-150 ease-out focus:outline-none"
            style={{ boxShadow: "5px 8px 24px rgba(44, 47, 52, 0.15)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all duration-150 group-hover:scale-110 group-hover:shadow-md"
              style={{ backgroundColor: a.bg }}
            >
              <a.Icon
                className="transition-transform duration-150 group-hover:rotate-6"
                style={{ width: 20, height: 20, color: a.color }}
              />
            </div>
            <p className="text-sm font-semibold leading-tight tracking-tight transition-colors duration-150 group-hover:text-slate-900" style={{ color: C.head }}>
              {a.label}
            </p>
            <p className="text-xs mt-1 leading-snug" style={{ color: C.muted }}>
              {a.desc}
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
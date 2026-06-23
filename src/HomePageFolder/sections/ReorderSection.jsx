import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SectionHead } from '../common';
import { REORDERS } from '../data';
import { fadeUp, EASE, CTA_GRAD } from '../common/constants';

export default function ReorderSection() {
  return (
    <section className="mb-8">
      <SectionHead title="Quick Reorder" sub="Repeat your recent purchases instantly" action="Order History" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-5">
        {REORDERS.map((o, i) => (
          <motion.div
            key={o.id}
            {...fadeUp(i * 0.1)}
            className={`bg-white rounded-2xl p-5 border border-slate-100 transition-all ${i === 3 ? "hidden sm:block" : ""} xl:${i === 3 ? "hidden" : ""}`}
            whileHover={{ y: -5, boxShadow: "0 22px 50px rgba(15,23,42,0.12)" }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ boxShadow: "0 8px 28px rgba(15,23,42,0.06)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">Order {o.id}</span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-500">{o.date}</span>
              </div>
              <span className="text-xs font-medium text-slate-400">{o.supplier}</span>
            </div>

            <div className="space-y-1.5 mb-4">
              {o.items.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl mb-4 bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <p className="text-xs text-slate-400">Previous Price</p>
                <p className="text-sm font-bold text-slate-800">₹{o.prev.toLocaleString()}</p>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
              <div className="flex-1 text-right">
                <p className="text-xs text-slate-400">Current Price</p>
                <p className={`text-sm font-bold ${o.diff < 0 ? "text-emerald-600" : "text-red-500"}`}>
                  ₹{o.curr.toLocaleString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded-xl ${o.diff < 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {o.diff < 0 ? "↓" : "↑"} ₹{Math.abs(o.diff)}
              </span>
            </div>

            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25 }}
                className="flex-1 py-2.5 text-sm font-bold text-white rounded cursor-pointer shadow-sm" style={{ background: CTA_GRAD }}>
                Reorder Now
              </motion.button>
              <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25 }}
                className="flex-1 py-2.5 text-sm font-semibold rounded cursor-pointer border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                Compare Prices
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
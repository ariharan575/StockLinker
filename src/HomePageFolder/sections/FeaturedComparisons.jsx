import React from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from '../common';
import { FEATURED_PRODUCTS } from '../data';
import { CTA_GRAD, C, FONT_MONO } from '../common/constants';
import Surf from '../../assets/SurfExcel.jpg';

export default function FeaturedComparisons() {
  return (
    <section className="mb-8">
      <SectionHead title="Featured Comparisons" sub="Top products with live supplier pricing" action="View All" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_PRODUCTS.map((p, i) => (
          <motion.div
            key={p.name}
            whileHover={{
              y: -6,
              scale: 1.015,
              boxShadow: "0 22px 50px rgba(15,23,42,0.12)"
            }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-white rounded-2xl p-4 border border-slate-100 transition-all duration-200 hover:border-slate-200"
            style={{ boxShadow: "0 8px 30px rgba(15,23,42,0.06)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 shadow-sm">
                <img src={Surf} alt={p.name} className="w-full h-full object-contain p-1 transition-transform duration-300 hover:scale-110" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate" style={{ color: C.head }}>
                  {p.name}
                </p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>{p.brand}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {p.suppliers.map((s, pi) => (
                <motion.div
                  key={s.name}
                  whileHover={{ x: 3, scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border transition-all"
                  style={{
                    backgroundColor: pi === 0 ? "#F0FDF4" : "#F8FAFC",
                    borderColor: pi === 0 ? "#22c55e40" : "#E5E7EB"
                  }}
                >
                  <span className="text-[11px] font-medium text-slate-500 truncate max-w-[120px]">
                    {s.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold" style={{ color: pi === 0 ? C.green : C.head, fontFamily: FONT_MONO }}>
                      ₹{s.price}
                    </span>
                    {pi === 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: CTA_GRAD, color: "#fff" }}>
                        BEST
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center py-2.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 bg-white cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5 active:scale-95">
                Compare
              </button>
              <button className="flex-1 py-2 text-xs font-bold text-white rounded cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95" style={{ background: CTA_GRAD }}>
                Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
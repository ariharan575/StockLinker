import React from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from '../common';
import { CATEGORIES } from '../data';

export default function Categories() {
  return (
    <section className="mb-8">
      <SectionHead
        title="Product Categories"
        sub="Browse wholesale products by category"
        action="View All"
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * .03, duration: .45, ease: [.22, 1, .36, 1] }}
            whileHover={{ y: -7, scale: 1.03 }}
            whileTap={{ scale: .97 }}
            className="group relative overflow-hidden rounded-[24px] bg-white border border-slate-200/80 p-2.5 shadow-[0_8px_25px_rgba(15,23,42,.06)] hover:border-pink-200 hover:shadow-[0_22px_55px_rgba(236,72,153,.16)] transition-all duration-200"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-pink-50/80 via-transparent to-blue-50/70 transition-opacity duration-200" />
            <div className="relative z-10">
              <div className="w-full h-[78px] rounded-[18px] overflow-hidden bg-slate-100 border border-slate-100 mb-3 shadow-sm">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent" />
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-800 tracking-tight truncate group-hover:text-pink-600 transition-colors">
                {cat.name}
              </p>
              <span className="inline-flex mt-2 rounded-full px-2.5 py-[3px] text-[9px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition">
                {cat.sup} suppliers
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
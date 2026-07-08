import React from 'react';
import { motion } from 'framer-motion';
import { Star, Navigation, Phone, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { SectionHead } from '../common';
import { NEARBY_SELLERS } from '../data';
import { fadeUp, CTA_GRAD } from '../common/constants';

export default function NearbySellers() {
  return (
    <section className="mb-8">
      <SectionHead title="Nearby Sellers" sub="Suppliers within your delivery zone" action="View All" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {NEARBY_SELLERS.map((s, i) => (
          <motion.div
            key={s.id}
            {...fadeUp(i * 0.09)}
            whileHover={{ y: -4, boxShadow: "0 18px 45px rgba(15,23,42,0.12)" }}
            className="bg-white rounded-2xl p-5 border border-slate-100 transition-all"
            style={{ boxShadow: "0 8px 25px rgba(15,23,42,0.06)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg,#64748B,#334155)" }}>
                  {s.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                    {s.verified && <CheckCircle style={{ width: 14, height: 14, color: "#22C55E" }} />}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star style={{ width: 11, height: 11, fill: "#FBBF24", color: "#FBBF24" }} />
                    <span className="text-xs font-semibold text-slate-700">{s.rating}</span>
                    <span className="text-xs text-slate-400">({s.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100">
                <Navigation style={{ width: 12, height: 12, color: "#64748B" }} />
                <span className="text-xs font-semibold text-slate-600">{s.dist}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {s.cats.map(c => (
                <span key={c} className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-600">
                  {c}
                </span>
              ))}
            </div>

            <p className="text-xs mb-3 text-slate-400">{s.items.slice(0, 3).join(" · ")} &amp; more</p>

            <div className="flex items-center gap-1.5 mb-4">
              <Clock style={{ width: 13, height: 13, color: "#94A3B8" }} />
              <span className="text-xs text-slate-400">Delivery:</span>
              <span className="text-xs font-semibold text-slate-700">{s.delivery}</span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all">
                <Phone size={13} /> Call
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all">
                <MessageSquare size={13} /> Message
              </button>
              <button className="flex-1 py-2.5 text-xs font-bold text-white rounded hover:opacity-90 transition-all shadow-sm" style={{ background: CTA_GRAD }}>
                Visit Store
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
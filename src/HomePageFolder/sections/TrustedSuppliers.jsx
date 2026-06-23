import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, MessageSquare } from 'lucide-react';
import { SectionHead } from '../common';
import { NEARBY_SELLERS } from '../data';
import { CTA_GRAD, C, SHADOW } from '../common/constants';

export default function TrustedSuppliers() {
  const [connected, setConnected] = useState(true);

  return (
    <section className="mb-8">
      <SectionHead title="Trusted & Connected Suppliers" sub="Your personal supplier network" action="Browse Network" />

      {!connected ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center"
          style={{ border: `2px dashed ${C.bdr}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: C.bLight }}>
            <Plus style={{ width: 28, height: 28, color: C.brand }} />
          </div>
          <h3 className="text-base font-bold mb-2" style={{ color: C.head }}>No Connected Suppliers Yet</h3>
          <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: C.muted }}>
            Connect with trusted wholesalers nearby to build your supply network and unlock exclusive pricing deals.
          </p>
          <button onClick={() => setConnected(true)} className="px-7 py-2.5 text-sm font-bold text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: CTA_GRAD, boxShadow: SHADOW.glow }}>
            Find & Connect Suppliers
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEARBY_SELLERS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1"
              style={{ boxShadow: SHADOW.sm, border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg,#64748B,#334155)" }}>
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: C.head }}>{s.name}</p>
                  <p className="text-xs" style={{ color: C.muted }}>{s.dist} • Wholesale Supplier</p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full font-semibold" style={{ background: "#ECFDF5", color: C.green }}>
                  Active
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {s.cats.map(c => (
                  <span key={c} className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-600">
                    {c}
                  </span>
                ))}
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
      )}
    </section>
  );
}
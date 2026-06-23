import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Phone, ChevronDown } from 'lucide-react';
import { SectionHead } from '../common';
import { SUPPLIERS_TABLE } from '../data';
import { CTA_GRAD, C, FONT_MONO } from '../common/constants';
import Surf from '../../assets/SurfExcel.jpg';

export default function PriceComparison() {
  const [showMore, setShowMore] = useState(false);
  const suppliers = showMore ? SUPPLIERS_TABLE : SUPPLIERS_TABLE.slice(0, 5);

  return (
    <section className="mb-8">
      <SectionHead title="Compare Supplier Prices" sub="Find the best wholesale deal instantly" action="View All" />

      <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor: C.sub, boxShadow: "0 15px 40px rgba(15,23,42,.06)" }}>
        <div className="p-3 sm:p-4 lg:p-5 flex flex-col xl:flex-row gap-4">

          <div className="w-full xl:w-[270px] shrink-0 rounded-2xl border bg-slate-50/70 p-3" style={{ borderColor: C.sub }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center overflow-hidden shrink-0 xl:w-full h-25 w-30 xl:h-56" style={{ borderColor: C.sub }}>
                <img src={Surf} alt="Surf Excel Matic Liquid" className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition" />
              </div>
              <div className="xl:hidden flex-1 min-w-0">
                <h3 className="text-xs font-semibold truncate" style={{ color: C.head }}>Surf Excel Matic Liquid</h3>
                <p className="text-[10px]" style={{ color: C.muted }}>1 KG · Pack of 12 Units</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-[10px]" style={{ color: C.muted }}>₹290</span>
                  <span className="text-[10px] font-semibold" style={{ color: "#FF2D7A" }}>Save ₹52 (18%)</span>
                </div>
              </div>
            </div>
            <div className="hidden xl:block">
              <h3 className="text-sm font-semibold mt-3" style={{ color: C.head }}>Surf Excel Matic Liquid</h3>
              <p className="text-[11px]" style={{ color: C.muted }}>1 KG · Pack of 12 Units</p>
              <div className="mt-3 pt-3 border-t flex justify-between" style={{ borderColor: C.sub }}>
                <div>
                  <p className="text-[9px]" style={{ color: C.muted }}>Market Price</p>
                  <p className="text-xs font-bold text-gray-400 line-through">₹290</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px]" style={{ color: C.muted }}>You Save</p>
                  <p className="text-xs font-bold" style={{ color: "#FF2D7A" }}>₹52 (18%)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold uppercase" style={{ color: C.muted }}>
              <div className="col-span-5">Supplier</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Brand</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="overflow-x-auto custom-scroll pb-2">
              <div className="min-w-[720px] space-y-2">
                {suppliers.map((s, i) => (
                  <motion.div key={s.rank} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .03 }}
                    className="grid grid-cols-12 items-center gap-2 px-3 py-2 rounded-xl border hover:shadow-lg transition"
                    style={{ borderColor: s.isBest ? "#10B981" : C.sub, background: s.isBest ? "linear-gradient(90deg,#F0FDFA,#fff)" : "white" }}>
                    
                    <div className="col-span-5 flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "linear-gradient(135deg,#38BDF8,#EC4899,#FB7185)" }}>
                        {s.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold truncate" style={{ color: C.head }}>{s.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" fill="#FBBF24" color="#FBBF24" />
                          <span className="text-[10px]" style={{ color: C.muted }}>{s.rating} ({s.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-xs">{s.qty}</div>
                    <div className="col-span-2 text-center text-xs">{s.brand}</div>
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-bold" style={{ color: s.isBest ? "#10B981" : C.head, fontFamily: FONT_MONO }}>
                        ₹{s.price}
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-end gap-1.5">
                      <button className="p-1.5 rounded-lg border" style={{ borderColor: C.sub }}>
                        <MessageSquare className="w-3.5 h-3.5" color={C.muted} />
                      </button>
                      <button className="p-1.5 rounded-lg border" style={{ borderColor: C.sub }}>
                        <Phone className="w-3.5 h-3.5" color={C.muted} />
                      </button>
                      <button className="px-3 py-1.5 rounded text-[11px] font-bold text-white whitespace-nowrap" style={{ background: CTA_GRAD }}>
                        Order Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button onClick={() => setShowMore(!showMore)} className="mt-3 w-full py-2 rounded-xl border text-xs font-semibold" style={{ borderColor: C.sub, color: C.muted }}>
              {showMore ? "Show Less Suppliers" : "View More Suppliers"}
              <ChevronDown className={`inline ml-1 w-3.5 h-3.5 ${showMore ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { height: 1px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #f472b6; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll { scrollbar-width: thin; }
      `}</style>
    </section>
  );
}
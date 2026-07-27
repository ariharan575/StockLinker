import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Search, Globe, MapPin, Settings, Bell,Mic,
  ChevronDown, Navigation
} from 'lucide-react';
import { Logo } from '../common';
import { C, SHADOW, FONT_BODY } from '../common/constants';

const NOTIFS = [
  { msg: 'Price drop on Surf Excel 1KG',  time: '2 min ago',  dot: '#0EA5E9' },
  { msg: 'New supplier in your area',      time: '1 hr ago',   dot: '#EC4899' },
  { msg: 'Order #1023 has been delivered', time: '3 hrs ago',  dot: '#0EA5E9' },
  { msg: 'Invoice #INV-047 due tomorrow',  time: 'Yesterday',  dot: '#0EA5E9' },
];

export default function Header({ open, setOpen }) {
  const [lang, setLang] = useState(false);
  const [loc, setLoc] = useState(false);
  const [notif, setNotif] = useState(false);
  const [prof, setProf] = useState(false);

  const closeAll = () => { setLang(false); setLoc(false); setNotif(false); setProf(false); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        borderColor: C.bdr,
        boxShadow: SHADOW.sm,
        backgroundColor: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      }}>
      <div className="flex items-center h-16 px-4 gap-3">

        {/* Hamburger + Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}>
            <Menu style={{ width: 20, height: 20, color: C.body }} />
          </button>
          <div className="hidden lg:block"><Logo /></div>
          <div className="lg:hidden"><Logo sm /></div>
        </div>

        {/* Search */}
      <div className="flex-1 max-w-full relative group pe-[55px] ps-2">
        <div className="absolute inset-0 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"/>
        <div className="relative flex items-center w-full bg-slate-100/80 hover:bg-white border border-transparent hover:border-pink-400 hover:border-1.5 rounded-xl transition-all shadow-sm">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search AI recommendations, suppliers, products..."
            className="w-full h-10 pl-10 pr-24 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 font-medium"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button className="p-1.5 text-slate-400 hover:text-purple-600 bg-white rounded-md border border-slate-200 shadow-sm transition-colors">
              <Mic size={14} />
            </button>
          </div>
        </div>
      </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Language */}
          <div className="relative hidden md:block">
            <button onClick={() => { closeAll(); setLang(v => !v); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
              style={{ color: C.body }}>
              <Globe style={{ width: 15, height: 15 }} />
              <span className="hidden lg:inline font-medium text-xs">ENG</span>
              <ChevronDown style={{ width: 12, height: 12 }} />
            </button>
            <AnimatePresence>
              {lang && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border py-1 z-50"
                  style={{ borderColor: C.bdr, boxShadow: SHADOW.md }}>
                  {['English', 'தமிழ் (Tamil)'].map(l => (
                    <button key={l} onClick={() => setLang(false)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors"
                      style={{ color: C.body }}>{l}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location */}
          <div className="relative hidden md:block">
            <button onClick={() => { closeAll(); setLoc(v => !v); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm"
              style={{ color: C.body }}>
              <MapPin style={{ width: 15, height: 15 }} />
              <span className="hidden lg:inline text-sm font-medium">Chennai</span>
              <ChevronDown style={{ width: 12, height: 12 }} />
            </button>
            <AnimatePresence>
              {loc && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border py-1 z-50"
                  style={{ borderColor: C.bdr, boxShadow: SHADOW.md }}>
                  {[['Current Location', Navigation], ['Nearby Areas', MapPin], ['Search Location', Search]].map(([label, LIcon]) => (
                    <button key={label} onClick={() => setLoc(false)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2.5"
                      style={{ color: C.body }}>
                      <LIcon style={{ width: 13, height: 13, color: C.muted }} />{label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings style={{ width: 22, height: 22, color: C.muted }} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { closeAll(); setNotif(v => !v); }}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <Bell style={{ width: 22, height: 22, color: C.muted }} />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">4</span>
            </button>
            <AnimatePresence>
              {notif && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border py-2 z-50"
                  style={{ borderColor: C.bdr, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
                  <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: C.sub }}>
                    <span className="text-sm font-bold" style={{ color: C.head }}>Notifications</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: C.bLight, color: C.brand }}>4 new</span>
                  </div>
                  {NOTIFS.map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-slate-50 flex gap-3 cursor-pointer transition-colors">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.dot }} />
                      <div>
                        <p className="text-sm" style={{ color: C.body }}>{n.msg}</p>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { closeAll(); setProf(v => !v); }}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg,#64748B,#334155)" }}
              >
                A
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none" style={{ color: C.head }}>Boomathi</p>
                <p className="text-[10px] mt-0.5" style={{ color: C.muted }}>Retailer</p>
              </div>
              <ChevronDown style={{ width: 12, height: 12, color: C.muted }} />
            </button>
            <AnimatePresence>
              {prof && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border py-1 z-50"
                  style={{ borderColor: C.bdr, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: C.sub }}>
                    <p className="text-sm font-bold" style={{ color: C.head }}>Boomathi S</p>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>boomathi@kirana.in</p>
                  </div>
                  {['My Profile','Business Profile','Account Settings'].map(item => (
                    <button key={item} className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors"
                      style={{ color: C.body }}>{item}</button>
                  ))}
                  <div className="border-t mx-2 my-1" style={{ borderColor: C.sub }} />
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 transition-colors text-red-500">
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
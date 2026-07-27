import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { SKY_300 } from '../common/constants';

const FOOTER_COLS = [
  { head: 'Categories', links: ['Grocery','Beverages','Dairy','Hardware','Medical','Packaging'] },
  { head: 'For Businesses', links: ['Retailers','Suppliers','Distributors','Wholesalers'] },
  { head: 'Technology', links: ['React.js','Spring Boot','MySQL','Redis','REST API'] },
  { head: 'Resources', links: ['Help Center','Support','Contact Us','Privacy Policy','Terms'] },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#132238] via-[#17304d] to-[#1b1b3a]">
      <div className="px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#footerGrad)"/>
                <defs><linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#EC4899"/><stop offset="100%" stopColor="#F97316"/></linearGradient></defs>
                <circle cx="10" cy="16" r="4.5" fill="white" opacity="0.95"/>
                <circle cx="22" cy="16" r="4.5" fill="white" opacity="0.95"/>
                <rect x="12" y="14" width="8" height="4" rx="2" fill="white"/>
                <circle cx="10" cy="16" r="2" fill="#1b1b3a"/>
                <circle cx="22" cy="16" r="2" fill="#1b1b3a"/>
              </svg>
              <span className="font-bold text-xl text-white">Stock<span style={{ color: SKY_300 }}>Linker</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Hyperlocal B2B wholesale marketplace connecting retailers with nearby suppliers for smarter, faster procurement.
            </p>
            <div className="flex gap-2">
              {[FaInstagram, FaLinkedin, FaGithub].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'}>
                  <Icon style={{ width: 16, height: 16, color: '#64748B' }} />
                </button>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.head}>
              <h4 className="text-sm font-bold mb-4 text-slate-200">{col.head}</h4>
              {col.links.map(l => (
                <p key={l} className="text-sm mb-2.5 cursor-pointer transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#CBD5E1'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>© 2025 StockLinker. All rights reserved. Made with ❤️ in Chennai, India 🇮🇳</p>
          <div className="flex gap-5">
            {['Privacy','Terms','Cookies'].map(l => (
              <span key={l} className="text-xs cursor-pointer transition-colors" style={{ color: '#52525B' }}
                onMouseEnter={e => e.currentTarget.style.color = '#94A3B8'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
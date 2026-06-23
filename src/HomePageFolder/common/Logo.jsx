import React from 'react';
import { CTA_GRAD, C } from './constants';

export default function Logo({ sm }) {
  const sz = sm ? 26 : 32;
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={sz} height={sz} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#7C3AED"/>
            <stop offset="100%" stopColor="#A855F7"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="#121214"/>
        <circle cx="10" cy="16" r="4.5" fill="white" opacity="0.95"/>
        <circle cx="22" cy="16" r="4.5" fill="white" opacity="0.95"/>
        <rect x="12" y="14" width="8" height="4" rx="2" fill="white"/>
        <circle cx="10" cy="16" r="2" fill="#121214"/>
        <circle cx="22" cy="16" r="2" fill="#121214"/>
        <circle cx="16" cy="7.5" r="2.5" fill="url(#logoGrad)"/>
        <rect x="15.25" y="10" width="1.5" height="3" rx="0.75" fill="url(#logoGrad)" opacity="0.7"/>
        <circle cx="16" cy="24.5" r="2.5" fill="#EC4899"/>
        <rect x="15.25" y="19" width="1.5" height="3" rx="0.75" fill="#EC4899" opacity="0.7"/>
      </svg>
      <span className={`font-bold tracking-tight ${sm ? 'text-base' : 'text-xl'}`} style={{ color: C.head, fontFamily: "'Sora', 'Inter', sans-serif" }}>
        Stock<span style={{
          backgroundImage: CTA_GRAD,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Linker</span>
      </span>
    </div>
  );
}
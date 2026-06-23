import React from 'react';
import { ArrowRight } from 'lucide-react';
import { C, FONT_DISPLAY, FONT_BODY } from './constants';

export default function SectionHead({ title, sub, action }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.head, fontFamily: FONT_DISPLAY }}>
          {title}
        </h2>
        {sub && <p className="text-sm mt-1" style={{ color: C.muted, fontFamily: FONT_BODY }}>{sub}</p>}
      </div>
      {action && (
        <button className="flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: C.brand }}>
          {action} <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  );
}
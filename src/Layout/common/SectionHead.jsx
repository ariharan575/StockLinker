import React from 'react';
import { ArrowRight } from 'lucide-react';
import { C, FONT_DISPLAY, FONT_BODY } from './constants';

export default function SectionHead({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between ps-2 mb-1.5 sm:mb-3">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: C.head, fontFamily: FONT_DISPLAY }}>
          {title}
        </h2>
        {sub && <p className="hidden sm:block font-medium text-slate-700 text-sm mt-1" style={{fontFamily: FONT_BODY }}>{sub}</p>}
      </div>
      {action && (
        <button className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: C.brand , fontFamily: FONT_DISPLAY}}>
          {action} <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  );
}
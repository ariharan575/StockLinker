import React from 'react';

const StatusBadge = React.memo(({ status }) => {
  const configs = {
    available: { label: 'In Stock', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/20', dot: 'bg-[#10B981]' },
    low: { label: 'Low Stock', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' },
    out: { label: 'Out of Stock', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-500' },
  };
  const config = configs[status] || configs.available;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border ${config.bg} ${config.text} ${config.border} font-sora text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'out' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
});

export default StatusBadge;
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const ActionButtons = React.memo(({ onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-2">
    <button onClick={onEdit} className="flex items-center justify-center w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-[10px] border border-slate-200 bg-white text-[#475569] hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 transition-all shadow-sm active:scale-95">
      <Pencil size={14} strokeWidth={2.5} />
    </button>
    <button onClick={onDelete} className="flex items-center justify-center w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-[10px] border border-slate-200 bg-white text-[#475569] hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm active:scale-95">
      <Trash2 size={14} strokeWidth={2.5} />
    </button>
  </div>
));

export default ActionButtons;
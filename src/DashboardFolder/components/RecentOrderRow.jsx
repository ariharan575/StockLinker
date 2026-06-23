import React from 'react';

const RecentOrderRow = ({ order }) => {
  return (
    <tr className="group hover:bg-slate-50 transition-colors cursor-pointer">
      <td className="py-4">
        <span className="font-extrabold text-slate-900">{order.id}</span>
        <p className="text-[11px] font-medium text-slate-500 mt-1">May 12, 2026</p>
      </td>
      <td className="py-4 font-bold text-slate-700">{order.item}</td>
      <td className="py-4 text-slate-500 font-medium">{order.supplier}</td>
      <td className="py-4 text-right">
        <span className={`inline-block text-[11px] font-extrabold px-3 py-1 rounded-lg border shadow-sm ${order.statusColor}`}>
          {order.status}
        </span>
        <p className="text-[11px] font-medium text-slate-400 mt-1.5">{order.eta}</p>
      </td>
    </tr>
  );
};

export default RecentOrderRow;
import React from 'react';
import { X, Download, ShieldCheck, MapPin } from 'lucide-react';
import OrderTimeline from '../components/OrderTimeline';
import { STATUS_STYLES } from '../utils/orderConstants';

export default function OrderDetailsModal({ modalOrder, setModalOrder, pageRole }) {
  if (!modalOrder) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-[24px] max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="flex justify-between items-start p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="font-['Manrope',_sans-serif] text-[18px] sm:text-[22px] font-extrabold text-black flex items-center flex-wrap gap-2 sm:gap-3">
              Order {modalOrder.orderNumber}
              <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded border uppercase whitespace-nowrap ${STATUS_STYLES[modalOrder.status]}`}>
                {modalOrder.status.replace(/_/g, ' ')}
              </span>
            </h2>
            <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1">
              Placed on {new Date(modalOrder.placedAt).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
            </p>
          </div>
          <button onClick={() => setModalOrder(null)} className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-100 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 no-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Delivery & Invoice</h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex justify-between items-center text-[12px] sm:text-[13px]">
                  <span className="text-slate-500 font-medium">{['DELIVERED'].includes(modalOrder.status) ? 'Delivered on' : 'Scheduled on'}</span>
                  <span className="font-bold text-black">{modalOrder.deliveryDate ? new Date(modalOrder.deliveryDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : 'Pending Assignment'}</span>
                </div>
                {modalOrder.invoice && (
                  <div className="flex justify-between items-center text-[12px] sm:text-[13px] border-b border-slate-200 pb-4 mb-4">
                    <span className="text-slate-500 font-medium">Invoice ID</span>
                    <span className="font-bold text-black">{modalOrder.invoice.invoiceNumber}</span>
                  </div>
                )}
                <button className="w-full py-2.5 bg-white border border-slate-200 text-[12px] sm:text-[13px] font-bold text-black rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Download size={16} /> Download Invoice
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">{pageRole === 'WHOLESALER' ? 'Buyer Details' : 'Seller Details'}</h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col h-full">
                <h3 className="font-['Manrope',_sans-serif] text-[15px] sm:text-[16px] font-extrabold text-black flex items-center gap-1.5">
                  {pageRole === 'WHOLESALER' ? modalOrder.buyerName : modalOrder.sellerName} <ShieldCheck size={16} className="text-pink-500" />
                </h3>
                <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 flex items-start sm:items-center gap-1.5 mt-1.5 mb-auto leading-tight"><MapPin size={14} className="shrink-0 mt-0.5 sm:mt-0"/> {pageRole === 'WHOLESALER' ? modalOrder.buyerLocation : modalOrder.sellerLocation}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border-t border-slate-200 pt-4 mt-4">
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-400">Business Type</p>
                    <p className="text-[12px] sm:text-[13px] font-bold text-black mt-0.5">{pageRole === 'WHOLESALER' ? 'Shopkeeper' : modalOrder.sellerBusinessType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-400">GSTIN</p>
                    <p className="text-[12px] sm:text-[13px] font-bold text-black mt-0.5">{modalOrder.invoice?.sellerGstin || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Product Details ({modalOrder.totalItems} Items)</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto no-scrollbar">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Product Name</span>
                  <span>SKU</span>
                  <span>Quantity</span>
                  <span>Rate</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-slate-100 bg-white">
                  {modalOrder.items?.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 sm:px-5 py-3 sm:py-4 items-center hover:bg-slate-50/50 transition-colors">
                      <span className="text-[12px] sm:text-[13px] font-bold text-black truncate">{item.productName}</span>
                      <span className="text-[12px] sm:text-[13px] font-medium text-slate-500">{item.sku}</span>
                      <span className="text-[12px] sm:text-[13px] font-medium text-black">{item.quantity} Units</span>
                      <span className="text-[12px] sm:text-[13px] font-medium text-black">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-[13px] sm:text-[14px] font-extrabold text-black text-right">₹{item.lineTotal.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 sm:gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Order Status Timeline</h4>
              <OrderTimeline order={modalOrder} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-center">
              <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bill Summary</h4>
              <div className="space-y-3 border-b border-slate-200 pb-4 mb-4">
                <div className="flex justify-between text-[12px] sm:text-[13px] font-medium text-slate-600">
                  <span>Subtotal Amount</span>
                  <span className="font-bold text-black">₹{modalOrder.invoice?.subtotal.toLocaleString('en-IN') || modalOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[12px] sm:text-[13px] font-medium text-slate-600">
                  <span>Discount</span>
                  <span className="font-bold text-black">₹{modalOrder.invoice?.discount.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between text-[12px] sm:text-[13px] font-medium text-slate-600">
                  <span>Tax (0%)</span>
                  <span className="font-bold text-black">₹{modalOrder.invoice?.tax.toLocaleString('en-IN') || 0}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] sm:text-[14px] font-bold text-black uppercase tracking-wide">Total Amount</span>
                <span className="font-['Manrope',_sans-serif] text-[20px] sm:text-[22px] font-extrabold text-black">₹{modalOrder.invoice?.finalAmount.toLocaleString('en-IN') || modalOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Loader2, Truck, BarChart3 } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";
import { DetailItem } from "../components/cards/DetailItem";

export function DeliveryInsightsSection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox 
      title="Delivery & Insights" 
      subtitle="Configure wholesale logistics and manage store analytics." 
      action={
        <motion.button 
          whileTap={isSaving ? {} : { scale: 0.96 }} 
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("delivery-insights")} 
          disabled={isSaving} 
          className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all shadow-sm ${
            isSaving 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
              : isEditing 
                ? 'bg-slate-900 text-white hover:bg-slate-800 border border-transparent' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Save size={16} /> : <Pencil size={14} />}
          {isSaving ? "Saving..." : isEditing ? "Save Config" : "Edit Config"}
        </motion.button>
      }
    >
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
        {/* Left Side: Delivery Configuration (Editable) */}
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 lg:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight">Delivery Configuration</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">Rules & logistics settings</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-1 flex-1">
            <EditableDetailItem label="Delivery Radius (KM)" value={editedData.deliveryRadius} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryRadius" />
            <EditableDetailItem label="Minimum Order" value={editedData.minOrder} isEditing={isEditing} onChange={handleFieldChange} fieldKey="minOrder" />
            <EditableDetailItem label="Delivery Charges" value={editedData.deliveryCharges} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryCharges" />
            <EditableDetailItem label="Delivery Days" value={editedData.deliveryDays} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryDays" />
          </div>
        </div>

        {/* Right Side: Product Insights (Partially Editable) */}
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 lg:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
              <BarChart3 size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight">Product Insights</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">Inventory highlights & alerts</p>
            </div>
          </div>
          
          <div className="grid gap-4 flex-1">
            {/* These two are now editable strings saved to DB */}
            <EditableDetailItem label="🏆 Best Selling Product" value={editedData.bestSellingProduct} isEditing={isEditing} onChange={handleFieldChange} fieldKey="bestSellingProduct" />
            <EditableDetailItem label="🚀 Fast Moving Category" value={editedData.fastMovingCategory} isEditing={isEditing} onChange={handleFieldChange} fieldKey="fastMovingCategory" />
            
            {/* These two are calculated from DB, so they remain Read-Only */}
            <div className="grid grid-cols-1 gap-4 mt-2">
              <DetailItem label="📦 Total Active Products" value={editedData.totalProducts?.toString()} />
              <DetailItem label="⚠️ Low Stock Alerts" value={editedData.lowStockCount?.toString()} />
            </div>
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
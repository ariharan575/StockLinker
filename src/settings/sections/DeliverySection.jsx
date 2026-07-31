import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Loader2 } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

export function DeliverySection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox 
      title="Store & Delivery" 
      subtitle="Store address, delivery coverage and logistics configuration." 
      action={
        <motion.button 
          whileTap={isSaving ? {} : { scale: 0.96 }} 
          whileHover={isSaving ? {} : { scale: 1.03 }} 
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("delivery")} 
          disabled={isSaving} 
          className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all ${isSaving ? 'bg-sky-500/10 text-sky-400 opacity-70 cursor-not-allowed' : 'bg-sky-50/80 text-sky-600 cursor-pointer hover:bg-sky-100 shadow-[0_2px_10px_rgba(14,165,233,0.1)] border border-sky-100'}`}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Save size={16} /> : <Pencil size={16} />}
          {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Address"}
        </motion.button>
      }
    >
      <div className="grid gap-5 sm:gap-6 lg:gap-8 xl:grid-cols-2">
        <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
          <h3 className="mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Store Address Details</h3>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <EditableDetailItem label="Address Line 1" value={editedData.addressLine1} isEditing={isEditing} onChange={handleFieldChange} fieldKey="addressLine1" />
            </div>
            <div className="md:col-span-2">
              <EditableDetailItem label="Address Line 2" value={editedData.addressLine2} isEditing={isEditing} onChange={handleFieldChange} fieldKey="addressLine2" />
            </div>
            <EditableDetailItem label="City" value={editedData.city} isEditing={isEditing} onChange={handleFieldChange} fieldKey="city" />
            <EditableDetailItem label="District" value={editedData.district} isEditing={isEditing} onChange={handleFieldChange} fieldKey="district" />
            <EditableDetailItem label="State" value={editedData.state} isEditing={isEditing} onChange={handleFieldChange} fieldKey="state" />
            <EditableDetailItem label="Pincode" value={editedData.pincode} isEditing={isEditing} onChange={handleFieldChange} fieldKey="pincode" />
            <div className="md:col-span-2">
              <EditableDetailItem label="Landmark" value={editedData.landmark} isEditing={isEditing} onChange={handleFieldChange} fieldKey="landmark" />
            </div>
          </div>
        </div>
        
        <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
          <h3 className="mb-5 sm:mb-6 text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Delivery Configuration</h3>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <EditableDetailItem label="Delivery Radius (KM)" value={editedData.deliveryRadius} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryRadius" />
            <EditableDetailItem label="Minimum Order" value={editedData.minOrder} isEditing={isEditing} onChange={handleFieldChange} fieldKey="minOrder" />
            <EditableDetailItem label="Delivery Charges" value={editedData.deliveryCharges} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryCharges" />
            <EditableDetailItem label="Delivery Days" value={editedData.deliveryDays} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryDays" />
            <div className="md:col-span-2">
              <EditableDetailItem label="Route Schedule" value={editedData.routeSchedule} isEditing={isEditing} onChange={handleFieldChange} fieldKey="routeSchedule" />
            </div>
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
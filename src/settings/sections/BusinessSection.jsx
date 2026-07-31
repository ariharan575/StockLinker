import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Loader2 } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

export function BusinessSection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox 
      title="Business Details" 
      subtitle="Business identity, ownership and contact information." 
      action={
        <motion.button 
          whileTap={isSaving ? {} : { scale: 0.96 }} 
          whileHover={isSaving ? {} : { scale: 1.03 }} 
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("business")} 
          disabled={isSaving} 
          className={`flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all ${isSaving ? 'bg-sky-500/10 text-sky-400 opacity-70 cursor-not-allowed' : 'bg-sky-50/80 text-sky-600 cursor-pointer hover:bg-sky-100 shadow-[0_2px_10px_rgba(14,165,233,0.1)] border border-sky-100'}`}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Save size={16} /> : <Pencil size={16} />}
          {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Details"}
        </motion.button>
      }
    >
      <div className="grid gap-5 sm:gap-6 lg:gap-8 xl:grid-cols-2">
        <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
          <div className="mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Business Information</h3>
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <EditableDetailItem label="Owner Name" value={editedData.userName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="userName" />
            <EditableDetailItem label="Company Name" value={editedData.companyName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="companyName" />
            <EditableDetailItem label="Business Type" value={editedData.businessType} isEditing={isEditing} onChange={handleFieldChange} fieldKey="businessType" />
            <EditableDetailItem label="Category" value={editedData.category} isEditing={isEditing} onChange={handleFieldChange} fieldKey="category" />
            <EditableDetailItem label="GST Number" value={editedData.gstNumber} isEditing={isEditing} onChange={handleFieldChange} fieldKey="gstNumber" />
            <EditableDetailItem label="Operating Timing" value={editedData.operatingTiming} isEditing={isEditing} onChange={handleFieldChange} fieldKey="operatingTiming" />
            <EditableDetailItem label="Years in Business" value={editedData.yearsInBusiness} isEditing={isEditing} onChange={handleFieldChange} fieldKey="yearsInBusiness" />
          </div>
        </div>

        <div className="rounded-[20px] sm:rounded-[28px] border border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300">
          <div className="mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Contact Details</h3>
          </div>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <EditableDetailItem label="Phone Number" value={editedData.phone} isEditing={isEditing} onChange={handleFieldChange} fieldKey="phone" />
            <EditableDetailItem label="Alternate Number" value={editedData.altPhone} isEditing={isEditing} onChange={handleFieldChange} fieldKey="altPhone" />
            <EditableDetailItem label="Business Email" value={editedData.businessEmail} isEditing={isEditing} onChange={handleFieldChange} fieldKey="businessEmail" />
            <EditableDetailItem label="Location" value={editedData.location} isEditing={isEditing} onChange={handleFieldChange} fieldKey="location" />
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
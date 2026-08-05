import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Loader2, Building2, PhoneCall } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

export function BusinessSection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox 
      title="Business Details" 
      subtitle="Business identity, corporate ownership, and public contact information." 
      action={
        <motion.button 
          whileTap={isSaving ? {} : { scale: 0.96 }} 
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("business")} 
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
          {isSaving ? "Saving..." : isEditing ? "Save Details" : "Edit Details"}
        </motion.button>
      }
    >
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 lg:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6 md:mb-8 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight">Corporate Entity</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">Official registered business details</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 flex-1">
            <EditableDetailItem label="Owner Name" value={editedData.userName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="userName" />
            <EditableDetailItem label="Company Name" value={editedData.companyName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="companyName" />
            <EditableDetailItem label="Business Type" value={editedData.businessType} isEditing={isEditing} onChange={handleFieldChange} fieldKey="businessType" />
            <EditableDetailItem label="Category" value={editedData.category} isEditing={isEditing} onChange={handleFieldChange} fieldKey="category" />
            <EditableDetailItem label="GST Number" value={editedData.gstNumber} isEditing={isEditing} onChange={handleFieldChange} fieldKey="gstNumber" />
            <EditableDetailItem label="Operating Timing" value={editedData.operatingTiming} isEditing={isEditing} onChange={handleFieldChange} fieldKey="operatingTiming" />
            <div className="md:col-span-2">
              <EditableDetailItem label="Years in Business" value={editedData.yearsInBusiness} isEditing={isEditing} onChange={handleFieldChange} fieldKey="yearsInBusiness" />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 lg:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6 md:mb-8 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
              <PhoneCall size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight">Public Contact</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">Communication channels for buyers</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 flex-1">
            <EditableDetailItem label="Business Phone" value={editedData.phone} isEditing={isEditing} onChange={handleFieldChange} fieldKey="phone" />
                        <EditableDetailItem label="Alternate Number" value={editedData.altPhone} isEditing={isEditing} onChange={handleFieldChange} fieldKey="altPhone" />
            <div className="md:col-span-2">
            <EditableDetailItem label="Alternate Number" value={editedData.altPhone} isEditing={isEditing} onChange={handleFieldChange} fieldKey="altPhone" />
            </div>
            <div className="md:col-span-2">
              <EditableDetailItem label="Support Email" value={editedData.businessEmail} isEditing={isEditing} onChange={handleFieldChange} fieldKey="businessEmail" />
            </div>
            <div className="md:col-span-2">
              <EditableDetailItem label="Headquarters" value={editedData.location} isEditing={isEditing} onChange={handleFieldChange} fieldKey="location" />
            </div>
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
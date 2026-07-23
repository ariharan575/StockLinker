import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, MapPinned, Layers3, Clock3, ShieldCheck, Loader2 } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

export function BusinessSection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox title="Business Details" subtitle="Business identity, ownership and contact information." action={
      <motion.button whileTap={isSaving ? {} : { scale: 0.96 }} whileHover={isSaving ? {} : { scale: 1.03 }} onClick={() => isEditing ? handleSaveClick() : handleEditClick("business")} disabled={isSaving} className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${isSaving ? 'bg-sky-500/10 text-sky-400 opacity-70 cursor-not-allowed' : 'bg-sky-500/10 text-sky-400 cursor-pointer hover:bg-sky-500/20'}`}>
        {isSaving ? <Loader2 size={17} className="animate-spin" /> : isEditing ? <Save size={17} /> : <Pencil size={17} />}
        {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Details"}
      </motion.button>
    }>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5"><div className="mb-5"><h3 className="text-xl font-black text-zinc-900">Business Information</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <EditableDetailItem label="Owner Name" value={editedData.userName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="userName" />
            <EditableDetailItem label="Company Name" value={editedData.companyName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="companyName" />
            <EditableDetailItem label="Business Type" value={editedData.businessType} isEditing={isEditing} onChange={handleFieldChange} fieldKey="businessType" />
            <EditableDetailItem label="Category" value={editedData.category} isEditing={isEditing} onChange={handleFieldChange} fieldKey="category" />
            <EditableDetailItem label="GST Number" value={editedData.gstNumber} isEditing={isEditing} onChange={handleFieldChange} fieldKey="gstNumber" />
            <EditableDetailItem label="Operating Timing" value={editedData.operatingTiming} isEditing={isEditing} onChange={handleFieldChange} fieldKey="operatingTiming" />
            <EditableDetailItem label="Years in Business" value={editedData.yearsInBusiness} isEditing={isEditing} onChange={handleFieldChange} fieldKey="yearsInBusiness" />
          </div>
        </div>
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5"><div className="mb-5"><h3 className="text-xl font-black text-zinc-900">Contact Details</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
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
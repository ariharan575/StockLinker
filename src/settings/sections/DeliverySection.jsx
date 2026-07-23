import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Loader2 } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

export function DeliverySection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox title="Store & Delivery" subtitle="Store address, delivery coverage and logistics configuration." action={
      <motion.button whileTap={isSaving ? {} : { scale: 0.96 }} whileHover={isSaving ? {} : { scale: 1.03 }} onClick={() => isEditing ? handleSaveClick() : handleEditClick("delivery")} disabled={isSaving} className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold transition-all ${isSaving ? 'bg-sky-500/10 text-sky-400 opacity-70 cursor-not-allowed' : 'bg-sky-500/10 text-sky-400 cursor-pointer hover:bg-sky-500/20'}`}>
        {isSaving ? <Loader2 size={17} className="animate-spin" /> : isEditing ? <Save size={17} /> : <Pencil size={17} />}
        {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Address"}
      </motion.button>
    }>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5"><h3 className="mb-5 text-xl font-black text-zinc-900">Store Address Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* FULL WIDTH FOR ADDRESS 1 & 2 */}
            <div className="sm:col-span-2">
              <EditableDetailItem label="Address Line 1" value={editedData.addressLine1} isEditing={isEditing} onChange={handleFieldChange} fieldKey="addressLine1" />
            </div>
            <div className="sm:col-span-2">
              <EditableDetailItem label="Address Line 2" value={editedData.addressLine2} isEditing={isEditing} onChange={handleFieldChange} fieldKey="addressLine2" />
            </div>
            <EditableDetailItem label="City" value={editedData.city} isEditing={isEditing} onChange={handleFieldChange} fieldKey="city" />
            <EditableDetailItem label="District" value={editedData.district} isEditing={isEditing} onChange={handleFieldChange} fieldKey="district" />
            <EditableDetailItem label="State" value={editedData.state} isEditing={isEditing} onChange={handleFieldChange} fieldKey="state" />
            <EditableDetailItem label="Pincode" value={editedData.pincode} isEditing={isEditing} onChange={handleFieldChange} fieldKey="pincode" />
            <div className="sm:col-span-2">
              <EditableDetailItem label="Landmark" value={editedData.landmark} isEditing={isEditing} onChange={handleFieldChange} fieldKey="landmark" />
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5"><h3 className="mb-5 text-xl font-black text-zinc-900">Delivery Configuration</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <EditableDetailItem label="Delivery Radius (KM)" value={editedData.deliveryRadius} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryRadius" />
            <EditableDetailItem label="Minimum Order" value={editedData.minOrder} isEditing={isEditing} onChange={handleFieldChange} fieldKey="minOrder" />
            <EditableDetailItem label="Delivery Charges" value={editedData.deliveryCharges} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryCharges" />
            <EditableDetailItem label="Delivery Days" value={editedData.deliveryDays} isEditing={isEditing} onChange={handleFieldChange} fieldKey="deliveryDays" />
            <div className="sm:col-span-2">
              <EditableDetailItem label="Route Schedule" value={editedData.routeSchedule} isEditing={isEditing} onChange={handleFieldChange} fieldKey="routeSchedule" />
            </div>
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
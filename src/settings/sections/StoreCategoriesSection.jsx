import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Loader2, PackageSearch, ChevronRight, MapPin, Grid } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

const subcategoryImages = import.meta.glob("../../assets/subcategories/*", { eager: true, import: "default" });

const getSubcategoryImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http') || imageName.startsWith('data:')) return imageName;
  const matchingKey = Object.keys(subcategoryImages).find(key => key.includes(imageName));
  return matchingKey ? subcategoryImages[matchingKey] : null;
};

export function StoreCategoriesSection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox 
      title="Store & Categories" 
      subtitle="Manage your physical store address and view associated product categories." 
      action={
        <motion.button 
          whileTap={isSaving ? {} : { scale: 0.96 }} 
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("store")} 
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
          {isSaving ? "Saving..." : isEditing ? "Save Address" : "Edit Address"}
        </motion.button>
      }
    >
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 lg:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight">Store Address</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">Physical location details</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2"><EditableDetailItem label="Address Line 1" value={editedData.addressLine1} isEditing={isEditing} onChange={handleFieldChange} fieldKey="addressLine1" /></div>
            <div className="md:col-span-2"><EditableDetailItem label="Address Line 2" value={editedData.addressLine2} isEditing={isEditing} onChange={handleFieldChange} fieldKey="addressLine2" /></div>
            <EditableDetailItem label="City" value={editedData.city} isEditing={isEditing} onChange={handleFieldChange} fieldKey="city" />
            <EditableDetailItem label="District" value={editedData.district} isEditing={isEditing} onChange={handleFieldChange} fieldKey="district" />
            <EditableDetailItem label="State" value={editedData.state} isEditing={isEditing} onChange={handleFieldChange} fieldKey="state" />
            <EditableDetailItem label="Pincode" value={editedData.pincode} isEditing={isEditing} onChange={handleFieldChange} fieldKey="pincode" />
            <div className="md:col-span-2"><EditableDetailItem label="Landmark" value={editedData.landmark} isEditing={isEditing} onChange={handleFieldChange} fieldKey="landmark" /></div>
          </div>
        </div>
        
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 lg:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-[500px] lg:h-auto max-h-[650px]">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
              <Grid size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight leading-tight">Product Categories</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">Categories approved for your business</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
            {(!editedData.subCategories || editedData.subCategories.length === 0) && (
              // ✅ WORLD CLASS SAAS EMPTY STATE
              <div className="flex flex-col items-center justify-center h-full text-center p-8 border border-dashed border-slate-200 rounded-2xl bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-5 relative">
                  <div className="absolute inset-0 bg-slate-100/50 rounded-2xl animate-pulse" />
                  <PackageSearch size={28} className="text-slate-300 relative z-10" />
                </div>
                <p className="text-[18px] font-extrabold text-slate-800 tracking-tight">No categories assigned</p>
                <p className="text-[14px] font-medium text-slate-500 mt-2 max-w-[240px] leading-relaxed">Your approved product categories will appear here once you list products.</p>
              </div>
            )}
            
            {editedData.subCategories?.map((item) => {
              const imgUrl = getSubcategoryImageUrl(item.imageName || item.image);
              return (
                <div key={item.id} className="group flex items-center justify-between rounded-2xl border border-slate-200/60 bg-slate-50/50 p-3 sm:p-4 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-slate-300 cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 overflow-hidden border border-slate-200/60 shadow-sm relative">
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <PackageSearch size={20} className="text-slate-400" />
                      )}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                    </div>
                    <h4 className="text-[14px] font-bold text-slate-900">{item.name}</h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-200 transition-colors shadow-sm">
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
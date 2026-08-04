import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, Loader2, Monitor, TabletSmartphone, CheckCircle2, ShieldCheck, Mail, Phone } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { DetailItem } from "../components/cards/DetailItem";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

export function AccountSection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox 
      title="Account Details" 
      subtitle="Manage your personal identity, login credentials, and active device sessions." 
      action={
        <motion.button 
          whileTap={isSaving ? {} : { scale: 0.96 }} 
          onClick={() => isEditing ? handleSaveClick() : handleEditClick("account")} 
          disabled={isSaving} 
          className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all shadow-sm ${
            isSaving ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
            : isEditing ? 'bg-slate-900 text-white hover:bg-slate-800 border border-transparent' 
            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : isEditing ? <Save size={16} /> : <Pencil size={14} />}
          {isSaving ? "Saving..." : isEditing ? "Save Identity" : "Edit Identity"}
        </motion.button>
      }
    >
      {/* Premium Identity Header */}
      <div className="rounded-[24px] border mt-[-20px] border-slate-100/60 p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] mb-6 flex flex-row items-center gap-4 sm:gap-6 md:gap-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative shrink-0">
          <div className="flex h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 text-[28px] sm:text-[40px] md:text-[48px] font-['Manrope',_sans-serif] font-extrabold items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl ring-4 ring-slate-50">
            {editedData.userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {/* Online Indicator */}
          <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1 h-4 w-4 sm:h-6 sm:w-6 bg-emerald-500 border-2 sm:border-4 border-white rounded-full shadow-sm"></div>
        </motion.div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl md:text-[38px] font-extrabold text-slate-900 font-['Manrope',_sans-serif] tracking-tight truncate">
              {editedData.userName || "User Profile"}
            </h2>
            {editedData.verificationStatus === 'VERIFIED' && (
              <ShieldCheck className="text-emerald-500 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 shrink-0" strokeWidth={2.5} />
            )}
          </div>
          
          <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm truncate">
              ID: {editedData.userId || "Pending"}
            </span>
            <span className="bg-sky-50 border border-sky-100 text-sky-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm truncate">
              Role: {editedData.role || editedData.businessType || "Partner"}
            </span>
          </div>
          <span className="bg-sky-50 border border-slate-200 text-slate-600 w-fit mt-3 px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
            Member Since: <span className="text-green-500 font-sora ps-1 sm:ps-2">{editedData.MemberSince}</span>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 ">
        {/* Personal Details */}
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-full">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Personal Identity</h3>
            <p className="mt-1 text-[13px] font-medium text-slate-500">Contact information associated with this account.</p>
          </div>
          <div className="grid gap-4 flex-1">
            <EditableDetailItem label="Full Name" value={editedData.userName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="userName" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <EditableDetailItem label="Primary Phone" value={editedData.phone} isEditing={isEditing} onChange={handleFieldChange} fieldKey="phone" />
              <EditableDetailItem label="Email Address" value={editedData.email} isEditing={isEditing} onChange={handleFieldChange} fieldKey="email" />
            </div>
          </div>
        </div>

        {/* Security & Sessions */}
        <div className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] flex flex-col h-full">
          <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-end">
            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Devices & Sessions</h3>
              <p className="mt-1 text-[13px] font-medium text-slate-500">Manage your active login sessions.</p>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">2 Active</span>
          </div>
          
          <div className="grid gap-3 flex-1">
            {/* Active Device */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-900/10 bg-slate-50/80 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-800 shrink-0">
                  <Monitor size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900">Chrome • Windows</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">This Device • Active</p>
                  </div>
                </div>
              </div>
              <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
            </div>

            {/* Saved Device */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
                  <TabletSmartphone size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-700">StockLinker App • Android</h4>
                  <p className="mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">Last Login 2h Ago</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
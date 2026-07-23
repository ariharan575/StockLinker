import React from "react";
import { motion } from "framer-motion";
import { Store, Camera, ShieldCheck, Pencil, Save, Monitor, TabletSmartphone, CheckCircle2, Loader2 } from "lucide-react";
import { SectionBox } from "../components/layout/SectionBox";
import { DetailItem } from "../components/cards/DetailItem";
import { EditableDetailItem } from "../components/cards/EditableDetailItem";

export function AccountSection({ editedData, handleFieldChange, isEditing, isSaving, handleEditClick, handleSaveClick }) {
  return (
    <SectionBox title="Profile Overview" subtitle="Manage your account identity, connected devices and business access." action={
      <motion.button whileTap={isSaving ? {} : { scale: 0.96 }} whileHover={isSaving ? {} : { scale: 1.03 }} onClick={() => isEditing ? handleSaveClick() : handleEditClick("account")} disabled={isSaving} className={`flex items-center gap-3 rounded-2xl bg-sky-500/10 px-5 py-3 text-sm font-bold text-sky-400 transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-sky-500/20'}`}>
        {isSaving ? <Loader2 size={17} className="animate-spin" /> : isEditing ? <Save size={17} /> : <Pencil size={17} />}
        {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
      </motion.button>
    }>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-[30px] bg-gradient-to-br from-sky-500 via-pink-500 to-rose-500 text-white shadow-[0_30px_60px_rgba(236,72,153,0.35)]"><Store size={40} /></div>
            <button className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-zinc-900 cursor-pointer hover:scale-105 transition-transform shadow-sm"><Camera size={17} /></button>
          </motion.div>
          <div>
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-3xl md:text-4xl font-black text-zinc-900">{editedData.companyName || "Your Business"}</h2></div>
             <p className="mt-2 text-sm text-zinc-500 capitalize">Premium {editedData.role?.toLowerCase() || "user"} Partner</p> 
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-500"><ShieldCheck size={14} />{editedData.verificationStatus || "Pending"}</div>
          <div className="rounded-2xl bg-sky-500/10 px-4 py-1.5 text-xs font-bold text-sky-500">Trust Score {editedData.trustScore || 0}%</div>
          <div className="rounded-2xl bg-pink-500/10 px-4 py-1.5 text-xs font-bold text-pink-500">Market Rank #{editedData.marketplaceRank || 0}</div>
        </div>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 shadow-xl">
          <div className="mb-5"><h3 className="text-xl font-black text-zinc-900">Account Information</h3><p className="mt-1 text-sm text-zinc-500">User identity and account details</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <EditableDetailItem label="User Name" value={editedData.userName} isEditing={isEditing} onChange={handleFieldChange} fieldKey="userName" />
            <DetailItem label="User ID" value={editedData.userId} />
            <DetailItem label="Role" value={editedData.role} />
            <EditableDetailItem label="Phone Number" value={editedData.phone} isEditing={isEditing} onChange={handleFieldChange} fieldKey="phone" />
            <EditableDetailItem label="Email Address" value={editedData.email} isEditing={isEditing} onChange={handleFieldChange} fieldKey="email" />
            <DetailItem label="Member Since" value={editedData.MemberSince} />
          </div>
        </div>
        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 shadow-xl">
          <div className="mb-5"><h3 className="text-xl font-black text-zinc-900">Devices & Sessions</h3><p className="mt-1 text-sm text-zinc-500">Connected devices and login status</p></div>
          <div className="grid gap-4">
            <DetailItem label="Connected Devices" value="2 Devices Active" />
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500"><Monitor size={20} /></div><div><h4 className="text-sm font-bold text-zinc-900">Chrome • Windows</h4><p className="mt-1 text-xs text-emerald-500 font-semibold">Active Now</p></div></div><CheckCircle2 className="text-emerald-500" size={18} />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-500"><TabletSmartphone size={20} /></div><div><h4 className="text-sm font-bold text-zinc-900">App • Android</h4><p className="mt-1 text-xs text-zinc-400 font-semibold">Last Login 2 Hours Ago</p></div></div><div className="rounded-full bg-zinc-500/10 px-3 py-1 text-[10px] font-bold text-zinc-400">Saved</div>
            </div>
          </div>
        </div>
      </div>
    </SectionBox>
  );
}
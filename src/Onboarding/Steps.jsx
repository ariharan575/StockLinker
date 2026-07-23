import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User2, Building2, Phone, Mail, ShieldCheck, MapPin, Check, CheckCircle2, ChevronDown, Search, Truck
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import Input from "./Input";
import { STORE_TYPES, DELIVERY_OPTIONS } from "./constants";
import { useNavigate } from "react-router-dom";

const TAMIL_NADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
  "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Karur", "Krishnagiri", 
  "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", 
  "Pudukottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", 
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", 
  "Tiruppur", "Thiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
];

const handleEnter = (e, nextId) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const nextEl = document.getElementById(nextId);
    if (nextEl) nextEl.focus();
  }
};

export function BusinessStep({ formData, updateField, errors }) {
  return (
    <div>
      <SectionTitle
        title={<>Tell us about your<span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text ps-2 text-transparent">Business</span></>}
        subtitle="Create your enterprise profile and continue onboarding."
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-5">
        <Input id="ownerName" icon={User2} label="Owner Name" placeholder="Rajesh Kumar" value={formData.ownerName} onChange={(e) => updateField("ownerName", e.target.value)} onKeyDown={(e) => handleEnter(e, "businessName")} hasError={errors.includes("ownerName")} />
        <Input id="businessName" icon={Building2} label="Business Name" placeholder="Kumar Traders" value={formData.businessName} onChange={(e) => updateField("businessName", e.target.value)} onKeyDown={(e) => handleEnter(e, "mobile")} hasError={errors.includes("businessName")} />
        <Input id="mobile" type="number" icon={Phone} label="Mobile Number" placeholder="9876543210" value={formData.mobile} onChange={(e) => updateField("mobile", e.target.value)} onKeyDown={(e) => handleEnter(e, "deliveryRadius")} hasError={errors.includes("mobile")} />
        <Input id="deliveryRadius" type="number" icon={Truck} label="Delivery Coverage (in Km)" placeholder="e.g. 50" value={formData.deliveryRadius} onChange={(e) => updateField("deliveryRadius", e.target.value)} onKeyDown={(e) => handleEnter(e, "businessEmail")} hasError={errors.includes("deliveryRadius")} />
        <Input id="businessEmail" type="email" icon={Mail} label="Business Email" placeholder="business@email.com" value={formData.businessEmail} onChange={(e) => updateField("businessEmail", e.target.value)} onKeyDown={(e) => handleEnter(e, "gstNumber")} hasError={errors.includes("businessEmail")} />
        <Input id="gstNumber" icon={ShieldCheck} label="GST Number (Optional)" placeholder="22AAAA0000AA1Z5" value={formData.gstNumber} onChange={(e) => updateField("gstNumber", e.target.value)} />
      </motion.div>
    </div>
  );
}

export function AddressStep({ formData, updateField, errors }) {
  const [districtSearch, setDistrictSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filteredDistricts = TAMIL_NADU_DISTRICTS.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()));

  return (
    <div>
      <SectionTitle
        title={<>Business<span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 ps-2 text-transparent bg-clip-text">Address</span></>}
        subtitle="Setup your location information."
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input id="address1" icon={MapPin} label="Address Line 1" placeholder="No 24 Main Road" value={formData.address1} onChange={(e) => updateField("address1", e.target.value)} onKeyDown={(e) => handleEnter(e, "address2")} hasError={errors.includes("address1")} />
        <Input id="address2" icon={MapPin} label="Address Line 2 (Optional)" placeholder="Near Bus Stand" value={formData.address2} onChange={(e) => updateField("address2", e.target.value)} onKeyDown={(e) => handleEnter(e, "area")} />
        <Input id="area" icon={MapPin} label="Area" placeholder="Anna Nagar" value={formData.area} onChange={(e) => updateField("area", e.target.value)} onKeyDown={(e) => handleEnter(e, "cityOrTown")} hasError={errors.includes("area")} />
        <Input id="cityOrTown" icon={MapPin} label="City / Town" placeholder="Chennai" value={formData.cityOrTown} onChange={(e) => updateField("cityOrTown", e.target.value)} onKeyDown={(e) => handleEnter(e, "pincode")} hasError={errors.includes("cityOrTown")} />
        
        {/* Searchable District Dropdown */}
        <div className="group relative">
          <label className="text-sm font-semibold mb-2 block text-slate-700">District {errors.includes("district") && <span className="text-red-500 ml-1">*</span>}</label>
          <div className="relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${errors.includes("district") ? 'bg-red-400/10 border-red-400/50 text-red-500' : 'bg-pink-400/10 border-pink-400/20 text-pink-400'}`}>
              <MapPin size={17} />
            </div>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full h-[58px] sm:h-[62px] pl-16 pr-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 text-sm font-medium bg-slate-50 ${errors.includes("district") ? "border-red-500" : "border-slate-200 hover:border-pink-400/40"}`}
            >
              <span className={formData.district ? "text-slate-900" : "text-slate-400"}>{formData.district || "Select District"}</span>
              <ChevronDown size={18} className="text-slate-400" />
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3">
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search..." value={districtSearch} onChange={(e) => setDistrictSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-pink-400" autoFocus />
                </div>
                <div className="max-h-48 overflow-y-auto no-scrollbar">
                  {filteredDistricts.map(dist => (
                    <div key={dist} onClick={() => { updateField("district", dist); setIsDropdownOpen(false); setDistrictSearch(""); }} className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl cursor-pointer">
                      {dist}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Input id="pincode" type="number" icon={MapPin} label="Pincode" placeholder="613001" value={formData.pincode} onChange={(e) => updateField("pincode", e.target.value)} hasError={errors.includes("pincode")} />
      </div>
    </div>
  );
}

export function MarketplaceStep({ role, categories, formData, toggleCategory, updateField, errors }) {
  return (
    <div>
      <SectionTitle
        title={<>Marketplace<span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 ps-2 text-transparent bg-clip-text">Setup</span></>}
        subtitle="Customize your marketplace profile."
      />

      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">Choose categories {errors.includes("categoryIds") && <span className="text-red-500 text-sm ml-2">* Select at least one</span>}</h3>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.length === 0 && <p className="text-sm text-slate-500">Loading categories...</p>}
          {categories.map((item, index) => {
            const active = formData.categoryIds.includes(item.id);
            return (
              <motion.button
                key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => toggleCategory(item.id)}
                className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-300 ${active ? "bg-pink-100 border-pink-300 text-pink-700 shadow-md" : "bg-slate-50 border-slate-200 hover:border-pink-300 text-slate-700"}`}
              >
                {item.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">{role === "WHOLESALER" ? "Delivery support" : "Store size"} {errors.includes("selection") && <span className="text-red-500 text-sm ml-2">* Required</span>}</h3>
        <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {(role === "WHOLESALER" ? DELIVERY_OPTIONS : STORE_TYPES).map((item, index) => {
            const active = role === "WHOLESALER" ? formData.deliverySupport === item : formData.storeSize === item;
            return (
              <motion.button
                key={item} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => role === "WHOLESALER" ? updateField("deliverySupport", item) : updateField("storeSize", item)}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${active ? "bg-pink-500 text-white border-transparent shadow-[0_0_30px_rgba(236,72,153,0.35)]" : "bg-slate-50 border-slate-200 hover:border-pink-300 text-slate-700"}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm leading-tight">{item}</h4>
                  {active && <Check size={16} />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SuccessScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[520px] flex flex-col items-center justify-center text-center relative overflow-hidden">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute w-[300px] h-[300px] rounded-full bg-pink-400/10 blur-3xl" />
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 120 }} className="relative z-10 w-28 h-28 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.35)]">
        <CheckCircle2 className="w-14 h-14 text-white" />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-[38px] sm:text-[58px] leading-[1] font-black tracking-tight text-slate-900">
        Marketplace<br /><span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">ready 🚀</span>
      </motion.h2>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 h-16 px-10 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-black text-lg shadow-[0_20px_60px_rgba(236,72,153,0.35)]" onClick={() => navigate("/dashboard")}>
        <span>Launch Dashboard →</span>
      </motion.button>
    </div>
  );
}
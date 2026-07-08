import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Navigation, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Building2, 
  Search, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';

// --- CONSTANTS & ANIMATIONS ---
const CTA_GRAD = "linear-gradient(135deg, #0F172A, #334155)";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay }
});

// --- DUMMY DATA ---
const CONNECTED_SUPPLIERS = [
  { id: 1, name: "ABC Traders", rating: "4.8", reviews: 120, dist: "2.5 km", verified: true, connected: true, cats: ["Fruits", "Vegetables"], items: ["Tomato", "Potato", "Onion"], delivery: "Same day" },
  { id: 2, name: "FreshFarm Co", rating: "4.9", reviews: 342, dist: "1.2 km", verified: true, connected: true, cats: ["Organics", "Dairy"], items: ["Milk", "Cheese", "Eggs"], delivery: "Next day" },
  { id: 3, name: "Metro Wholesale", rating: "4.6", reviews: 89, dist: "5.0 km", verified: true, connected: true, cats: ["Beverages", "Snacks"], items: ["Cola", "Chips", "Juice"], delivery: "2-3 days" },
  { id: 4, name: "GreenLeaf Dist.", rating: "4.7", reviews: 210, dist: "3.4 km", verified: true, connected: true, cats: ["Vegetables"], items: ["Spinach", "Kale", "Lettuce"], delivery: "Same day" },
  { id: 5, name: "Prime Provisions", rating: "4.9", reviews: 504, dist: "0.8 km", verified: true, connected: true, cats: ["Meat", "Poultry"], items: ["Chicken", "Beef", "Pork"], delivery: "Next day" },
  { id: 6, name: "Sunrise Grocers", rating: "4.5", reviews: 67, dist: "4.1 km", verified: true, connected: true, cats: ["Pantry", "Spices"], items: ["Flour", "Sugar", "Salt"], delivery: "Same day" },
  { id: 7, name: "Apex Organics", rating: "4.8", reviews: 156, dist: "6.2 km", verified: true, connected: true, cats: ["Organics", "Grains"], items: ["Quinoa", "Oats", "Rice"], delivery: "2-3 days" },
  { id: 8, name: "Urban Spices", rating: "4.7", reviews: 223, dist: "2.9 km", verified: true, connected: true, cats: ["Spices", "Condiments"], items: ["Pepper", "Cumin", "Turmeric"], delivery: "Next day" },
  { id: 9, name: "Valley Dairy", rating: "4.9", reviews: 412, dist: "1.5 km", verified: true, connected: true, cats: ["Dairy", "Bakery"], items: ["Butter", "Bread", "Cream"], delivery: "Same day" },
  { id: 10, name: "Coastal Seafoods", rating: "4.6", reviews: 94, dist: "7.0 km", verified: true, connected: true, cats: ["Seafood", "Frozen"], items: ["Salmon", "Shrimp", "Crab"], delivery: "Next day" }
];

const NEARBY_SELLERS = [
  { id: 11, name: "QuickBite Supplies", rating: "4.4", reviews: 45, dist: "1.1 km", verified: true, connected: false, cats: ["Packaging"], items: ["Cups", "Boxes", "Bags"], delivery: "Same day" },
  { id: 12, name: "Zen Meats", rating: "4.8", reviews: 189, dist: "3.2 km", verified: true, connected: false, cats: ["Meat", "Poultry"], items: ["Duck", "Lamb", "Turkey"], delivery: "Next day" },
  { id: 13, name: "Harvest Bowl", rating: "4.5", reviews: 76, dist: "4.5 km", verified: false, connected: false, cats: ["Grains", "Cereals"], items: ["Barley", "Wheat", "Millet"], delivery: "2-3 days" },
  { id: 14, name: "Global Imports", rating: "4.7", reviews: 310, dist: "8.0 km", verified: true, connected: false, cats: ["Exotic", "Spices"], items: ["Saffron", "Truffle", "Vanilla"], delivery: "Next day" }
];

// --- REUSABLE SUPPLIER CARD COMPONENT ---
function SupplierCard({ supplier, index, isConnected }) {
  return (
    <motion.div
      {...fadeUp(index * 0.05)}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(15,23,42,0.1)" }}
      className="bg-white rounded-2xl p-5 border border-slate-200 transition-all flex flex-col h-full relative"
      style={{ boxShadow: "0 4px 20px -5px rgba(15,23,42,0.05)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm" style={{ background: CTA_GRAD }}>
            {supplier.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-semibold text-slate-900 leading-none">{supplier.name}</p>
              {supplier.verified && <CheckCircle style={{ width: 14, height: 14, color: "#22C55E" }} />}
              {isConnected && (
                <span className="px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase tracking-wide ml-1">
                  Connected
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <Star style={{ width: 12, height: 12, fill: "#FBBF24", color: "#FBBF24" }} />
              <span className="text-xs font-semibold text-slate-700">{supplier.rating}</span>
              <span className="text-xs text-slate-400">({supplier.reviews} reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0">
          <Navigation style={{ width: 12, height: 12, color: "#64748B" }} />
          <span className="text-xs font-semibold text-slate-600">{supplier.dist}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {supplier.cats.map(c => (
          <span key={c} className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-indigo-50 border border-indigo-100/50 text-indigo-600">
            {c}
          </span>
        ))}
      </div>

      <p className="text-xs mb-2 text-slate-500 line-clamp-1">{supplier.items.slice(0, 3).join(" · ")} <span className="text-slate-400">&amp; more</span></p>

      <div className="mt-auto">
        <div className="flex items-center gap-1.5 mb-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
          <Clock style={{ width: 13, height: 13, color: "#64748B" }} />
          <span className="text-xs text-slate-500">Delivery:</span>
          <span className="text-xs font-semibold text-slate-800">{supplier.delivery}</span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-2 focus:ring-slate-100 outline-none">
            <Phone size={14} /> Call
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-2 focus:ring-slate-100 outline-none">
            <MessageSquare size={14} /> Message
          </button>
          <button className="flex-1 py-2.5 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-all shadow-sm focus:ring-2 focus:ring-slate-400 outline-none" style={{ background: CTA_GRAD }}>
            Visit Store
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function ConnectedSupplierPage() {
  const connectedSuppliers = CONNECTED_SUPPLIERS;
  const hasConnections = connectedSuppliers.length > 0;
  const discoverSuppliers = NEARBY_SELLERS.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6  min-h-screen bg-[#FAFAFA]">
      
      {/* Header Section */}
      <div className="mb-10 max-w-2xl">
        <motion.h1 {...fadeUp(0)} className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Supply Chain Network
        </motion.h1>
        <motion.p {...fadeUp(0.1)} className="text-slate-500 mt-2 text-base">
          Manage your active partners and discover verified suppliers around your business.
        </motion.p>
      </div>

      {/* Section 1: Connected Suppliers */}
      <section className="mb-16">
        <motion.div {...fadeUp(0.2)} className="flex items-end justify-between mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              My Connected Suppliers
            </h2>
          </div>
          {hasConnections && (
            <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-full">
              {connectedSuppliers.length} Connected
            </span>
          )}
        </motion.div>

        {hasConnections ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedSuppliers.map((supplier, i) => (
              <SupplierCard 
                key={supplier.id} 
                supplier={supplier} 
                index={i} 
                isConnected={true} 
              />
            ))}
          </div>
        ) : (
          <motion.div 
            {...fadeUp(0.3)}
            className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-5 border border-slate-100">
              <AlertCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No active connections yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              Start building your supply network by connecting with verified suppliers in your delivery zone.
            </p>
            <button className="px-7 py-3 bg-[#0F172A] shadow-lg shadow-slate-900/20 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 mx-auto active:scale-95">
              Browse Nearby Suppliers <Search className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </section>

      {/* Section 2: Discover Nearby */}
      <section className="pt-8">
        <motion.div {...fadeUp(0.4)} className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Discover Nearby Suppliers</h2>
            <p className="text-slate-500 text-sm">Find new verified suppliers and expand your supply network.</p>
          </div>
          <button className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 hover:gap-2.5 transition-all bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg">
            View All Suppliers <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoverSuppliers.map((supplier, i) => (
            <SupplierCard 
              key={supplier.id} 
              supplier={supplier} 
              index={i} 
              isConnected={false} 
            />
          ))}
        </div>
      </section>

    </div>
  );
}
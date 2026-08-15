import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Star, MapPin, Loader2, 
  MessageSquare, Package, Building2 
} from 'lucide-react';

// Adjust this import path depending on where your api file lives
import { networkApi } from '../../auth/services/api'; 
import { CTA_GRAD, fadeUp } from '../utils/animationUtils';
import { getSubcategoryImageUrl } from '../utils/imageUtils';

export default function SupplierCard({ supplier, index, isConnected, onAccept, isPendingReq, onNotify, onShowMore }) {
  const navigate = useNavigate();
  const initial = supplier.name ? supplier.name.charAt(0).toUpperCase() : "B";
  const verified = supplier.verificationStatus === "VERIFIED" || supplier.verification?.includes("Business Verified");

  const [connectStatus, setConnectStatus] = useState(supplier.connectionStatus || 'NONE');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false); 

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      await networkApi.requestConnection(supplier.id);
      setConnectStatus('PENDING');
      if (onNotify) onNotify('success', `Connection request sent to ${supplier.name}`);
    } catch (err) { 
      console.error(err); 
      if (onNotify) onNotify('error', 'Failed to send connection request.');
    } finally { 
      setIsConnecting(false); 
    }
  };

  const handleAcceptClick = async () => {
    if (isAccepting) return;
    setIsAccepting(true);
    try {
      await onAccept(supplier.connectionId);
    } catch (err) {
      console.error(err);
      setIsAccepting(false); 
    }
  };

  const handleMessageClick = () => {
    navigate('/message', {
      state: { partnerToMessage: { id: supplier.userId || supplier.id, name: supplier.name, businessName: supplier.category, profileImage: null } }
    });
  };

  const handleViewProfile = () => {
    const profileId = supplier.businessProfileId || supplier.id;
    if (profileId) {
      navigate(`/storefront/${profileId}`);
    } else {
      console.error("Missing business profile reference.");
    }
  };

  const displaySubs = supplier.subCategories?.slice(0, 3) || [];
  const remainingCount = (supplier.totalSubCategories || 0) - displaySubs.length;

  return (
    <motion.div {...fadeUp(index * 0.05)} whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(15,23,42,0.1)" }} className="bg-white rounded-2xl p-5 border border-slate-200 transition-all flex flex-col h-full relative" style={{ boxShadow: "0 4px 20px -5px rgba(15,23,42,0.05)" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm" style={{ background: CTA_GRAD }}>{initial}</div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-semibold text-slate-900 leading-none">{supplier.name}</p>
              {verified && <CheckCircle2 style={{ width: 14, height: 14, color: "#22C55E" }} />}
              {isConnected && <span className="px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-600 uppercase tracking-wide ml-1">Connected</span>}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <Star style={{ width: 12, height: 12, fill: "#FBBF24", color: "#FBBF24" }} />
              <span className="text-xs font-semibold text-slate-700">{supplier.rating > 0 ? supplier.rating : "New"}</span>
              <span className="text-xs text-slate-400">({supplier.reviews || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3"><span className="flex items-center gap-1 text-[13px] text-zinc-700 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100"><MapPin size={12}/> {supplier.location}</span></div>

      <div className="mt-auto">
        <div className="flex gap-2 w-full overflow-x-auto pb-3 no-scrollbar items-center">
          {displaySubs.map((sub, idx) => {
            const imgUrl = getSubcategoryImageUrl(sub.image) || sub.image;
            return (
              <div key={idx} className="relative border border-zinc-200 rounded-md overflow-hidden w-10 h-10 flex-shrink-0 group/prod cursor-pointer">
                {imgUrl ? (
                  <img src={imgUrl} alt={sub.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/prod:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase">{sub.name?.charAt(0)}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/prod:opacity-100 transition-opacity duration-200 flex items-center justify-center p-1">
                  <span className="text-[8px] text-white font-bold text-center leading-tight">{sub.name}</span>
                </div>
              </div>
            );
          })}
          {remainingCount > 0 && (
            <div 
              onClick={() => onShowMore && onShowMore(supplier)} 
              className="border border-dashed border-zinc-300 rounded-md w-10 h-10 flex items-center justify-center text-xs text-zinc-500 font-bold bg-zinc-50 cursor-pointer hover:bg-zinc-100 transition-colors"
            >
              +{remainingCount}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {isPendingReq ? (
            <button 
              onClick={handleAcceptClick} 
              disabled={isAccepting}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white rounded-lg shadow-sm transition-all ${
                isAccepting ? 'bg-emerald-400 cursor-not-allowed opacity-80' : 'bg-emerald-500 hover:scale-[1.02]'
              }`}
            >
              {isAccepting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Accepting...
                </>
              ) : (
                "Accept Request"
              )}
            </button>
          ) : isConnected ? (
            <>
              <button onClick={handleMessageClick} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"><MessageSquare size={14} /> Message</button>
              <button onClick={handleViewProfile} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-md transition-all"><Package size={14} /> Order Now</button>
            </>
          ) : connectStatus === 'PENDING' ? (
             <button disabled className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 text-slate-500 rounded-lg shadow-inner cursor-not-allowed">Requested</button>
          ) : (
            <>
              <button onClick={handleViewProfile} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg  transition-all"><Building2 size={14} /> View Profile</button>
              <button onClick={handleConnect} disabled={isConnecting} className="flex-1 flex justify-center py-2.5 text-xs font-bold text-white rounded-lg hover:opacity-90 transition-all shadow-sm" style={{ background: CTA_GRAD }}>
                {isConnecting ? <Loader2 size={16} className="animate-spin" /> : "Connect"}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Navigation, Phone, MessageSquare, Clock, Sparkles, CheckCircle2, 
  Building2, Search, ArrowRight, AlertCircle, Loader2, Users, Compass, 
  Bell, MapPin, ShieldCheck, Award, Package, Truck
} from 'lucide-react';
import { networkApi } from '../Authentication/services/api'; 

const CTA_GRAD = "linear-gradient(135deg, #0F172A, #334155)";

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut", delay } });

function LiveToast({ notification, onClose }) {
  if (!notification) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-white border border-emerald-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Bell size={20} className="animate-bounce" /></div>
      <div className="flex-1"><h4 className="text-sm font-bold text-zinc-900">{notification.type === 'NEW_REQUEST' ? 'New Connection Request' : 'Connection Accepted'}</h4><p className="text-xs text-zinc-500">{notification.message}</p></div>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">×</button>
    </motion.div>
  );
}

function SupplierCard({ supplier, index, isConnected, onAccept, isPendingReq }) {
  const navigate = useNavigate();
  const initial = supplier.name ? supplier.name.charAt(0).toUpperCase() : "B";
  const verified = supplier.verificationStatus === "VERIFIED" || supplier.verification?.includes("Business Verified");

  const [connectStatus, setConnectStatus] = useState(supplier.connectionStatus || 'NONE');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      await networkApi.requestConnection(supplier.id);
      setConnectStatus('PENDING');
    } catch (err) { console.error(err); } finally { setIsConnecting(false); }
  };

  const handleMessageClick = () => {
    navigate('/messages', {
      state: { partnerToMessage: { id: supplier.userId || supplier.id, name: supplier.name, businessName: supplier.category, profileImage: null } }
    });
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
          {displaySubs.map((sub, idx) => (
            <div key={idx} className="relative border border-zinc-200 rounded-md overflow-hidden w-10 h-10 flex-shrink-0 group/prod cursor-pointer">
              <img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/prod:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/prod:opacity-100 transition-opacity duration-200 flex items-center justify-center p-1"><span className="text-[8px] text-white font-bold text-center leading-tight">{sub.name}</span></div>
            </div>
          ))}
          {remainingCount > 0 && <div className="border border-dashed border-zinc-300 rounded-md w-10 h-10 flex items-center justify-center text-xs text-zinc-500 font-bold bg-zinc-50">+{remainingCount}</div>}
        </div>

        <div className="flex gap-2">
          {isPendingReq ? (
            <button onClick={() => onAccept(supplier.connectionId)} className="flex-1 py-2.5 text-xs font-bold text-white rounded-lg shadow-sm hover:scale-[1.02] transition-transform bg-emerald-500">Accept Request</button>
          ) : isConnected ? (
            <>
              <button onClick={handleMessageClick} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"><MessageSquare size={14} /> Message</button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-md transition-all"><Package size={14} /> Order Now</button>
            </>
          ) : connectStatus === 'PENDING' ? (
             <button disabled className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 text-slate-500 rounded-lg shadow-inner cursor-not-allowed">Requested</button>
          ) : (
            <>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"><Building2 size={14} /> View Profile</button>
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

export default function ConnectedSupplierPage() {
  const navigate = useNavigate();
  const [connectedSuppliers, setConnectedSuppliers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [discoverSuppliers, setDiscoverSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequests, setShowRequests] = useState(false);
  const [liveToast, setLiveToast] = useState(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, { withCredentials: true }),
      debug: () => {}, 
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const notification = JSON.parse(message.body);
          setLiveToast(notification);
          setTimeout(() => setLiveToast(null), 5000);

          if (notification.type === 'NEW_REQUEST') setPendingRequests(prev => [notification.payload, ...prev]);
          else if (notification.type === 'ACCEPTED') fetchNetworkData();
        });
      }
    });
    client.activate();
    return () => { if (client.active) client.deactivate(); };
  }, []);

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const [connectedRes, pendingRes, discoverRes] = await Promise.all([
        networkApi.getConnectedSuppliers().catch(() => ({ data: { data: [] } })),
        networkApi.getPendingRequests().catch(() => ({ data: { data: [] } })),
        networkApi.getNearbySellers().catch(() => ({ data: { data: [] } }))
      ]);
      
      const connectedData = connectedRes.data?.data || [];
      setConnectedSuppliers(connectedData);
      setPendingRequests(pendingRes.data?.data || []);

      // 🧠 SMART SUGGESTION ENGINE: Strict Max 6, Hide Connected, Newest Top.
      const connectedIds = connectedData.map(c => c.id);
      const nearby = discoverRes.data?.data || [];
      
      const filteredNearby = nearby.filter(user => !connectedIds.includes(user.id));
      setDiscoverSuppliers(filteredNearby.slice(0, 6)); // Cap at 6
    } catch (err) { console.error("Failed to fetch data", err); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchNetworkData(); }, []);

  const handleAccept = async (connectionId) => {
    try {
      await networkApi.acceptConnection(connectionId);
      fetchNetworkData(); 
    } catch (err) { console.error(err); }
  };

  const filteredConnections = connectedSuppliers.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasConnections = connectedSuppliers.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-semibold">Loading your supply network...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <AnimatePresence><LiveToast notification={liveToast} onClose={() => setLiveToast(null)} /></AnimatePresence>

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 {...fadeUp(0)} className="text-[24px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">Conneted Network</motion.h1>
            <motion.p {...fadeUp(0.1)} className="text-slate-500 mt-2 text-base">Manage your active trading partners and requests.</motion.p>
          </div>
          
          <motion.div {...fadeUp(0.2)} className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search connections..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-indigo-500 shadow-sm" />
            </div>
            <button onClick={() => setShowRequests(!showRequests)} className="relative px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex items-center gap-2 transition-all">
              <Bell size={16} /> Requests
              {pendingRequests.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[#FAFAFA] animate-pulse">{pendingRequests.length}</span>}
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {showRequests && pendingRequests.length > 0 && (
            <motion.section initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-10 overflow-hidden">
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2"><Bell size={16}/> Incoming Connection Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingRequests.map((req, i) => <SupplierCard key={req.id} supplier={req} index={i} isPendingReq={true} onAccept={handleAccept} />)}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="mb-12">
          <motion.div {...fadeUp(0.2)} className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-200">
            <div className="p-2 bg-slate-100 rounded-lg border border-slate-200"><Users className="w-5 h-5 text-slate-700" /></div>
            <h2 className="text-xl font-bold text-slate-900">Active Connections <span className="text-slate-400 text-base font-normal ml-2">({filteredConnections.length})</span></h2>
          </motion.div>

          {filteredConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredConnections.map((supplier, i) => <SupplierCard key={supplier.id} supplier={supplier} index={i} isConnected={true} />)}
              </AnimatePresence>
            </div>
          ) : hasConnections ? (
            <div className="text-center py-10 text-slate-500">No connections match your search.</div>
          ) : (
            <motion.div {...fadeUp(0.3)} className="bg-white border border-slate-200 shadow-sm rounded-3xl p-10 text-center max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-100"><Compass className="w-10 h-10" /></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Your network is currently empty</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed text-sm">You haven't connected with any verified businesses yet. Establish connections to view pricing and chat directly.</p>
                <button onClick={() => navigate('/nearbyseller')} className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg text-white rounded-xl font-bold hover:scale-[1.02] flex items-center gap-2 mx-auto">
                  Discover Nearby Partners <Navigation className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {discoverSuppliers.length > 0 && (
          <section className="pt-6 border-t border-slate-200">
            <motion.div {...fadeUp(0.4)} className="flex items-end justify-between mb-8 mt-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> Suggested for you</h2>
                <p className="text-slate-500 text-sm">Top-rated businesses in your district.</p>
              </div>
              <button onClick={() => navigate('/nearbyseller')} className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 hover:gap-2.5 transition-all px-4 py-2">
                See more <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-95">
              {discoverSuppliers.map((supplier, i) => (
                <SupplierCard key={supplier.id} supplier={supplier} index={i} isConnected={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
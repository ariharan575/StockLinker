import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { Search, Bell, Users, Compass, Navigation, Sparkles, ArrowRight } from 'lucide-react';

// External imports - Adjust paths based on your setup
import { networkApi } from '../../auth/services/api'; 
import { PremiumToast } from "../../components/PremiumToast";
import { DataFetchError } from "../../components/DataFetchError";

// Internal modular imports
import SupplierCard from '../components/SupplierCard';
import SupplierCardSkeleton from '../components/SupplierCardSkeleton';
import { fadeUp } from '../utils/animationUtils';

export default function ConnectedSupplierPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequests, setShowRequests] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedSupplierForModal, setSelectedSupplierForModal] = useState(null);
  
  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  useEffect(() => {
    if (location.state?.openRequests) {
      setShowRequests(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const { 
    data: networkData, 
    isLoading, 
    isError,
    error: fetchError,
    refetch 
  } = useQuery({
    queryKey: ['connectedNetworkData'],
    queryFn: async () => {
      const [connectedRes, pendingRes, discoverRes] = await Promise.all([
        networkApi.getConnectedSuppliers(),
        networkApi.getPendingRequests().catch(() => ({ data: { data: [] } })),
        networkApi.getNearbySellers().catch(() => ({ data: { data: { content: [] } } }))
      ]);
      
      const connectedData = connectedRes.data?.data || [];
      const pendingData = pendingRes.data?.data || [];
      
      const nearbyRawData = discoverRes.data?.data;
      const nearby = Array.isArray(nearbyRawData) 
          ? nearbyRawData 
          : (nearbyRawData?.content || []);
      
      const connectedIds = connectedData.map(c => c.id);
      const filteredNearby = nearby.filter(user => !connectedIds.includes(user.id));

      return {
        connectedSuppliers: connectedData,
        pendingRequests: pendingData,
        discoverSuppliers: filteredNearby.slice(0, 6)
      };
    },
    staleTime: 60 * 1000, 
  });

  const connectedSuppliers = networkData?.connectedSuppliers || [];
  const pendingRequests = networkData?.pendingRequests || [];
  const discoverSuppliers = networkData?.discoverSuppliers || [];

     const backendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:8080';
    const wsUrl = `${backendUri}/ws`;

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl, null, { withCredentials: true }),
      debug: () => {}, 
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const notif = JSON.parse(message.body);
          const type = notif.type ? String(notif.type).toUpperCase() : '';
          
          let title = notif.title;
          if (!title) {
             title = type === 'CONNECTION' ? 'Connection Request' : 'Notification';
          }
          
          if (type === 'CONNECTION') {
             showNotification('info', `${title} - ${notif.message || 'You have a new update.'}`);
             queryClient.invalidateQueries({ queryKey: ['connectedNetworkData'] });
          }
        });
      }
    });
    client.activate();
    return () => { if (client.active) client.deactivate(); };
  }, [queryClient]);

  const handleAccept = async (connectionId) => {
    try {
      await networkApi.acceptConnection(connectionId);
      showNotification('success', 'Connection request accepted!');
      await queryClient.invalidateQueries({ queryKey: ['connectedNetworkData'] }); 
    } catch (err) { 
      console.error(err); 
      showNotification('error', 'Failed to accept connection request.');
      throw err; 
    }
  };

  const filteredConnections = connectedSuppliers.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasConnections = connectedSuppliers.length > 0;

  if (isError) {
    return (
      <DataFetchError 
        errorTitle="Connection Failed"
        errorMessage={fetchError?.response?.data?.message || fetchError?.message || "An unexpected error occurred."} 
        onRetry={refetch} 
      />
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
        <PremiumToast 
          isVisible={!!notification} 
          type={notification?.type || 'info'} 
          message={notification?.msg} 
          onClose={() => setNotification(null)} 
        />

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 {...fadeUp(0)} className="text-[24px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">Connected Network</motion.h1>
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
                  {pendingRequests.map((req, i) => <SupplierCard key={req.id} supplier={req} index={i} isPendingReq={true} onAccept={handleAccept} onNotify={showNotification} onShowMore={setSelectedSupplierForModal} />)}
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <SupplierCardSkeleton key={i} />)}
            </div>
          ) : filteredConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredConnections.map((supplier, i) => <SupplierCard key={supplier.id} supplier={supplier} index={i} isConnected={true} onNotify={showNotification}  />)}
              </AnimatePresence>
            </div>
          ) : hasConnections ? (
            <div className="text-center py-10 text-slate-500">No connections match your search.</div>
          ) : (
            <motion.div {...fadeUp(0.3)} className="bg-gradient-to-b from-white to-slate-50 border border-slate-200 shadow-sm rounded-[24px] p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative">
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl animate-pulse" />
                  <Compass className="w-10 h-10 text-indigo-500 relative z-10" />
                </div>
                <h3 className="font-sora text-[22px] font-extrabold text-slate-900 mb-2 tracking-tight">Your network is currently empty</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed text-[14px]">You haven't connected with any verified businesses yet. Establish connections to view pricing and chat directly.</p>
                <button onClick={() => navigate('/nearby')} className="px-8 py-3.5 bg-black text-white shadow-lg rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
                  Discover Nearby Partners <Navigation className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {isLoading ? (
          <div className="pt-6 border-t border-slate-200">
            <div className="h-6 bg-slate-200 rounded w-48 mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <SupplierCardSkeleton key={i} />)}
            </div>
          </div>
        ) : discoverSuppliers.length > 0 && (
          <section className="pt-6 border-t border-slate-200">
            <motion.div {...fadeUp(0.4)} className="flex items-end justify-between mb-8 mt-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> Suggested for you</h2>
                <p className="text-slate-500 text-sm">Top-rated businesses in your district.</p>
              </div>
              <button onClick={() => navigate('/nearby')} className="text-sm font-bold text-indigo-600 flex items-center gap-1.5 hover:gap-2.5 transition-all px-4 py-2">
                See more <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-95">
              {discoverSuppliers.map((supplier, i) => (
                <SupplierCard key={supplier.id} supplier={supplier} index={i} isConnected={false} onNotify={showNotification}  />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
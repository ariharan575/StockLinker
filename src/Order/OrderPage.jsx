import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { 
  Search, MapPin, CheckCircle2, Truck, ShoppingCart, Loader2, 
  ShieldCheck, X, AlertCircle, Download, Clock, Play, Map, ChevronUp, ChevronDown 
} from 'lucide-react';
import { orderApi } from './Services/api';
import { networkApi } from '../Authentication/services/api';
import { useAuth } from '../Authentication/context/AuthContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

import { PremiumToast } from "../components/PremiumToast";
import { DataFetchError } from "../components/DataFetchError";

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "PENDING", label: "Pending Requests" },
  { key: "PROCESSING", label: "Processing" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

const STATUS_STYLES = {
  DELIVERED: "bg-[#ECFDF3] text-[#067647] border-[#DCFAE6]",
  PROCESSING: "bg-slate-100 text-black border-slate-300",
  OUT_FOR_DELIVERY: "bg-pink-50 text-pink-600 border-pink-200",
  CANCELLED: "bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]",
  PENDING: "bg-slate-50 text-slate-600 border-slate-200",
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// ============================================================
// ✅ PREMIUM SKELETON LOADERS
// ============================================================
const OrderCardSkeleton = () => (
  <div className="rounded-[20px] bg-white border border-slate-100 p-5 sm:p-6 shadow-sm animate-pulse">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-4 sm:pb-5 sm:mb-5">
      <div className="w-full md:w-1/2">
        <div className="h-6 bg-slate-200 rounded-lg w-1/2 mb-3" />
        <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="w-full md:w-1/4 flex flex-col md:items-end">
        <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
        <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
      <div className="h-5 bg-slate-100 rounded w-1/3" />
      <div className="flex gap-3 w-full md:w-auto">
        <div className="h-10 bg-slate-200 rounded-xl w-full md:w-28" />
        <div className="h-10 bg-slate-200 rounded-xl w-full md:w-32" />
      </div>
    </div>
  </div>
);

const TrackerSkeleton = () => (
  <div className="relative pl-4 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6 animate-pulse mt-4">
    <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="relative z-10 flex items-start gap-4">
        <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white shrink-0 mt-0.5" />
        <div className="flex flex-col pt-0.5 w-full pr-4">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// ============================================================
// ✅ WORLD-CLASS SAAS EMPTY STATE
// ============================================================
function PremiumEmptyState({ role, onExplore }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-[24px] shadow-sm p-6 text-center mt-2 relative overflow-hidden h-[450px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
      <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 z-10">
        <div className="absolute inset-0 bg-pink-500/5 rounded-2xl animate-pulse" />
        <ShoppingCart className="w-8 h-8 text-slate-300 relative z-10" strokeWidth={2} />
      </div>
      <h3 className="font-sora text-[20px] font-extrabold text-slate-800 mb-2 tracking-tight">
        No orders found
      </h3>
      <p className="text-[14px] text-slate-500 font-medium max-w-md mb-8 leading-relaxed">
        {role === 'WHOLESALER' 
          ? 'You have no orders matching this status right now. Check back later for incoming requests.' 
          : "You haven't placed any wholesale orders matching this status. Discover suppliers to start buying."}
      </p>
      {role !== 'WHOLESALER' && (
        <button onClick={onExplore} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-[13px] hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center gap-2">
          <MapPin size={16} /> Explore Nearby Sellers
        </button>
      )}
    </div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function OrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth(); 
  
  const [pageRole, setPageRole] = useState(null); 
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [notification, setNotification] = useState(null);

  // Live Tracking State
  const [activeRouteOrderId, setActiveRouteOrderId] = useState(null);
  
  // Modal States
  const [modalOrder, setModalOrder] = useState(null); 
  const [acceptModalOrder, setAcceptModalOrder] = useState(null);
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [routeBuilderModalOpen, setRouteBuilderModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  
  // Action Form States
  const [scheduledDate, setScheduledDate] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [routeOrders, setRouteOrders] = useState([]);
  const [isSavingRoute, setIsSavingRoute] = useState(false);

  // --- NOTIFICATION HANDLER ---
  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  // ✅ 1. Fetch Orders via TanStack Query
  const { 
    data: ordersData, 
    isLoading: isOrdersLoading, 
    isError: isOrdersError,
    error: ordersError, // Extracting the precise error object here
    refetch: refetchOrders 
  } = useQuery({
    queryKey: ['ordersList', activeTab],
    queryFn: async () => {
      const response = await orderApi.getOrders(activeTab);
      return {
        orders: response.data.orders || [],
        userRole: response.data.userRole || 'SHOPKEEPER'
      };
    },
    staleTime: 60 * 1000, // Data remains fresh for 60 seconds
  });

  const orders = ordersData?.orders || [];

  // ✅ Automatically assign role and initial tracker state based on fetched data
  useEffect(() => {
    if (ordersData) {
      setPageRole(ordersData.userRole);
      if (!activeRouteOrderId && ordersData.orders.length > 0) {
        const active = ordersData.orders.find(o => ['PROCESSING', 'OUT_FOR_DELIVERY'].includes(o.status));
        if (active) setActiveRouteOrderId(active.id);
      }
    }
  }, [ordersData, activeRouteOrderId]);

  // ✅ 2. Fetch Live Route via TanStack Query
  const { data: liveRoute = [], isLoading: isLoadingRoute } = useQuery({
    queryKey: ['liveRoute', activeRouteOrderId],
    queryFn: async () => {
      const response = await orderApi.getDeliveryRoute(activeRouteOrderId); 
      return (response.data || []).map(stop => ({
        id: stop.orderId,
        companyName: stop.buyerName,
        status: stop.status,
        time: stop.time,
        isPast: stop.status === 'DELIVERED',
        isActive: stop.status === 'OUT_FOR_DELIVERY',
        isPending: stop.status === 'PROCESSING'
      }));
    },
    enabled: !!activeRouteOrderId, // Only fetch when an order is selected
    staleTime: 30 * 1000, 
  });

  // ✅ 3. STOMP WebSocket Live Connection
  useEffect(() => {
    if (!user?.id) return;
    const socket = new SockJS('http://localhost:8080/ws'); 
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/orders/${user.id}`, (message) => {
        if (message.body) {
          // Trigger a silent background refetch when WebSocket ping arrives
          queryClient.invalidateQueries({ queryKey: ['ordersList'] });
          if (activeRouteOrderId) {
            queryClient.invalidateQueries({ queryKey: ['liveRoute', activeRouteOrderId] });
          }
        }
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [user?.id, queryClient, activeRouteOrderId]);

  // --- CONTROLLER ACTIONS ---

  const handleAcceptSubmit = async () => {
    if (!scheduledDate) return showNotification("error", "Please select a delivery date");
    try {
      await orderApi.acceptAndSchedule(acceptModalOrder.id, scheduledDate);
      
      const res = await orderApi.getOrdersByDate(scheduledDate);
      setRouteOrders(res.data || []);
      setAcceptModalOrder(null);
      setRouteBuilderModalOpen(true);
      showNotification("success", "Order accepted successfully!");
      refetchOrders();
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to accept order");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason) return showNotification("error", "Please specify a rejection reason.");
    try {
      await orderApi.rejectOrder(rejectModalOrder.id, rejectionReason);
      setRejectModalOrder(null);
      setRejectionReason("");
      showNotification("success", "Order rejected successfully.");
      refetchOrders();
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to reject order");
    }
  };

  const moveRouteItem = (dragIndex, hoverIndex) => {
    const updated = [...routeOrders];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, moved);
    setRouteOrders(updated);
  };

  const handleSaveRouteSequence = async () => {
    setIsSavingRoute(true);
    try {
      const orderedIds = routeOrders.map(o => o.id);
      await orderApi.updateRouteSequence(scheduledDate, orderedIds);
      setRouteBuilderModalOpen(false);
      showNotification("success", "Route sequence saved!");
      refetchOrders();
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to save route sequence");
    } finally {
      setIsSavingRoute(false);
    }
  };

  const handleStartDeliveryRoute = async (date) => {
    if (!date) {
      showNotification("error", "Cannot start route: No delivery date assigned to this order.");
      return;
    }

    const formattedDate = Array.isArray(date) ? date.join('-') : date;

    if(!window.confirm(`Start delivery route for ${formattedDate}? All scheduled orders for this date will be marked 'Out for Delivery'.`)) return;
    
    try {
      await orderApi.startRouteForDate(formattedDate);
      showNotification("success", "Delivery route started successfully!");
      refetchOrders();
    } catch (error) {
      console.error(error);
      showNotification("error", error.response?.data?.message || "Failed to start route.");
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await orderApi.markDelivered(orderId);
      showNotification("success", "Order marked as delivered!");
      refetchOrders();
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to update status to DELIVERED");
    }
  };

  const displayOrders = orders.filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  // =====================================
  // REUSABLE TRACKER CONTENT
  // =====================================
  const TrackerContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <Map size={18} />
        </div>
        <div>
          <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-black leading-tight">
            Delivery Tracker
          </h3>
          <p className="text-[12px] font-medium text-slate-500">Live route sequence monitor.</p>
        </div>
      </div>

      {isLoadingRoute ? (
        <TrackerSkeleton />
      ) : !activeRouteOrderId || liveRoute.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-full my-auto py-12">
          <Truck size={32} className="text-slate-200 mb-4" />
          <p className="text-[13px] font-medium text-slate-500 max-w-[200px]">Select an active order to view its delivery route.</p>
        </div>
      ) : (
        <div className="relative pl-4 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
          {/* Background Path Line */}
          <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
          
          {liveRoute.map((stop, i) => (
            <div key={stop.id} className="relative z-10 flex items-start gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white shrink-0 mt-0.5 transition-all duration-300 ${stop.isPast ? 'border-[#17B26A]' : stop.isActive ? 'border-pink-500 ring-4 ring-pink-500/20' : 'border-slate-200'}`}>
                {stop.isPast && <CheckCircle2 size={14} className="text-[#17B26A]"/>}
                {stop.isActive && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"/>}
                {!stop.isPast && !stop.isActive && <span className="text-[10px] font-extrabold text-slate-400">{i+1}</span>}
              </div>

              <div className="flex flex-col pt-0.5">
                <p className={`text-[14px] font-extrabold ${stop.companyName.includes('(You)') ? 'text-pink-600' : 'text-black'}`}>{stop.companyName}</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                  {stop.isPast ? <CheckCircle2 size={12} className="text-[#17B26A]"/> : stop.isActive ? <Truck size={12} className="text-pink-500"/> : <Clock size={12}/>}
                  {stop.isPast ? 'Delivered successfully' : stop.isActive ? 'Truck is on the way' : 'Pending in queue'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}} />

      <PremiumToast 
        isVisible={!!notification} 
        type={notification?.type || 'info'} 
        message={notification?.msg} 
        onClose={() => setNotification(null)} 
      />

      <div className="bg-[#FAFAFA] font-['Inter',_sans-serif] text-[#0F1626] p-4 md:p-5 pb-24 min-h-screen">
        {/* ✅ ERROR COMPONENT RENDERING */}
        {isOrdersError ? (
          <DataFetchError 
            errorTitle="Connection Failed"
            errorMessage={ordersError?.response?.data?.message || ordersError?.message || "An unexpected error occurred."} 
            onRetry={refetchOrders} 
          />
        ) : (
          <div className="max-w-[1440px] mx-auto flex flex-col gap-6 sm:gap-8">
            
            {/* Main Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2 sm:mt-2">
              <div>
                <h1 className="text-[24px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
                   My Orders
                </h1>
                <p className="text-[13px] sm:text-[14px] font-medium text-slate-500 mt-1">
                  {pageRole === 'WHOLESALER' ? 'Manage incoming requests, schedule deliveries, and sequence your routes.' : 'Track live deliveries, view invoices, and review order history.'}
                </p>
              </div>
              <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} strokeWidth={2} />
                <input 
                  type="text" 
                  placeholder="Search order ID..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm" 
                />
              </div>
            </div>

            {/* Navigation Tabs (Hidden Scrollbar) */}
            <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-200 overflow-x-auto no-scrollbar pb-px mt-6">
              {TABS.map(tab => (
                <button 
                  key={tab.key} 
                  onClick={() => setActiveTab(tab.key)} 
                  className={`pb-3 text-[13px] sm:text-[14px] font-bold whitespace-nowrap transition-all border-b-[3px] ${activeTab === tab.key ? 'border-black text-black' : 'border-transparent text-slate-600 hover:text-black'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-6 items-start">
              
              {/* LEFT COLUMN: Order List */}
              <div className="space-y-4">
                {isOrdersLoading ? (
                  <>
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                  </>
                ) : displayOrders.length === 0 ? (
                  // ✅ WORLD-CLASS EMPTY STATE
                  <PremiumEmptyState 
                    role={pageRole} 
                    onExplore={() => navigate('/nearby')} 
                  />
                ) : (
                  displayOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => setActiveRouteOrderId(order.id)}
                      className={`rounded-[20px] bg-white border p-5 sm:p-6 transition-all cursor-pointer ${activeRouteOrderId === order.id ? 'border-pink-500 shadow-md ring-1 ring-pink-500/10' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 sm:pb-5  sm:mb-5">
                        <div>
                          <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[16px] sm:text-[18px] text-black flex items-center flex-wrap gap-2 sm:gap-2.5">
                            {order.orderNumber}
                            <span className={`text-[9px] sm:text-[10px] font-extrabold px-2.5 py-0.5 rounded border tracking-widest uppercase whitespace-nowrap ${STATUS_STYLES[order.status] || "bg-slate-100"}`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </h3>
                          <p className="text-[12px] sm:text-[13px] text-slate-500 mt-1.5 font-medium">Placed: {new Date(order.placedAt).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                          {order.deliveryDate && <p className="text-[12px] sm:text-[13px] font-bold text-black mt-1.5 flex items-center gap-1.5"><Clock size={14} className="text-pink-500"/> Scheduled Delivery: {order.deliveryDate}</p>}
                          {order.rejectionReason && <p className="text-[12px] sm:text-[13px] font-bold text-rose-600 mt-1.5">Reason: {order.rejectionReason}</p>}
                        </div>
                        <div className="text-left md:text-right">
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Amount</span>
                          <span className="font-['Manrope',_sans-serif] text-[20px] sm:text-[24px] font-extrabold text-black">{formatINR(order.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="text-[13px] sm:text-[14px] font-bold text-slate-700 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-pink-500"/> {pageRole === 'WHOLESALER' ? order.buyerName : order.sellerName} <span className="text-slate-300 mx-1">•</span> {order.totalItems} Items
                        </div>

                        <div className="flex flex-wrap items-center gap-1 sm:gap-3 w-full md:w-auto">
                          
                          {/* WHOLESALER ONLY ACTIONS */}
                          {pageRole === 'WHOLESALER' && order.status === 'PENDING' && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setRejectModalOrder(order); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Reject</button>
                              <button onClick={(e) => { e.stopPropagation(); setAcceptModalOrder(order); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95">Accept Order</button>
                            </>
                          )}
                          
                          {pageRole === 'WHOLESALER' && order.status === 'PROCESSING' && (
                            <button onClick={(e) => { e.stopPropagation(); handleStartDeliveryRoute(order.deliveryDate); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-slate-200  text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-400 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95">
                              <Play size={16} fill="currentColor"/> Start Delivery
                            </button>
                          )}

                          {pageRole === 'WHOLESALER' && order.status === 'OUT_FOR_DELIVERY' && (
                            <button onClick={(e) => { e.stopPropagation(); handleMarkDelivered(order.id); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-[#067647] text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-[#05603a] transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95">
                              <CheckCircle2 size={16}/> Delivered
                            </button>
                          )}

                          {/* MOBILE LIVE TRACKER BUTTON */}
                          {['PROCESSING', 'OUT_FOR_DELIVERY'].includes(order.status) && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); setActiveRouteOrderId(order.id); setIsTrackerModalOpen(true); }} 
                               className="xl:hidden flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-pink-50 border border-pink-200 text-pink-600 text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-pink-100 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                             >
                               <Map size={16}/> Track Live
                             </button>
                          )}

                          {/* UNIVERSAL ACTION */}
                          <button onClick={(e) => { e.stopPropagation(); setModalOrder(order); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-black border border-slate-200 text-white text-[12px] sm:text-[13px] font-bold rounded-xl cursor-pointer transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* RIGHT COLUMN: Live Animated Delivery Tracker (Desktop Only) */}
              <div className="hidden xl:block bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm sticky top-24 min-h-[450px]">
                <TrackerContent />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* --- OVERLAY MODALS --- */}

      {/* MOBILE LIVE TRACKER MODAL */}
      {!isOrdersError && isTrackerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
           <div className="bg-white rounded-t-[24px] sm:rounded-[24px] w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
              <div className="flex justify-end p-4 pb-0">
                 <button onClick={() => setIsTrackerModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-black rounded-full hover:bg-slate-100 transition-colors">
                    <X size={18}/>
                 </button>
              </div>
              <div className="p-6 pt-2 flex-1 overflow-y-auto no-scrollbar">
                 <TrackerContent />
              </div>
           </div>
        </div>
      )}

      {/* 1. ORDER DETAILS MANIFEST MODAL */}
      {!isOrdersError && modalOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-start p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="font-['Manrope',_sans-serif] text-[18px] sm:text-[22px] font-extrabold text-black flex items-center flex-wrap gap-2 sm:gap-3">
                  Order {modalOrder.orderNumber}
                  <span className={`text-[9px] sm:text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded border uppercase whitespace-nowrap ${STATUS_STYLES[modalOrder.status]}`}>
                    {modalOrder.status.replace(/_/g, ' ')}
                  </span>
                </h2>
                <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1">
                  Placed on {new Date(modalOrder.placedAt).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                </p>
              </div>
              <button onClick={() => setModalOrder(null)} className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-100 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 no-scrollbar">
              
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Left: Delivery & Invoice */}
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Delivery & Invoice</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="flex justify-between items-center text-[12px] sm:text-[13px]">
                      <span className="text-slate-500 font-medium">{['DELIVERED'].includes(modalOrder.status) ? 'Delivered on' : 'Scheduled on'}</span>
                      <span className="font-bold text-black">{modalOrder.deliveryDate ? new Date(modalOrder.deliveryDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : 'Pending Assignment'}</span>
                    </div>
                    {modalOrder.invoice && (
                      <div className="flex justify-between items-center text-[12px] sm:text-[13px] border-b border-slate-200 pb-4 mb-4">
                        <span className="text-slate-500 font-medium">Invoice ID</span>
                        <span className="font-bold text-black">{modalOrder.invoice.invoiceNumber}</span>
                      </div>
                    )}
                    <button className="w-full py-2.5 bg-white border border-slate-200 text-[12px] sm:text-[13px] font-bold text-black rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <Download size={16} /> Download Invoice
                    </button>
                  </div>
                </div>

                {/* Right: Seller/Buyer Details */}
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">{pageRole === 'WHOLESALER' ? 'Buyer Details' : 'Seller Details'}</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col h-full">
                    <h3 className="font-['Manrope',_sans-serif] text-[15px] sm:text-[16px] font-extrabold text-black flex items-center gap-1.5">
                      {pageRole === 'WHOLESALER' ? modalOrder.buyerName : modalOrder.sellerName} <ShieldCheck size={16} className="text-pink-500" />
                    </h3>
                    <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 flex items-start sm:items-center gap-1.5 mt-1.5 mb-auto leading-tight"><MapPin size={14} className="shrink-0 mt-0.5 sm:mt-0"/> {pageRole === 'WHOLESALER' ? modalOrder.buyerLocation : modalOrder.sellerLocation}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border-t border-slate-200 pt-4 mt-4">
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-bold text-slate-400">Business Type</p>
                        <p className="text-[12px] sm:text-[13px] font-bold text-black mt-0.5">{pageRole === 'WHOLESALER' ? 'Shopkeeper' : modalOrder.sellerBusinessType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-bold text-slate-400">GSTIN</p>
                        <p className="text-[12px] sm:text-[13px] font-bold text-black mt-0.5">{modalOrder.invoice?.sellerGstin || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Table */}
              <div>
                <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Product Details ({modalOrder.totalItems} Items)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto no-scrollbar">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50 border-b border-slate-200 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      <span>Product Name</span>
                      <span>SKU</span>
                      <span>Quantity</span>
                      <span>Rate</span>
                      <span className="text-right">Total</span>
                    </div>
                    <div className="divide-y divide-slate-100 bg-white">
                      {modalOrder.items?.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-4 px-4 sm:px-5 py-3 sm:py-4 items-center hover:bg-slate-50/50 transition-colors">
                          <span className="text-[12px] sm:text-[13px] font-bold text-black truncate">{item.productName}</span>
                          <span className="text-[12px] sm:text-[13px] font-medium text-slate-500">{item.sku}</span>
                          <span className="text-[12px] sm:text-[13px] font-medium text-black">{item.quantity} Units</span>
                          <span className="text-[12px] sm:text-[13px] font-medium text-black">₹{item.price.toLocaleString('en-IN')}</span>
                          <span className="text-[13px] sm:text-[14px] font-extrabold text-black text-right">₹{item.lineTotal.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4 sm:gap-6">
                
                {/* Left: Delivery Timeline */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Order Status Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#ECFDF3] text-[#17B26A] flex items-center justify-center shrink-0"><CheckCircle2 size={12} strokeWidth={3}/></div>
                      <span className="text-[12px] sm:text-[13px] font-bold text-black">Order Placed</span>
                    </div>
                    {modalOrder.confirmedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#ECFDF3] text-[#17B26A] flex items-center justify-center shrink-0"><CheckCircle2 size={12} strokeWidth={3}/></div>
                        <span className="text-[12px] sm:text-[13px] font-bold text-black">Order Accepted & Processed</span>
                      </div>
                    )}
                    {modalOrder.outForDeliveryAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0"><Truck size={12}/></div>
                        <span className="text-[12px] sm:text-[13px] font-bold text-pink-600">Out for Delivery</span>
                      </div>
                    )}
                    {modalOrder.deliveredAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#ECFDF3] text-[#17B26A] flex items-center justify-center shrink-0"><CheckCircle2 size={12} strokeWidth={3}/></div>
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#067647]">Delivered Successfully</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Bill Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col justify-center">
                  <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bill Summary</h4>
                  <div className="space-y-3 border-b border-slate-200 pb-4 mb-4">
                    <div className="flex justify-between text-[12px] sm:text-[13px] font-medium text-slate-600">
                      <span>Subtotal Amount</span>
                      <span className="font-bold text-black">₹{modalOrder.invoice?.subtotal.toLocaleString('en-IN') || modalOrder.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[12px] sm:text-[13px] font-medium text-slate-600">
                      <span>Discount</span>
                      <span className="font-bold text-black">₹{modalOrder.invoice?.discount.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <div className="flex justify-between text-[12px] sm:text-[13px] font-medium text-slate-600">
                      <span>Tax (0%)</span>
                      <span className="font-bold text-black">₹{modalOrder.invoice?.tax.toLocaleString('en-IN') || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] sm:text-[14px] font-bold text-black uppercase tracking-wide">Total Amount</span>
                    <span className="font-['Manrope',_sans-serif] text-[20px] sm:text-[22px] font-extrabold text-black">₹{modalOrder.invoice?.finalAmount.toLocaleString('en-IN') || modalOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. WHolesaler ACCEPT & SCHEDULE MODAL */}
      {!isOrdersError && acceptModalOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[20px] text-black">Schedule Delivery</h3>
              <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1.5">Pick the planned delivery date for <b>{acceptModalOrder.buyerName}</b>.</p>
            </div>
            
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={e => setScheduledDate(e.target.value)} 
              className="w-full p-3.5 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] sm:text-[14px] font-bold text-black outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all" 
            />

            <div className="flex gap-3 pt-2">
              <button onClick={() => setAcceptModalOrder(null)} className="flex-1 py-2.5 sm:py-3 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Cancel</button>
              <button onClick={handleAcceptSubmit} className="flex-1 py-2.5 sm:py-3 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95">Set Date</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. WHOLESALER ROUTE SEQUENCING MODAL */}
      {!isOrdersError && routeBuilderModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[20px] text-black">Arrange Route</h3>
              <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1.5">Re-order stops in your physical delivery path for <b>{scheduledDate}</b>.</p>
            </div>

            <div className="space-y-3 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
              {routeOrders.map((ro, index) => (
                <div key={ro.id} className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 sm:gap-3.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-[12px] sm:text-[13px] flex items-center justify-center shrink-0">{index + 1}</span>
                    <span className="text-[13px] sm:text-[14px] font-bold text-black line-clamp-1">{ro.buyerName}</span>
                  </div>
                  <div className="flex gap-1 sm:gap-1.5">
                    <button disabled={index === 0} onClick={() => moveRouteItem(index, index - 1)} className="p-1.5 sm:p-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-40 transition-colors shadow-sm"><ChevronUp size={16}/></button>
                    <button disabled={index === routeOrders.length - 1} onClick={() => moveRouteItem(index, index + 1)} className="p-1.5 sm:p-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-40 transition-colors shadow-sm"><ChevronDown size={16}/></button>
                  </div>
                </div>
              ))}
              {routeOrders.length === 0 && <p className="text-[13px] font-medium text-slate-500 text-center py-6">No other orders scheduled for this date.</p>}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button onClick={handleSaveRouteSequence} disabled={isSavingRoute} className="w-full py-3 bg-black text-white text-[13px] sm:text-[14px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2">
                {isSavingRoute ? <Loader2 size={16} className="animate-spin"/> : "Save Route Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WHOLESALER REJECT MODAL */}
      {!isOrdersError && rejectModalOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0"><AlertCircle size={24}/></div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[18px] sm:text-[20px] text-black">Reject Request</h3>
            </div>
            <textarea 
              placeholder="Enter specific reason for rejection..." 
              value={rejectionReason} 
              onChange={e => setRejectionReason(e.target.value)} 
              className="w-full p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:border-black focus:ring-1 focus:ring-black transition-all h-24 sm:h-28 resize-none" 
            />
            <div className="flex gap-2 sm:gap-3 pt-2">
              <button onClick={() => setRejectModalOrder(null)} className="flex-1 py-2.5 sm:py-3 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Cancel</button>
              <button onClick={handleRejectSubmit} className="flex-1 py-2.5 sm:py-3 bg-rose-600 text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-md active:scale-95">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
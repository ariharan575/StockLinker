import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, CheckCircle2, Truck, ShoppingCart, Loader2, RotateCcw, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { orderApi, networkApi } from '../Authentication/services/api';
import { useAuth } from '../Authentication/context/AuthContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "PENDING", label: "Pending" },
  { key: "PROCESSING", label: "Processing" },
  { key: "OUT_FOR_DELIVERY", label: "Out of Delivery" },
  { key: "DELIVERED", label: "Delivered" },
  { key: "CANCELLED", label: "Cancelled" },
];

const STATUS_STYLES = {
  DELIVERED: "bg-[#ECFDF3] text-[#067647] border-[#DCFAE6]",
  PROCESSING: "bg-[#FFFAEB] text-[#B54708] border-[#FEF0C7]",
  OUT_FOR_DELIVERY: "bg-indigo-50 text-indigo-700 border-indigo-100",
  CANCELLED: "bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]",
  PENDING: "bg-slate-100 text-slate-600 border-slate-200",
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth(); // 'SHOPKEEPER' or 'WHOLESALER'
  
  const [activeTab, setActiveTab] = useState("all");
  const [modalOrder, setModalOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [liveRoute, setLiveRoute] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  // Quick Reorder / Discovery State
  const [bottomCards, setBottomCards] = useState([]);

  // Wholesaler Modals State
  const [acceptModalOrder, setAcceptModalOrder] = useState(null);
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [routeBuilderModalOpen, setRouteBuilderModalOpen] = useState(false);
  
  const [scheduledDate, setScheduledDate] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [routeOrders, setRouteOrders] = useState([]);
  const [isSavingRoute, setIsSavingRoute] = useState(false);

  // 1. Fetch Orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await orderApi.getOrders(activeTab, role);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, role]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 2. STOMP WebSocket Live Updates Subscription
  useEffect(() => {
    if (!user?.id) return;

    const socket = new SockJS('/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/orders/${user.id}`, (message) => {
        if (message.body) {
          fetchOrders(); // Live refresh
        }
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [user?.id, fetchOrders]);

  // 3. Live Delivery Tracker Hydration
  useEffect(() => {
    const fetchLiveRoute = async () => {
      const activeTracking = orders.filter(o => ['PROCESSING', 'OUT_FOR_DELIVERY'].includes(o.status));
      if (activeTracking.length > 0) {
        setIsLoadingRoute(true);
        try {
          const response = await orderApi.getDeliveryRoute(activeTracking[0].id); 
          const formattedRoute = (response.data || []).map(stop => ({
            id: stop.orderId,
            companyName: stop.buyerName,
            status: stop.status,
            time: stop.time,
            isPast: stop.status === 'DELIVERED',
            isActive: stop.status === 'OUT_FOR_DELIVERY' || stop.status === 'PROCESSING' 
          }));
          setLiveRoute(formattedRoute);
        } catch (error) {
          console.error("Failed to load live route", error);
        } finally {
          setIsLoadingRoute(false);
        }
      } else {
        setLiveRoute([]);
      }
    };

    if (!isLoading) fetchLiveRoute();
  }, [orders, isLoading]);

  // 4. Compute Hybrid Bottom Section (Quick Reorder / Discovery)
  useEffect(() => {
    const buildBottomSection = async () => {
      let cards = [];
      const delivered = orders.filter(o => o.status === 'DELIVERED');
      cards = delivered.map(o => ({ type: 'REORDER', data: o }));

      if (cards.length < 3) {
        try {
          // Wrap in try-catch in case networkApi is not fully defined yet, fail gracefully
          if (networkApi && networkApi.getNearbySellers) {
            const res = await networkApi.getNearbySellers({}); 
            const networkData = res.data?.data || [];
            const needed = 3 - cards.length;
            const networkCards = networkData.slice(0, needed).map(n => ({ type: 'DISCOVERY', data: n }));
            cards = [...cards, ...networkCards];
          }
        } catch (e) {
          console.error("Failed to fetch suggestions", e);
        }
      }
      setBottomCards(cards.slice(0, 3));
    };
    if (!isLoading) buildBottomSection();
  }, [orders, isLoading]);

  // Actions
  const handleAcceptSubmit = async () => {
    if (!scheduledDate) return alert("Please select a delivery date");
    try {
      await orderApi.acceptAndSchedule(acceptModalOrder.id, scheduledDate);
      setAcceptModalOrder(null);
      fetchOrders();
    } catch (error) {
      alert("Failed to accept order");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason) return alert("Please specify rejection reason");
    try {
      await orderApi.rejectOrder(rejectModalOrder.id, rejectionReason);
      setRejectModalOrder(null);
      setRejectionReason("");
      fetchOrders();
    } catch (error) {
      alert("Failed to reject order");
    }
  };

  const handleOpenRouteBuilder = async () => {
    if (!scheduledDate) return;
    try {
      const res = await orderApi.getOrdersByDate(scheduledDate);
      setRouteOrders(res.data || []);
      setRouteBuilderModalOpen(true);
    } catch (error) {
      alert("Failed to fetch route orders");
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
      fetchOrders();
    } catch (error) {
      alert("Failed to save route sequence");
    } finally {
      setIsSavingRoute(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await orderApi.markDelivered(orderId);
      fetchOrders();
    } catch (error) {
      alert("Failed to update status to DELIVERED");
    }
  };

  let displayOrders = orders.filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}} />

      <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] text-[#0F1626] p-4 md:p-8 pb-24">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-['Manrope',_sans-serif] text-[28px] font-extrabold tracking-tight text-slate-900">
                {role === 'WHOLESALER' ? 'Incoming Procurement Requests' : 'My Orders'}
              </h1>
              <p className="text-[14px] font-medium text-slate-500 mt-1">
                {role === 'WHOLESALER' ? 'Review, schedule delivery routes, and confirm shopkeeper orders.' : 'Track live deliveries, view tax invoices, and review procurement history.'}
              </p>
            </div>
            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} strokeWidth={2} />
              <input type="text" placeholder="Search order ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-slate-900 outline-none transition-all shadow-sm" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-b border-slate-200 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`pb-3 text-[14px] font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab.key ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Grid: Orders & Tracker */}
          <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-6 items-start">
            
            {/* LEFT COLUMN: Orders List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[450px] bg-white border border-slate-200 rounded-[20px] shadow-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
                </div>
              ) : displayOrders.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[20px] min-h-[450px] flex flex-col items-center justify-center text-center shadow-sm p-8">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={24} className="text-slate-300" />
                  </div>
                  <h3 className="font-['Manrope',_sans-serif] text-[20px] font-bold text-slate-900 mb-2">No orders found</h3>
                  <p className="font-['Inter',_sans-serif] text-[14px] font-medium text-slate-500 max-w-[320px] mb-8">
                    {role === 'WHOLESALER' ? 'No incoming requests in this view right now.' : "You haven't placed any wholesale orders yet. Find the best nearby sellers to discover products and start procuring."}
                  </p>
                  {role !== 'WHOLESALER' && (
                    <button onClick={() => navigate('/nearbyseller')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-[14px] hover:bg-black transition-colors shadow-md active:scale-95">
                      Explore Nearby Sellers
                    </button>
                  )}
                </div>
              ) : (
                displayOrders.map((order, i) => (
                  <div key={order.id} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          {order.orderNumber}
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${STATUS_STYLES[order.status] || "bg-slate-100"}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </h3>
                        <p className="text-[13px] text-slate-500 mt-1 font-medium">Placed: {new Date(order.placedAt).toLocaleString('en-IN')}</p>
                        {order.deliveryDate && <p className="text-[13px] font-bold text-emerald-700 mt-1">Scheduled Delivery: {order.deliveryDate}</p>}
                        {order.rejectionReason && <p className="text-[13px] font-bold text-rose-600 mt-1">Reason: {order.rejectionReason}</p>}
                      </div>
                      <div className="text-left md:text-right">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Total Amount</span>
                        <span className="font-['Manrope',_sans-serif] text-[20px] font-extrabold text-slate-900">{formatINR(order.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="text-[14px] font-semibold text-slate-700 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-600"/> {role === 'WHOLESALER' ? order.buyerName : order.sellerName} <span className="text-slate-300 mx-1">•</span> {order.totalItems} Items
                      </div>

                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {role === 'WHOLESALER' && order.status === 'PENDING' && (
                          <>
                            <button onClick={() => setRejectModalOrder(order)} className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Reject</button>
                            <button onClick={() => setAcceptModalOrder(order)} className="flex-1 md:flex-none px-5 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-sm">Accept Order</button>
                          </>
                        )}
                        {role === 'WHOLESALER' && order.status === 'OUT_FOR_DELIVERY' && (
                          <button onClick={() => handleMarkDelivered(order.id)} className="flex-1 md:flex-none px-5 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <CheckCircle2 size={16}/> Mark Delivered
                          </button>
                        )}
                        {(role !== 'WHOLESALER' || !['PENDING', 'OUT_FOR_DELIVERY'].includes(order.status)) && (
                           <button onClick={() => setModalOrder(order)} className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-sm">View Details</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT COLUMN: Live Delivery Tracker Sidebar */}
            <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm sticky top-6 min-h-[450px]">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Truck size={20} className="text-[#EC4899]" />
                <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-slate-900">
                  Live Delivery Route
                </h3>
              </div>

              {isLoadingRoute ? (
                <div className="py-12 flex justify-center"><Loader2 size={24} className="animate-spin text-slate-900"/></div>
              ) : liveRoute.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full mt-24">
                  <MapPin size={32} className="text-slate-200 mb-4" />
                  <p className="text-[13px] font-medium text-slate-500">No active deliveries on route right now.</p>
                </div>
              ) : (
                <div className="relative pl-4 space-y-6">
                  <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
                  {liveRoute.map((stop) => (
                    <div key={stop.id} className="relative z-10 flex items-center gap-4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white shrink-0 ${stop.isPast ? 'border-[#17B26A]' : stop.isActive ? 'border-[#EC4899]' : 'border-slate-200'}`}>
                        {stop.isPast && <CheckCircle2 size={14} className="text-[#17B26A]"/>}
                        {stop.isActive && <span className="w-2 h-2 bg-[#EC4899] rounded-full animate-pulse"/>}
                      </div>
                      <div className="flex flex-col">
                        <p className={`text-[14px] font-bold ${stop.companyName.includes('(You)') ? 'text-[#EC4899]' : 'text-slate-900'}`}>{stop.companyName}</p>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{stop.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* BOTTOM SECTION: Quick Reorder / Discovery */}
          {role !== 'WHOLESALER' && bottomCards.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h2 className="font-['Manrope',_sans-serif] text-[22px] font-extrabold text-slate-900 mb-6">Quick Reorder</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bottomCards.map((card, i) => {
                  if (card.type === 'REORDER') {
                    const o = card.data;
                    return (
                      <div key={`reorder-${i}`} className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-5">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                              Delivered {new Date(o.deliveredAt).toLocaleDateString('en-IN', {month:'short', day:'numeric'})}
                            </span>
                            <span className="text-[18px] font-extrabold text-slate-900 font-['Manrope',_sans-serif]">{formatINR(o.totalAmount)}</span>
                          </div>
                          <h3 className="text-[16px] font-bold text-slate-900 leading-tight">{o.sellerName}</h3>
                          <p className="text-[13px] font-medium text-slate-500 mt-1.5">{o.totalItems} Items Included</p>
                        </div>
                        <button onClick={() => navigate(`/storefront/${o.sellerId}`)} className="mt-6 w-full py-3 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm">
                          <RotateCcw size={16} /> Reorder Now
                        </button>
                      </div>
                    );
                  } else {
                    const n = card.data;
                    return (
                      <div key={`discover-${i}`} className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-extrabold text-slate-600 font-['Manrope',_sans-serif] text-lg">
                              {n.name?.charAt(0) || 'S'}
                            </div>
                            <span className="text-[10px] font-bold text-[#067647] uppercase tracking-widest bg-[#ECFDF3] border border-[#DCFAE6] px-2.5 py-1 rounded-md">Nearby Option</span>
                          </div>
                          <h3 className="text-[16px] font-bold text-slate-900 leading-tight">{n.name}</h3>
                          <p className="text-[13px] font-medium text-slate-500 mt-1.5 flex items-center gap-1.5"><MapPin size={14}/> {n.location}</p>
                        </div>
                        <button onClick={() => navigate(`/storefront/${n.businessProfileId || n.id}`)} className="mt-6 w-full py-3 bg-white border border-slate-200 text-slate-900 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                          Order Now
                        </button>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODALS */}

      {/* 1. WHolesaler ACCEPT & SCHEDULE MODAL */}
      {acceptModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-md w-full p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-xl text-slate-900">Schedule Delivery</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-1">Pick the planned delivery date for <b>{acceptModalOrder.buyerName}</b>.</p>
            </div>
            
            <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-colors" />

            <div className="flex gap-3 pt-2">
              <button onClick={() => setAcceptModalOrder(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleOpenRouteBuilder} className="flex-1 py-3 bg-indigo-50 text-indigo-700 text-[13px] font-bold rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100">Route Map</button>
              <button onClick={handleAcceptSubmit} className="flex-1 py-3 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. WHOLESALER ROUTE SEQUENCING DRAG & DROP MODAL */}
      {routeBuilderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-xl text-slate-900">Arrange Route Sequence</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-1">Re-order stops in physical delivery sequence for <b>{scheduledDate}</b>.</p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {routeOrders.map((ro, index) => (
                <div key={ro.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[13px] flex items-center justify-center shadow-sm">{index + 1}</span>
                    <span className="text-[14px] font-bold text-slate-900">{ro.buyerName}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button disabled={index === 0} onClick={() => moveRouteItem(index, index - 1)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 shadow-sm transition-colors">↑</button>
                    <button disabled={index === routeOrders.length - 1} onClick={() => moveRouteItem(index, index + 1)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 shadow-sm transition-colors">↓</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100 mt-4">
              <button onClick={() => setRouteBuilderModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleSaveRouteSequence} disabled={isSavingRoute} className="flex-1 py-3 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-sm">
                {isSavingRoute ? <Loader2 size={16} className="animate-spin mx-auto"/> : "Save Route Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. WHOLESALER REJECT MODAL */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-md w-full p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center"><AlertCircle size={24}/></div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-xl text-slate-900">Reject Request</h3>
            </div>
            <textarea placeholder="Enter specific reason for rejection..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:border-slate-900 transition-colors h-28 resize-none" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setRejectModalOrder(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleRejectSubmit} className="flex-1 py-3 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-black transition-colors shadow-sm">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDER DETAILS MANIFEST MODAL */}
      {modalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-8 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-5 shrink-0">
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-xl text-slate-900">Order Manifest <span className="text-slate-400 font-medium">#{modalOrder.orderNumber}</span></h3>
              <button onClick={() => setModalOrder(null)} className="p-1.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 space-y-1">
              <div className="grid grid-cols-[3fr_1fr] gap-4 pb-3 mb-2 border-b border-slate-100 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                <span>Item & Quantity</span>
                <span className="text-right">Line Total</span>
              </div>
              <div className="divide-y divide-slate-100">
                {modalOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">{item.productName}</p>
                      <p className="text-[13px] font-medium text-slate-500 mt-0.5">{item.quantity} × {item.packageSize} {item.unit}</p>
                    </div>
                    <p className="text-[15px] font-extrabold text-slate-900">{formatINR(item.lineTotal)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 mt-4 shrink-0 bg-slate-50 p-5 rounded-2xl border flex justify-between items-center">
              <span className="text-[14px] font-bold text-slate-600 uppercase tracking-widest">Total Amount Payable</span>
              <span className="font-['Manrope',_sans-serif] text-[24px] font-extrabold text-slate-900">{formatINR(modalOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
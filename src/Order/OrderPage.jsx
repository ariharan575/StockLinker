import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, CheckCircle2, Truck, ShoppingCart, Loader2, 
  ShieldCheck, X, AlertCircle, Download, Clock, Play, Map, ChevronUp, ChevronDown 
} from 'lucide-react';
import { orderApi } from './Services/api';
import { networkApi } from '../Authentication/services/api';
import { useAuth } from '../Authentication/context/AuthContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

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

export default function OrdersPage() {
  const navigate = useNavigate();
  
  // We only need the user ID from AuthContext now. Role is fetched locally.
  const { user } = useAuth(); 
  
  const [pageRole, setPageRole] = useState(null); // Local state for the role
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Live Tracking State
  const [activeRouteOrderId, setActiveRouteOrderId] = useState(null);
  const [liveRoute, setLiveRoute] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  // Modal States
  const [modalOrder, setModalOrder] = useState(null); 
  const [acceptModalOrder, setAcceptModalOrder] = useState(null);
  const [rejectModalOrder, setRejectModalOrder] = useState(null);
  const [routeBuilderModalOpen, setRouteBuilderModalOpen] = useState(false);
  
  // Action Form States
  const [scheduledDate, setScheduledDate] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [routeOrders, setRouteOrders] = useState([]);
  const [isSavingRoute, setIsSavingRoute] = useState(false);

  // 1. Fetch Orders Engine
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await orderApi.getOrders(activeTab);
      
      // Extract BOTH orders and the user role from the new DTO response
      const fetchedOrders = response.data.orders || [];
      const fetchedRole = response.data.userRole || 'SHOPKEEPER';
      
      setOrders(fetchedOrders);
      setPageRole(fetchedRole);
      
      // Auto-select the first processing/out-for-delivery order for the tracker
      if (!activeRouteOrderId && fetchedOrders.length > 0) {
        const active = fetchedOrders.find(o => ['PROCESSING', 'OUT_FOR_DELIVERY'].includes(o.status));
        if (active) setActiveRouteOrderId(active.id);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, activeRouteOrderId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 2. STOMP WebSocket Live Connection
  useEffect(() => {
    if (!user?.id) return;
    const socket = new SockJS('http://localhost:8080/ws'); 
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/orders/${user.id}`, (message) => {
        if (message.body) {
          fetchOrders(); // Trigger a live refresh on any state change
        }
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [user?.id, fetchOrders]);

  // 3. Live Route Hydration
  useEffect(() => {
    const fetchLiveRoute = async () => {
      if (!activeRouteOrderId) {
        setLiveRoute([]);
        return;
      }
      setIsLoadingRoute(true);
      try {
        const response = await orderApi.getDeliveryRoute(activeRouteOrderId); 
        const formattedRoute = (response.data || []).map(stop => ({
          id: stop.orderId,
          companyName: stop.buyerName,
          status: stop.status,
          time: stop.time,
          isPast: stop.status === 'DELIVERED',
          isActive: stop.status === 'OUT_FOR_DELIVERY',
          isPending: stop.status === 'PROCESSING'
        }));
        setLiveRoute(formattedRoute);
      } catch (error) {
        console.error("Failed to load live route", error);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    fetchLiveRoute();
  }, [activeRouteOrderId, orders]);

  // --- CONTROLLER ACTIONS (FIXED API CALL ARGUMENTS) ---

  const handleAcceptSubmit = async () => {
    if (!scheduledDate) return alert("Please select a delivery date");
    try {
      await orderApi.acceptAndSchedule(acceptModalOrder.id, scheduledDate);
      
      // Instantly open the Route Builder for that specific date
      const res = await orderApi.getOrdersByDate(scheduledDate);
      setRouteOrders(res.data || []);
      setAcceptModalOrder(null);
      setRouteBuilderModalOpen(true);
      
    } catch (error) {
      alert("Failed to accept order");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason) return alert("Please specify a rejection reason.");
    try {
      await orderApi.rejectOrder(rejectModalOrder.id, rejectionReason);
      setRejectModalOrder(null);
      setRejectionReason("");
      fetchOrders();
    } catch (error) {
      alert("Failed to reject order");
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

  const handleStartDeliveryRoute = async (date) => {
    if(!window.confirm("Start delivery route? All scheduled orders for this date will be marked 'Out for Delivery'.")) return;
    try {
      await orderApi.startRouteForDate(date);
      fetchOrders();
    } catch (error) {
      alert("Failed to start route.");
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

  const displayOrders = orders.filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}} />

      <div className="min-h-screen bg-[#FAFAFA] font-['Inter',_sans-serif] text-[#0F1626] p-4 md:p-8 pb-24">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
          
          {/* Main Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-['Manrope',_sans-serif] text-[32px] font-extrabold tracking-tight text-black">
                {pageRole === 'WHOLESALER' ? 'Procurement Requests' : 'My Orders'}
              </h1>
              <p className="text-[14px] font-medium text-slate-500 mt-1">
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

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-slate-200 overflow-x-auto pb-px">
            {TABS.map(tab => (
              <button 
                key={tab.key} 
                onClick={() => setActiveTab(tab.key)} 
                className={`pb-3 text-[14px] font-bold whitespace-nowrap transition-all border-b-[3px] ${activeTab === tab.key ? 'border-black text-black' : 'border-transparent text-slate-400 hover:text-black'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Core Interface Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-6 items-start">
            
            {/* LEFT COLUMN: Order List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[450px] bg-white border border-slate-200 rounded-[20px] shadow-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
              ) : displayOrders.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[24px] min-h-[450px] flex flex-col items-center justify-center text-center shadow-sm p-8">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={24} className="text-slate-300" />
                  </div>
                  <h3 className="font-['Manrope',_sans-serif] text-[20px] font-extrabold text-black mb-2">No orders found</h3>
                  <p className="font-['Inter',_sans-serif] text-[14px] font-medium text-slate-500 max-w-[320px] mb-8">
                    {pageRole === 'WHOLESALER' ? 'You have no orders matching this status right now.' : "You haven't placed any wholesale orders yet."}
                  </p>
                  {pageRole !== 'WHOLESALER' && (
                    <button onClick={() => navigate('/nearbyseller')} className="bg-black text-white px-8 py-3 rounded-xl font-bold text-[14px] hover:bg-slate-800 transition-all shadow-md active:scale-95">
                      Explore Nearby Sellers
                    </button>
                  )}
                </div>
              ) : (
                displayOrders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => setActiveRouteOrderId(order.id)}
                    className={`rounded-[20px] bg-white border p-6 transition-all cursor-pointer ${activeRouteOrderId === order.id ? 'border-pink-500 shadow-md ring-1 ring-pink-500/10' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
                      <div>
                        <h3 className="font-['Manrope',_sans-serif] font-extrabold text-[18px] text-black flex items-center gap-2.5">
                          {order.orderNumber}
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border tracking-widest uppercase ${STATUS_STYLES[order.status] || "bg-slate-100"}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </h3>
                        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Placed: {new Date(order.placedAt).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                        {order.deliveryDate && <p className="text-[13px] font-bold text-black mt-1.5 flex items-center gap-1.5"><Clock size={14} className="text-pink-500"/> Scheduled Delivery: {order.deliveryDate}</p>}
                        {order.rejectionReason && <p className="text-[13px] font-bold text-rose-600 mt-1.5">Reason: {order.rejectionReason}</p>}
                      </div>
                      <div className="text-left md:text-right">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Amount</span>
                        <span className="font-['Manrope',_sans-serif] text-[24px] font-extrabold text-black">{formatINR(order.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-pink-500"/> {pageRole === 'WHOLESALER' ? order.buyerName : order.sellerName} <span className="text-slate-300 mx-1">•</span> {order.totalItems} Items
                      </div>

                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {/* WHOLESALER ONLY ACTIONS */}
                        {pageRole === 'WHOLESALER' && order.status === 'PENDING' && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); setRejectModalOrder(order); }} className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-200 text-black text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Reject</button>
                            <button onClick={(e) => { e.stopPropagation(); setAcceptModalOrder(order); }} className="flex-1 md:flex-none px-6 py-2.5 bg-black text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95">Accept Order</button>
                          </>
                        )}
                        
                        {pageRole === 'WHOLESALER' && order.status === 'PROCESSING' && (
                          <button onClick={(e) => { e.stopPropagation(); handleStartDeliveryRoute(order.deliveryDate); }} className="flex-1 md:flex-none px-6 py-2.5 bg-black text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95">
                            <Play size={16} fill="currentColor"/> Start Delivery Route
                          </button>
                        )}

                        {pageRole === 'WHOLESALER' && order.status === 'OUT_FOR_DELIVERY' && (
                          <button onClick={(e) => { e.stopPropagation(); handleMarkDelivered(order.id); }} className="flex-1 md:flex-none px-6 py-2.5 bg-[#067647] text-white text-[13px] font-bold rounded-xl hover:bg-[#05603a] transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95">
                            <CheckCircle2 size={16}/> Mark Delivered
                          </button>
                        )}

                        {/* UNIVERSAL ACTION */}
                        <button onClick={(e) => { e.stopPropagation(); setModalOrder(order); }} className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-200 text-black text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT COLUMN: Live Animated Delivery Tracker */}
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm sticky top-24 min-h-[450px]">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-sm">
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
                <div className="py-12 flex justify-center"><Loader2 size={24} className="animate-spin text-black"/></div>
              ) : !activeRouteOrderId || liveRoute.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full mt-16">
                  <Truck size={32} className="text-slate-200 mb-4" />
                  <p className="text-[13px] font-medium text-slate-500">Select an active order to view its route.</p>
                </div>
              ) : (
                <div className="relative pl-4 space-y-6">
                  {/* Background Path Line */}
                  <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />
                  
                  {liveRoute.map((stop, i) => (
                    <div key={stop.id} className="relative z-10 flex items-start gap-4 animate-[fadeIn_0.3s_ease-out]">
                      {/* Dynamic Tracking Node */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white shrink-0 mt-0.5 transition-all duration-300 ${stop.isPast ? 'border-[#17B26A]' : stop.isActive ? 'border-pink-500 ring-4 ring-pink-500/20' : 'border-slate-200'}`}>
                        {stop.isPast && <CheckCircle2 size={14} className="text-[#17B26A]"/>}
                        {stop.isActive && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse"/>}
                        {!stop.isPast && !stop.isActive && <span className="text-[10px] font-extrabold text-slate-400">{i+1}</span>}
                      </div>

                      <div className="flex flex-col">
                        <p className={`text-[14px] font-extrabold ${stop.companyName.includes('(You)') ? 'text-pink-600' : 'text-black'}`}>{stop.companyName}</p>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1.5">
                          {stop.isPast ? <CheckCircle2 size={12} className="text-[#17B26A]"/> : stop.isActive ? <Truck size={12} className="text-pink-500"/> : <Clock size={12}/>}
                          {stop.isPast ? 'Delivered successfully' : stop.isActive ? 'Truck is on the way' : 'Pending in queue'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- OVERLAY MODALS --- */}

      {/* 1. ORDER DETAILS MANIFEST MODAL (EXACT SCREENSHOT MATCH) */}
      {modalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="font-['Manrope',_sans-serif] text-[22px] font-extrabold text-black flex items-center gap-3">
                  Order {modalOrder.orderNumber}
                  <span className={`text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded border uppercase ${STATUS_STYLES[modalOrder.status]}`}>
                    {modalOrder.status.replace(/_/g, ' ')}
                  </span>
                </h2>
                <p className="text-[13px] font-medium text-slate-500 mt-1">
                  Placed on {new Date(modalOrder.placedAt).toLocaleString('en-IN', {day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}
                </p>
              </div>
              <button onClick={() => setModalOrder(null)} className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-100 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              
              {/* Top Section (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left: Delivery & Invoice */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery & Invoice</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="text-slate-500 font-medium">{['DELIVERED'].includes(modalOrder.status) ? 'Delivered on' : 'Scheduled on'}</span>
                      <span className="font-bold text-black">{modalOrder.deliveryDate ? new Date(modalOrder.deliveryDate).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}) : 'Pending Assignment'}</span>
                    </div>
                    {modalOrder.invoice && (
                      <div className="flex justify-between items-center text-[13px] border-b border-slate-200 pb-4 mb-4">
                        <span className="text-slate-500 font-medium">Invoice ID</span>
                        <span className="font-bold text-black">{modalOrder.invoice.invoiceNumber}</span>
                      </div>
                    )}
                    <button className="w-full py-2.5 bg-white border border-slate-200 text-[13px] font-bold text-black rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                      <Download size={16} /> Download Invoice
                    </button>
                  </div>
                </div>

                {/* Right: Seller/Buyer Details */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{pageRole === 'WHOLESALER' ? 'Buyer Details' : 'Seller Details'}</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col h-full">
                    <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-black flex items-center gap-1.5">
                      {pageRole === 'WHOLESALER' ? modalOrder.buyerName : modalOrder.sellerName} <ShieldCheck size={16} className="text-pink-500" />
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5 mt-1.5 mb-auto"><MapPin size={14}/> {pageRole === 'WHOLESALER' ? modalOrder.buyerLocation : modalOrder.sellerLocation}</p>
                    
                    <div className="flex items-center gap-8 border-t border-slate-200 pt-4 mt-4">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">Business Type</p>
                        <p className="text-[13px] font-bold text-black mt-0.5">{pageRole === 'WHOLESALER' ? 'Shopkeeper' : modalOrder.sellerBusinessType}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400">GSTIN</p>
                        <p className="text-[13px] font-bold text-black mt-0.5">{modalOrder.invoice?.sellerGstin || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Table (Exactly 5 Columns) */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Product Details ({modalOrder.totalItems} Items)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Product Name</span>
                    <span>SKU</span>
                    <span>Quantity</span>
                    <span>Rate</span>
                    <span className="text-right">Total</span>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white">
                    {modalOrder.items?.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center hover:bg-slate-50/50 transition-colors">
                        <span className="text-[13px] font-bold text-black">{item.productName}</span>
                        <span className="text-[13px] font-medium text-slate-500">{item.sku}</span>
                        <span className="text-[13px] font-medium text-black">{item.quantity} Units</span>
                        <span className="text-[13px] font-medium text-black">₹{item.price.toLocaleString('en-IN')}</span>
                        <span className="text-[14px] font-extrabold text-black text-right">₹{item.lineTotal.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Timeline & Bill Summary */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
                
                {/* Left: Delivery Timeline */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Order Status Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#ECFDF3] text-[#17B26A] flex items-center justify-center"><CheckCircle2 size={12} strokeWidth={3}/></div>
                      <span className="text-[13px] font-bold text-black">Order Placed</span>
                    </div>
                    {modalOrder.confirmedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#ECFDF3] text-[#17B26A] flex items-center justify-center"><CheckCircle2 size={12} strokeWidth={3}/></div>
                        <span className="text-[13px] font-bold text-black">Order Accepted & Processed</span>
                      </div>
                    )}
                    {modalOrder.outForDeliveryAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center"><Truck size={12}/></div>
                        <span className="text-[13px] font-bold text-pink-600">Out for Delivery</span>
                      </div>
                    )}
                    {modalOrder.deliveredAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#ECFDF3] text-[#17B26A] flex items-center justify-center"><CheckCircle2 size={12} strokeWidth={3}/></div>
                        <span className="text-[13px] font-bold text-[#067647]">Delivered Successfully</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Bill Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-center">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Bill Summary</h4>
                  <div className="space-y-3 border-b border-slate-200 pb-4 mb-4">
                    <div className="flex justify-between text-[13px] font-medium text-slate-600">
                      <span>Subtotal Amount</span>
                      <span className="font-bold text-black">₹{modalOrder.invoice?.subtotal.toLocaleString('en-IN') || modalOrder.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[13px] font-medium text-slate-600">
                      <span>Discount</span>
                      <span className="font-bold text-black">₹{modalOrder.invoice?.discount.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <div className="flex justify-between text-[13px] font-medium text-slate-600">
                      <span>Tax (0%)</span>
                      <span className="font-bold text-black">₹{modalOrder.invoice?.tax.toLocaleString('en-IN') || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[14px] font-bold text-black uppercase tracking-wide">Total Amount</span>
                    <span className="font-['Manrope',_sans-serif] text-[22px] font-extrabold text-black">₹{modalOrder.invoice?.finalAmount.toLocaleString('en-IN') || modalOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. WHolesaler ACCEPT & SCHEDULE MODAL */}
      {acceptModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-md w-full p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-xl text-black">Schedule Delivery</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-1.5">Pick the planned delivery date for <b>{acceptModalOrder.buyerName}</b>.</p>
            </div>
            
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={e => setScheduledDate(e.target.value)} 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-black outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all" 
            />

            <div className="flex gap-3 pt-2">
              <button onClick={() => setAcceptModalOrder(null)} className="flex-1 py-3 bg-white border border-slate-200 text-black text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Cancel</button>
              <button onClick={handleAcceptSubmit} className="flex-1 py-3 bg-black text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95">Set Date & Route</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. WHOLESALER ROUTE SEQUENCING MODAL */}
      {routeBuilderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-xl text-black">Arrange Route Sequence</h3>
              <p className="text-[13px] font-medium text-slate-500 mt-1.5">Re-order stops in your physical delivery path for <b>{scheduledDate}</b>.</p>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {routeOrders.map((ro, index) => (
                <div key={ro.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-[13px] flex items-center justify-center">{index + 1}</span>
                    <span className="text-[14px] font-bold text-black">{ro.buyerName}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button disabled={index === 0} onClick={() => moveRouteItem(index, index - 1)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-40 transition-colors shadow-sm"><ChevronUp size={16}/></button>
                    <button disabled={index === routeOrders.length - 1} onClick={() => moveRouteItem(index, index + 1)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 disabled:opacity-40 transition-colors shadow-sm"><ChevronDown size={16}/></button>
                  </div>
                </div>
              ))}
              {routeOrders.length === 0 && <p className="text-sm font-medium text-slate-500 text-center py-6">No other orders scheduled for this date.</p>}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button onClick={handleSaveRouteSequence} disabled={isSavingRoute} className="w-full py-3 bg-black text-white text-[14px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2">
                {isSavingRoute ? <Loader2 size={16} className="animate-spin"/> : "Save Route Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WHOLESALER REJECT MODAL */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-[24px] max-w-md w-full p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center"><AlertCircle size={24}/></div>
              <h3 className="font-['Manrope',_sans-serif] font-extrabold text-xl text-black">Reject Request</h3>
            </div>
            <textarea 
              placeholder="Enter specific reason for rejection..." 
              value={rejectionReason} 
              onChange={e => setRejectionReason(e.target.value)} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:border-black focus:ring-1 focus:ring-black transition-all h-28 resize-none" 
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setRejectModalOrder(null)} className="flex-1 py-3 bg-white border border-slate-200 text-black text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Cancel</button>
              <button onClick={handleRejectSubmit} className="flex-1 py-3 bg-rose-600 text-white text-[13px] font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-md active:scale-95">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { Search, ShieldCheck, CheckCircle2, Play, Map, Clock, RefreshCw, Loader2 } from 'lucide-react';

import { orderApi } from '../Services/api';
import { useAuth } from '../../auth/context/AuthContext';
import { PremiumToast } from "../../components/PremiumToast";
import { DataFetchError } from "../../components/DataFetchError";

import { TABS, STATUS_STYLES } from '../utils/orderConstants';
import { formatINR } from '../utils/formatters';
import { OrderCardSkeleton } from '../components/OrderSkeletons';
import PremiumEmptyState from '../components/PremiumEmptyState';
import TrackerContent from '../components/TrackerContent';

// Modals
import MobileTrackerModal from '../modals/MobileTrackerModal';
import OrderDetailsModal from '../modals/OrderDetailsModal';
import AcceptScheduleModal from '../modals/AcceptScheduleModal';
import RouteSequencingModal from '../modals/RouteSequencingModal';
import RejectModal from '../modals/RejectModal';
import StartDeliveryModal from '../modals/StartDeliveryModal';

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
  const [confirmStartRouteDate, setConfirmStartRouteDate] = useState(null);
  const [routeBuilderModalOpen, setRouteBuilderModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  
  // Action Form States
  const [scheduledDate, setScheduledDate] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [routeOrders, setRouteOrders] = useState([]);
  
  // LOADING STATES
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const [isStartingRoute, setIsStartingRoute] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };

  const { 
    data: ordersData, 
    isLoading: isOrdersLoading, 
    isFetching: isOrdersFetching, 
    isError: isOrdersError,
    error: ordersError, 
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
    staleTime: 60 * 1000, 
  });

  const orders = ordersData?.orders || [];

  useEffect(() => {
    if (ordersData) {
      setPageRole(ordersData.userRole);
      if (!activeRouteOrderId && ordersData.orders.length > 0) {
        const active = ordersData.orders.find(o => ['PROCESSING', 'OUT_FOR_DELIVERY'].includes(o.status));
        if (active) setActiveRouteOrderId(active.id);
      }
    }
  }, [ordersData, activeRouteOrderId]);

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
    enabled: !!activeRouteOrderId, 
    staleTime: 30 * 1000, 
  });

  const handleAcceptSubmit = async () => {
    if (!scheduledDate) return showNotification("error", "Please select a delivery date");
    setIsAccepting(true);
    try {
      await orderApi.acceptAndSchedule(acceptModalOrder.id, scheduledDate);
      
      queryClient.setQueriesData({ queryKey: ['ordersList'] }, (old) => {
        if (!old || !old.orders) return old;
        return {
          ...old,
          orders: old.orders.map(o => o.id === acceptModalOrder.id ? { ...o, status: 'PROCESSING', deliveryDate: scheduledDate, confirmedAt: new Date().toISOString() } : o)
        };
      });

      const res = await orderApi.getOrdersByDate(scheduledDate);
      setRouteOrders(res.data || []);
      setAcceptModalOrder(null);
      setRouteBuilderModalOpen(true);
      showNotification("success", "Order accepted successfully!");
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to accept order");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason) return showNotification("error", "Please specify a rejection reason.");
    setIsRejecting(true);
    try {
      await orderApi.rejectOrder(rejectModalOrder.id, rejectionReason);

      queryClient.setQueriesData({ queryKey: ['ordersList'] }, (old) => {
        if (!old || !old.orders) return old;
        return {
          ...old,
          orders: old.orders.map(o => o.id === rejectModalOrder.id ? { ...o, status: 'CANCELLED', rejectionReason, cancelledAt: new Date().toISOString() } : o)
        };
      });

      setRejectModalOrder(null);
      setRejectionReason("");
      showNotification("success", "Order rejected successfully.");
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to reject order");
    } finally {
      setIsRejecting(false);
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

  const handleStartDeliveryRouteClick = (date) => {
    if (!date) {
      showNotification("error", "Cannot start route: No delivery date assigned to this order.");
      return;
    }
    setConfirmStartRouteDate(date);
  };

  const handleStartDeliveryRouteSubmit = async () => {
    if (!confirmStartRouteDate) return;
    setIsStartingRoute(true);
    
    const formattedDate = Array.isArray(confirmStartRouteDate) ? confirmStartRouteDate.join('-') : confirmStartRouteDate;
    
    try {
      await orderApi.startRouteForDate(formattedDate);

      queryClient.setQueriesData({ queryKey: ['ordersList'] }, (old) => {
        if (!old || !old.orders) return old;
        return {
          ...old,
          orders: old.orders.map(o => o.deliveryDate === formattedDate && o.status === 'PROCESSING' ? { ...o, status: 'OUT_FOR_DELIVERY', outForDeliveryAt: new Date().toISOString() } : o)
        };
      });

      showNotification("success", "Delivery route started successfully!");
      setConfirmStartRouteDate(null);
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to start route.");
    } finally {
      setIsStartingRoute(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    setIsDelivering(true);
    try {
      await orderApi.markDelivered(orderId);

      queryClient.setQueriesData({ queryKey: ['ordersList'] }, (old) => {
        if (!old || !old.orders) return old;
        return {
          ...old,
          orders: old.orders.map(o => o.id === orderId ? { ...o, status: 'DELIVERED', deliveredAt: new Date().toISOString() } : o)
        };
      });

      showNotification("success", "Order marked as delivered!");
    } catch (error) {
      showNotification("error", error.response?.data?.message || "Failed to update status to DELIVERED");
    } finally {
      setIsDelivering(false);
    }
  };

  const displayOrders = orders.filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));
  const activeRouteDateInfo = orders.find(o => o.id === activeRouteOrderId)?.deliveryDate;

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
        {isOrdersError ? (
          <DataFetchError 
            errorTitle="Connection Failed"
            errorMessage={ordersError?.response?.data?.message || ordersError?.message || "An unexpected error occurred."} 
            onRetry={refetchOrders} 
          />
        ) : (
          <div className="max-w-[1440px] mx-auto flex flex-col gap-6 sm:gap-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2 sm:mt-2">
              <div>
                <h1 className="text-[24px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
                  My Orders
                </h1>
                <p className="text-[13px] sm:text-[14px] font-medium text-slate-500 mt-1">
                  {pageRole === 'WHOLESALER' ? 'Manage incoming requests, schedule deliveries, and sequence routes.' : 'Track live deliveries, view invoices, and review order history.'}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-[320px]">
                  <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} strokeWidth={2} />
                  <input 
                    type="text" 
                    placeholder="Search order ID..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm" 
                  />
                </div>
                <button 
                  onClick={() => refetchOrders()}
                  disabled={isOrdersFetching}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-black transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  title="Sync Latest Orders"
                >
                  <RefreshCw size={20} className={isOrdersFetching ? "animate-spin text-pink-500" : ""} />
                </button>
              </div>
            </div>

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
              
              <div className="space-y-4">
                {isOrdersLoading ? (
                  <>
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                  </>
                ) : displayOrders.length === 0 ? (
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
                          
                          {pageRole === 'WHOLESALER' && order.status === 'PENDING' && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setRejectModalOrder(order); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-white border border-slate-200 text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">Reject</button>
                              <button onClick={(e) => { e.stopPropagation(); setAcceptModalOrder(order); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-black text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm active:scale-95">Accept Order</button>
                            </>
                          )}
                          
                          {pageRole === 'WHOLESALER' && order.status === 'PROCESSING' && (
                            <button onClick={(e) => { e.stopPropagation(); handleStartDeliveryRouteClick(order.deliveryDate); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-slate-200  text-black text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-slate-400 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95">
                              <Play size={16} fill="currentColor"/> Start Delivery
                            </button>
                          )}

                          {pageRole === 'WHOLESALER' && order.status === 'OUT_FOR_DELIVERY' && (
                            <button disabled={isDelivering} onClick={(e) => { e.stopPropagation(); handleMarkDelivered(order.id); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-[#067647] text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-[#05603a] transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-70">
                              {isDelivering && activeRouteOrderId === order.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16}/>} Delivered
                            </button>
                          )}

                          {['PROCESSING', 'OUT_FOR_DELIVERY'].includes(order.status) && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); setActiveRouteOrderId(order.id); setIsTrackerModalOpen(true); }} 
                               className="xl:hidden flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-pink-50 border border-pink-200 text-pink-600 text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-pink-100 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                             >
                               <Map size={16}/> Track Live
                             </button>
                          )}

                          <button onClick={(e) => { e.stopPropagation(); setModalOrder(order); }} className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 bg-black border border-slate-200 text-white text-[12px] sm:text-[13px] font-bold rounded-xl cursor-pointer transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={`hidden xl:flex flex-col bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm sticky top-24 overflow-hidden transition-all duration-300 ${
                displayOrders.length === 0 ? 'h-[450px] mt-2' : 'h-[calc(100vh-120px)]'
              }`}>
                <TrackerContent 
                  activeRouteDateInfo={activeRouteDateInfo} 
                  isLoadingRoute={isLoadingRoute} 
                  activeRouteOrderId={activeRouteOrderId} 
                  liveRoute={liveRoute} 
                />
              </div>

            </div>
          </div>
        )}
      </div>

      {/* OVERLAYS */}
      {!isOrdersError && isTrackerModalOpen && (
        <MobileTrackerModal 
          setIsTrackerModalOpen={setIsTrackerModalOpen} 
          activeRouteDateInfo={activeRouteDateInfo} 
          isLoadingRoute={isLoadingRoute} 
          activeRouteOrderId={activeRouteOrderId} 
          liveRoute={liveRoute} 
        />
      )}

      {!isOrdersError && modalOrder && (
        <OrderDetailsModal 
          modalOrder={modalOrder} 
          setModalOrder={setModalOrder} 
          pageRole={pageRole} 
        />
      )}

      {!isOrdersError && acceptModalOrder && (
        <AcceptScheduleModal 
          acceptModalOrder={acceptModalOrder} 
          setAcceptModalOrder={setAcceptModalOrder} 
          scheduledDate={scheduledDate} 
          setScheduledDate={setScheduledDate} 
          handleAcceptSubmit={handleAcceptSubmit} 
          isAccepting={isAccepting} 
        />
      )}

      {!isOrdersError && routeBuilderModalOpen && (
        <RouteSequencingModal 
          routeBuilderModalOpen={routeBuilderModalOpen} 
          setRouteBuilderModalOpen={setRouteBuilderModalOpen} 
          scheduledDate={scheduledDate} 
          routeOrders={routeOrders} 
          moveRouteItem={moveRouteItem} 
          handleSaveRouteSequence={handleSaveRouteSequence} 
          isSavingRoute={isSavingRoute} 
        />
      )}

      {!isOrdersError && rejectModalOrder && (
        <RejectModal 
          rejectModalOrder={rejectModalOrder} 
          setRejectModalOrder={setRejectModalOrder} 
          rejectionReason={rejectionReason} 
          setRejectionReason={setRejectionReason} 
          handleRejectSubmit={handleRejectSubmit} 
          isRejecting={isRejecting} 
        />
      )}

      {!isOrdersError && confirmStartRouteDate && (
        <StartDeliveryModal 
          confirmStartRouteDate={confirmStartRouteDate} 
          setConfirmStartRouteDate={setConfirmStartRouteDate} 
          handleStartDeliveryRouteSubmit={handleStartDeliveryRouteSubmit} 
          isStartingRoute={isStartingRoute} 
        />
      )}
    </>
  );
}
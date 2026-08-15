import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

// External Imports (Adjust paths as needed for your setup)
import { typographyStyles } from '../../compare_price/config/constants';
import { networkApi } from '../../auth/services/api';
import { categoryApi } from '../../shopkeeper_home/Services/api';
import { useAuth } from '../../auth/context/AuthContext';
import { PremiumToast } from "../../components/PremiumToast";
import { DataFetchError } from "../../components/DataFetchError";

// Internal Modular Imports
import { DISTRICT_CENTERS } from '../utils/constants';
import { FilterDropdown } from '../components/FilterDropdown';
import { SellerCard } from '../components/SellerCard';
import { SellerCardSkeleton } from '../components/SellerCardSkeleton';
import { StickySellerMap } from '../components/map/StickySellerMap';

export default function NearbySellerDiscoveryPage() {
  const { role } = useAuth(); 
  const userRole = role?.toUpperCase() || "SHOPKEEPER";
  const targetLabel = userRole === "SHOPKEEPER" ? "Sellers" : "Buyers";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [scope, setScope] = useState("NEARBY"); 
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [deliveryRadiusFilter, setDeliveryRadiusFilter] = useState("");
  const [responseFilter, setResponseFilter] = useState("");
  
  const [page, setPage] = useState(0);
  const [currentDistrict, setCurrentDistrict] = useState("Chennai");
  const [notification, setNotification] = useState(null);

  const showNotification = (type, msg) => setNotification({ type, msg });
  const mapCenter = useMemo(() => DISTRICT_CENTERS[currentDistrict] || DISTRICT_CENTERS["Chennai"], [currentDistrict]);
  const hasActiveFilters = categoryIdFilter || ratingFilter || deliveryRadiusFilter || responseFilter || scope === "ALL" || searchQuery !== "";

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, scope, categoryIdFilter, ratingFilter, deliveryRadiusFilter, responseFilter]);

  const clearAllFilters = () => {
    setScope("NEARBY");
    setCategoryIdFilter("");
    setRatingFilter("");
    setDeliveryRadiusFilter("");
    setResponseFilter("");
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(0);
  };

  const { data: categories = [] } = useQuery({
    queryKey: ['categoriesList'],
    queryFn: async () => {
      const res = await categoryApi.getAllCategories();
      let rawData = [];
      if (Array.isArray(res)) rawData = res;
      else if (res && Array.isArray(res.data)) rawData = res.data;
      else if (res && res.data && Array.isArray(res.data.data)) rawData = res.data.data;
      
      return rawData.map(cat => ({
        id: cat.id || cat.categoryId,
        name: cat.name || cat.categoryName || "Unknown"
      }));
    },
    staleTime: 5 * 60 * 1000, 
  });

  const { 
    data: sellersPage = { content: [], totalPages: 0 }, 
    isLoading: isSellersLoading, 
    isError: fetchError,
    refetch: refetchSellers 
  } = useQuery({
    queryKey: ['nearbySellers', debouncedSearch, scope, categoryIdFilter, ratingFilter, deliveryRadiusFilter, responseFilter, page],
    queryFn: async () => {
      const params = { page, size: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (scope) params.scope = scope;
      if (categoryIdFilter) params.categoryId = categoryIdFilter;
      if (ratingFilter) params.minRating = parseFloat(ratingFilter);
      if (deliveryRadiusFilter) params.deliveryRadius = parseInt(deliveryRadiusFilter);
      if (responseFilter) params.responseTime = responseFilter;

      const response = await networkApi.getNearbySellers(params);
      return response.data?.data || { content: [], totalPages: 0 };
    },
    staleTime: 60 * 1000,
  });

  const suppliers = sellersPage.content || [];
  const totalPages = sellersPage.totalPages || 0;

  const backendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:8080';
  const wsUrl = `${backendUri}/ws`;


  useEffect(() => {
    if (suppliers.length > 0 && scope === "NEARBY") {
      const districtStr = suppliers[0].distance.replace("In ", "");
      if (DISTRICT_CENTERS[districtStr]) setCurrentDistrict(districtStr);
    }
  }, [suppliers, scope]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS( wsUrl , null, { withCredentials: true }),
      debug: () => {}, 
      onConnect: () => {
        client.subscribe('/user/queue/notifications', (message) => {
          const notif = JSON.parse(message.body);
          const title = notif.type === 'NEW_NEARBY_USER' ? 'Live Radar Update' : 'Network Update';
          showNotification('info', `${title}: ${notif.message}`);
          
          if (notif.type === 'NEW_NEARBY_USER' || notif.type === 'ACCEPTED') {
            refetchSellers(); 
          }
        });
      }
    });
    client.activate();
    return () => { if (client.active) client.deactivate(); };
  }, [refetchSellers]);

  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));
  const radiusOptions = [
    {value:'5', label:'Within 5 km'}, {value:'10', label:'Within 10 km'},
    {value:'25', label:'Within 25 km'}, {value:'50', label:'Within 50 km'},
    {value:'100', label:'Within 100 km'}, {value:'250', label:'Within 250 km'},
    {value:'500', label:'Statewide (500 km)'}
  ];
  const responseOptions = [
    {value:'< 1 hr', label:'Under 1 Hour'}, {value:'< 4 hrs', label:'Under 4 Hours'},
    {value:'< 12 hrs', label:'Under 12 Hours'}, {value:'< 24 hrs', label:'Under 24 Hours'},
    {value:'1-2 days', label:'1-2 Days'}
  ];
  const ratingOptions = [
    {value:'4.8', label:'4.8+ Top Rated'}, {value:'4.5', label:'4.5+ Excellent'},
    {value:'4', label:'4.0+ Good'}, {value:'3.5', label:'3.5+ Average'}, {value:'3', label:'3.0+ All'}
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: typographyStyles }} />
      <div className="bg-[#FAFAFA] font-['Inter',_sans-serif] text-[#0F1626] min-h-screen pb-24">
        
        <PremiumToast 
          isVisible={!!notification} 
          type={notification?.type || 'info'} 
          message={notification?.msg} 
          onClose={() => setNotification(null)} 
        />

        {fetchError ? (
          <DataFetchError onRetry={refetchSellers} />
        ) : (
          <>
            <div className="pt-6 pb-4 w-full flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 bg-white px-4 md:px-6">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-[24px] sm:text-[32px] font-extrabold tracking-tight text-gray-900">
                  {userRole === "SHOPKEEPER" ? "Nearby Suppliers" : "Nearby Buyers"}
                </h1>
                <p className="mt-1 text-[13px] sm:text-[15px] font-medium text-slate-500">
                  {userRole === "SHOPKEEPER"
                    ? "Discover verified wholesalers and distributors near your location."
                    : "Connect with verified shopkeepers in your region."}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex bg-slate-100 p-1 rounded-[14px] w-full md:w-auto shadow-inner border border-slate-200/60">
                <button 
                  onClick={() => setScope("NEARBY")} 
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[10px] text-[13px] font-extrabold transition-all duration-300 ${scope === "NEARBY" ? 'bg-white text-black shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-black'}`}
                >
                  Nearby {targetLabel}
                </button>
                <button 
                  onClick={() => setScope("ALL")} 
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-[10px] text-[13px] font-extrabold transition-all duration-300 ${scope === "ALL" ? 'bg-white text-black shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-black'}`}
                >
                  All {targetLabel}
                </button>
              </motion.div>
            </div>

            <div className="flex flex-col gap-4 py-4 px-4 md:px-6 bg-white border-b border-slate-200 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-[72px] z-30">
              
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} strokeWidth={2.5} />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder={`Search ${targetLabel.toLowerCase()}, brands...`} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-semibold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm" 
                />
              </div>
              
              <div className="flex items-center gap-2.5 w-full overflow-x-auto no-scrollbar pb-1">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-[13px] font-extrabold rounded-xl shadow-md flex-shrink-0">
                  <SlidersHorizontal size={14} /> Filters
                </div>
                
                <FilterDropdown label="Any Category" value={categoryIdFilter} onChange={setCategoryIdFilter} options={categoryOptions} />
                <FilterDropdown label="Delivery Radius" value={deliveryRadiusFilter} onChange={setDeliveryRadiusFilter} options={radiusOptions} />
                <FilterDropdown label="Response Time" value={responseFilter} onChange={setResponseFilter} options={responseOptions} />
                <FilterDropdown label="Rating" value={ratingFilter} onChange={setRatingFilter} options={ratingOptions} />

                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:border-rose-200 rounded-xl whitespace-nowrap transition-colors shadow-sm flex-shrink-0">
                    <X size={14} strokeWidth={2.5} /> Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 sm:py-6">
              <div className="flex flex-col lg:flex-row gap-6">
                
                <div className="w-full lg:w-[60%] xl:w-[70%]">
                  <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-[18px] sm:text-[20px] font-sora font-extrabold text-slate-800 flex items-center gap-1.5">
                      Found <span className="text-black text-[20px]">{isSellersLoading ? "..." : sellersPage.totalElements || suppliers.length}</span> {targetLabel}
                    </h2>
                    {scope === "ALL" && (
                      <span className="text-[12px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm w-fit">
                        <MapPin size={14} /> Showing Statewide
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col relative min-h-[300px]">
                    {isSellersLoading ? (
                      Array.from({ length: 4 }).map((_, idx) => <SellerCardSkeleton key={idx} />)
                    ) : suppliers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-white to-slate-50 border border-slate-200 rounded-[24px] shadow-sm p-6 text-center mt-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 opacity-20" />
                        <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 z-10">
                          <div className="absolute inset-0 bg-pink-500/5 rounded-2xl animate-pulse" />
                          <Search className="w-8 h-8 text-slate-300 relative z-10" strokeWidth={2} /> 
                        </div>
                        <h3 className="font-sora text-[20px] font-extrabold text-slate-800 mb-2">
                          No {targetLabel.toLowerCase()} matched your criteria
                        </h3>
                        <p className="text-[14px] text-slate-500 font-medium max-w-md mb-8 leading-relaxed">
                          We couldn't find any partners matching your exact filters. Try expanding your search radius or clearing active filters to see more results.
                        </p>
                        {hasActiveFilters && (
                          <button onClick={clearAllFilters} className="bg-white text-rose-600 border border-rose-200 px-8 py-3 rounded-xl font-bold text-[13px] hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm active:scale-95 flex items-center gap-2">
                            <X size={16} strokeWidth={2.5} /> Clear Active Filters
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <AnimatePresence>
                          {suppliers.map((supplier, index) => (
                            <SellerCard key={supplier.id} supplier={supplier} index={index} userRole={userRole} showNotification={showNotification} />
                          ))}
                        </AnimatePresence>

                        {totalPages > 1 && (
                          <div className="flex items-center justify-between border-t border-slate-200/80 pt-6 mt-6 pb-6">
                            <button
                              onClick={() => setPage(p => Math.max(0, p - 1))}
                              disabled={page === 0}
                              className="px-5 py-2.5 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                            >
                              Previous
                            </button>
                            <span className="text-[13px] font-bold text-slate-500">
                              Page {page + 1} of {totalPages}
                            </span>
                            <button
                              onClick={() => setPage(p => p + 1)}
                              disabled={page >= totalPages - 1}
                              className="px-5 py-2.5 text-[13px] font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="hidden lg:block lg:w-[40%] xl:w-[30%] relative">
                  <StickySellerMap center={mapCenter} sellers={suppliers} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
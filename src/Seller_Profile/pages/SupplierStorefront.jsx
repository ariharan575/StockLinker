import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MapPin, Search, Minus, Plus, ShoppingCart, ShieldCheck, Info,
  Truck, X, Phone, Mail, MessageCircle, Clock, Award, Building2, 
  PackageCheck, Briefcase, TrendingUp, Edit3, UserPlus, Save, Check, MessageSquare, RotateCcw, ChevronDown, Loader2, AlertCircle, CheckCircle2, PackageSearch
} from 'lucide-react';
import { storefrontApi, orderApi, profileApi, networkApi } from '../../Authentication/services/api';

const DEFAULT_FILTERS = { category: 'all', brand: 'all', sortPrice: 'none' };

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hourString, minute] = timeStr.split(':');
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${minute} ${ampm}`;
};

const DEFAULT_DESCRIPTION = `Welcome to our wholesale distribution center. We pride ourselves on delivering top-tier products with unmatched reliability. With a focus on B2B excellence, we ensure that your sourcing needs are met with precision, speed, and competitive pricing. Partner with us for a seamless supply chain experience.`;

const StorefrontSkeleton = () => (
  <div className="min-h-screen bg-[#F8FAFC] p-4 flex flex-col gap-6 animate-pulse">
    <div className="h-64 bg-slate-200 rounded-3xl w-full max-w-[1440px] mx-auto"></div>
    <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-3 space-y-4">
        <div className="h-16 bg-slate-200 rounded-2xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
      <div className="h-96 bg-slate-200 rounded-3xl"></div>
    </div>
  </div>
);

export default function SupplierStorefront() {
  const { businessProfileId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ brands: [], categories: [] });
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState('catalog');
  const [cart, setCart] = useState({});

  // Auth & Ownership Logic
  const currentLoggedInUserId = localStorage.getItem('userId') || "user-123"; 
  const isOwner = profile?.userId === currentLoggedInUserId;

  // Description Edit States
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");
  const [isSavingDesc, setIsSavingDesc] = useState(false);
  
  const [showSubCatModal, setShowSubCatModal] = useState(false);
  
  // Rating States
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRatingConfirm, setShowRatingConfirm] = useState(false);
  const [hasRatedLocally, setHasRatedLocally] = useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showPlaceOrderConfirmModal, setShowPlaceOrderConfirmModal] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileRes, filtersRes] = await Promise.all([
          storefrontApi.getProfile(businessProfileId),
          storefrontApi.getFilters(businessProfileId)
        ]);
        setProfile(profileRes.data);
        setDescValue(profileRes.data.businessDescription || "");
        setFilterOptions(filtersRes.data);
      } catch (error) {
        console.error("Failed to load storefront profile", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    if (businessProfileId) fetchInitialData();
  }, [businessProfileId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchFilteredProducts(), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [businessProfileId, searchTerm, filters]);

  const fetchFilteredProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const params = { search: searchTerm, category: filters.category, brand: filters.brand, sortPrice: filters.sortPrice };
      const res = await storefrontApi.getProducts(businessProfileId, params);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // --- SAVE DESCRIPTION LOGIC ---
  const handleSaveDescription = async () => {
    if (isSavingDesc) return;
    setIsSavingDesc(true);
    try {
      // API call to update the business profile in the DB
      await profileApi.updateBusiness({ businessDescription: descValue });
      // Immediately update local state so the UI reflects the change instantly
      setProfile(prev => ({ ...prev, businessDescription: descValue }));
      setIsEditingDesc(false);
    } catch (error) {
      alert("Failed to update description. Please check your connection and try again.");
    } finally {
      setIsSavingDesc(false);
    }
  };

  const initiateRating = (rating) => {
    if (profile?.hasRated || hasRatedLocally) return;
    setSelectedRating(rating);
    setShowRatingConfirm(true);
  };

  const confirmAndSubmitRating = async () => {
    try {
      await storefrontApi.submitRating(businessProfileId, { rating: selectedRating });
      setHasRatedLocally(true);
      setProfile(prev => ({ ...prev, hasRated: true }));
      setShowRatingConfirm(false);
    } catch (error) {
      console.error("Failed to submit rating", error);
      alert("Failed to submit rating.");
      setShowRatingConfirm(false);
    }
  };

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      await networkApi.requestConnection(profile.businessId);
      alert("Connection request sent successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send request.");
    } finally {
      setIsConnecting(false);
    }
  };

  // --- CART & QUANTITY LOGIC ---
  const updateQuantity = (product, newQty) => {
    setCart(prev => {
      const updated = { ...prev };
      if (newQty === '' || newQty <= 0) {
        delete updated[product.id];
        return updated;
      }
      updated[product.id] = Math.max(product.minimumOrderQuantity, Math.min(newQty, product.availableStock));
      return updated;
    });
  };

  const handleIncrement = (p) => updateQuantity(p, (cart[p.id] || 0) === 0 ? p.minimumOrderQuantity : (cart[p.id] || 0) + 1);
  const handleDecrement = (p) => updateQuantity(p, ((cart[p.id] || 0) - 1) < p.minimumOrderQuantity ? 0 : (cart[p.id] || 0) - 1);
  const handleManualQuantity = (product, value) => {
    if (value === '') {
      const updated = { ...cart };
      delete updated[product.id];
      setCart(updated);
      return;
    }
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) setCart(prev => ({ ...prev, [product.id]: parsed }));
  };
  const handleQuantityBlur = (product, value) => {
    if (value === '') return;
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) updateQuantity(product, parsed);
  };

  const cartItemsList = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      if (!product) return null;
      const isBulkApplied = product.bulkDealQuantity && qty >= product.bulkDealQuantity;
      const appliedPrice = isBulkApplied ? product.bulkDealPrice : product.price;
      return { ...product, orderQty: qty, appliedPrice, lineTotal: appliedPrice * qty };
    }).filter(Boolean);
  }, [cart, products]);

  const cartTotals = useMemo(() => {
    return cartItemsList.reduce((acc, item) => {
      acc.items += 1;
      acc.cost += item.lineTotal;
      return acc;
    }, { items: 0, cost: 0 });
  }, [cartItemsList]);

  const handleConfirmOrderPlacement = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    try {
      const orderItems = cartItemsList.map(item => ({ productId: item.id, quantity: item.orderQty }));
      await orderApi.placeOrder({ businessProfileId: businessProfileId, items: orderItems });
      setCart({});
      setShowPlaceOrderConfirmModal(false);
      setShowCheckoutModal(false);
      navigate('/orders');
    } catch (error) {
      alert(`Order Failed: ${error.response?.data?.message || 'Check connection.'}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoadingProfile) return <StorefrontSkeleton />;
  if (!profile) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] font-bold text-black">Profile Not Found</div>;

  const firstLetter = profile.businessName ? profile.businessName.charAt(0).toUpperCase() : 'S';
  const subCategories = profile.subCategories && profile.subCategories.length > 0 ? profile.subCategories : [];
  const maxGridItems = isMobile ? 5 : 9;
  const displayedCats = subCategories.slice(0, maxGridItems);
  const extraCount = subCategories.length - maxGridItems;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}} />
      <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] text-[#0F1626] pb-32">
        
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-5 md:gap-6">
          
          {/* --- HERO SECTION --- */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-10 shadow-sm relative overflow-hidden border border-slate-200">
            <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[radial-gradient(circle,rgba(236,72,153,0.05),transparent_60%)] pointer-events-none" />
            
            <div className="flex flex-col gap-6 md:gap-8 relative z-10 w-full">
              
              <div className="flex flex-row gap-4 md:gap-8 items-start w-full">
                <div className="flex items-center justify-center w-[72px] h-[72px] sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-slate-900 to-black rounded-[20px] md:rounded-[28px] text-white flex-shrink-0 shadow-lg border border-slate-800 relative group">
                  <span className="font-['Manrope',_sans-serif] text-[36px] sm:text-[40px] md:text-[64px] font-extrabold tracking-tighter group-hover:scale-105 transition-transform duration-300">{firstLetter}</span>
                  {profile.verificationStatus === 'VERIFIED' && (
                    <div className="absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 bg-emerald-500 text-white p-1 md:p-1.5 rounded-full border-[3px] md:border-4 border-white shadow-sm">
                      <ShieldCheck size={isMobile ? 12 : 18} />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-1.5 md:gap-2 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-wrap">
                    <h1 className="font-['Manrope',_sans-serif] text-[22px] sm:text-3xl md:text-4xl font-extrabold text-black leading-tight tracking-tight">
                      {profile.businessName}
                    </h1>
                    {profile.gstNumber && (
                      <span className="px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 text-[10px] md:text-xs font-extrabold tracking-widest uppercase rounded-md md:rounded-lg border border-slate-200 w-fit">
                        GST Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] sm:text-[14px] md:text-[15px] font-medium text-slate-500">Operated by <span className="font-bold text-slate-800">{profile.ownerName}</span> • {profile.businessType}</p>
                  
                  {/* Primary Categories Tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1">
                    {profile.primaryCategoryNames?.slice(0, 4).map((cat, i) => (
                      <span key={i} className="px-2.5 md:px-3 py-1 md:py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Trust Metrics Row */}
                  <div className="flex flex-wrap items-center gap-2.5 md:gap-4 mt-2 md:mt-3">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="flex items-center text-yellow-400"><Star size={isMobile ? 14 : 16} fill="currentColor" /></div>
                      <span className="text-[12px] md:text-sm font-extrabold text-black">{profile.rating || '4.8'} <span className="text-slate-400 font-medium">({profile.reviewCount || 0})</span></span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-1 md:gap-2">
                      <Award size={isMobile ? 14 : 16} className="text-pink-500" />
                      <span className="text-[12px] md:text-sm font-bold text-slate-700">Trust: {profile.trustScore || '95'}/100</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-1 md:gap-2">
                      <TrendingUp size={isMobile ? 14 : 16} className="text-emerald-500" />
                      <span className="text-[12px] md:text-sm font-bold text-slate-700">Rank #{profile.marketplaceRank || '1'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BAR */}
            <div className="flex flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
                {isOwner ? (
                  <div className="flex items-center gap-2 md:gap-3 bg-pink-50 border border-pink-100 p-2.5 md:p-3 rounded-xl md:rounded-2xl w-full sm:w-auto shadow-sm">
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs md:text-sm font-bold text-pink-700 truncate">You are viewing your own profile</span>
                  </div>
                ) : (
                  <>
                    <button className="flex-1 sm:flex-none px-2 sm:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border border-slate-200 text-[11px] sm:text-xs md:text-sm font-bold text-black rounded-xl md:rounded-2xl hover:bg-slate-50 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 min-w-0">
                      <MessageCircle size={isMobile ? 16 : 18} className="flex-shrink-0" /> <span className="truncate">Message</span>
                    </button>
                    <button className="flex-1 sm:flex-none px-2 sm:px-10 py-2.5 sm:py-3 md:py-3.5 bg-white border border-slate-200 text-[11px] sm:text-xs md:text-sm font-bold text-black rounded-xl md:rounded-2xl hover:bg-slate-50 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 min-w-0">
                      <Phone size={isMobile ? 16 : 18} className="flex-shrink-0" /> <span className="truncate">Call</span>
                    </button>
                    <button onClick={handleConnect} disabled={isConnecting} className="flex-[1.2] sm:flex-none px-2 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-black text-white text-[11px] sm:text-xs md:text-sm font-bold rounded-xl md:rounded-2xl hover:bg-slate-800 shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-70 min-w-0">
                      {isConnecting ? <Loader2 size={isMobile ? 16 : 18} className="animate-spin flex-shrink-0" /> : <UserPlus size={isMobile ? 16 : 18} className="flex-shrink-0" />} 
                      <span className="truncate">Connect</span>
                    </button>
                  </>
                )}
              </div>

              {/* TABS */}
              <div className="flex items-center justify-start gap-5 md:gap-8 border-b border-slate-100 pt-2 relative z-10 overflow-x-auto hide-scrollbar w-full">
                {['catalog', 'profile', 'delivery'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`pb-3.5 text-[13px] md:text-[15px] font-bold transition-all border-b-[3px] whitespace-nowrap ${activeTab === tab ? 'text-black border-black' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  >
                    {tab === 'catalog' ? 'Product Catalog' : tab === 'profile' ? 'Business Identity' : 'Fulfillment Details'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {/* --- TAB 1: PRODUCT CATALOG --- */}
              {activeTab === 'catalog' && (
                <div className="flex flex-col gap-4 md:gap-6">
                  {/* Search & Filter Bar */}
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 bg-white border border-slate-200 rounded-[16px] md:rounded-[24px] shadow-sm">
                    <div className="relative flex items-center w-full lg:max-w-md bg-slate-50 border border-slate-200 rounded-xl focus-within:border-black focus-within:ring-2 focus-within:ring-black/5 transition-all shadow-inner h-11 md:h-12">
                      <Search className="absolute left-3.5 md:left-4 text-slate-400" size={18} />
                      <input type="text" className="w-full h-full pl-10 md:pl-12 pr-4 bg-transparent text-[13px] md:text-sm font-medium outline-none placeholder:text-slate-400" placeholder="Search by name or brand..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                      <div className="relative inline-flex items-center flex-shrink-0">
                        <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-bold h-11 md:h-12 pl-3 md:pl-4 pr-8 md:pr-10 rounded-xl outline-none cursor-pointer hover:bg-slate-50" value={filters.category} onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}>
                          <option value="all">All Categories</option>
                          {filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={16} />
                      </div>
                      <div className="relative inline-flex items-center flex-shrink-0">
                        <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-bold h-11 md:h-12 pl-3 md:pl-4 pr-8 md:pr-10 rounded-xl outline-none cursor-pointer hover:bg-slate-50" value={filters.brand} onChange={(e) => setFilters(prev => ({...prev, brand: e.target.value}))}>
                          <option value="all">All Brands</option>
                          {filterOptions.brands.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={16} />
                      </div>
                      <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }} className="flex items-center justify-center w-11 md:w-12 h-11 md:h-12 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex-shrink-0">
                        <RotateCcw size={18} />
                      </button>
                    </div>
                  </div>

                  {isLoadingProducts ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>
                  ) : products.length === 0 ? (
                    <div className="flex flex-col items-center py-16 md:py-20 text-slate-400 bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 shadow-sm"><PackageSearch size={40} className="mb-3 text-slate-300"/><p className="text-[14px] md:text-lg font-bold text-slate-500">No products found.</p></div>
                  ) : (
                    <>
                      {/* DESKTOP TABLE VIEW */}
                      <div className="hidden md:block bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
                        <div className="w-full overflow-x-auto">
                          <div className="min-w-[1000px]">
                            <div className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-[11px] font-bold tracking-widest uppercase text-slate-500">
                              <span>Product Details</span>
                              <span>Brand</span>
                              <span>Base Price</span>
                              <span>Rules / Deals</span>
                              <span className="text-center">Stock</span>
                              <span className="text-center">Quantity</span>
                              <span className="text-right">Line Total</span>
                            </div>
                            
                            <div className="flex flex-col">
                              {products.map((product) => {
                                const currentQty = cart[product.id] || 0;
                                const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
                                const displayPrice = isBulkApplied ? product.bulkDealPrice : product.price;

                                return (
                                  <div key={product.id} className={`grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 items-center px-6 py-5 border-b border-slate-100 ${currentQty > 0 ? 'bg-slate-50/50' : 'hover:bg-slate-50'} transition-colors`}>
                                    <div className="flex flex-col gap-0.5 pr-2">
                                      <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-black truncate">{product.productName}</span>
                                      <span className="text-[12px] font-medium text-slate-500 truncate">{product.category}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{product.brand}</span>
                                    <div className="flex flex-col">
                                      <span className="font-['Manrope',_sans-serif] text-base font-extrabold text-black">₹{product.price.toLocaleString('en-IN')}</span>
                                      <span className="text-[11px] font-semibold text-slate-400">/{product.unit}</span>
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-rose-200 bg-rose-50 text-rose-600">
                                        Min: {product.minimumOrderQuantity} {product.unit}
                                      </span>
                                      {product.bulkDealQuantity && product.bulkDealPrice && (
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isBulkApplied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                                          Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                      <span className={`text-sm font-extrabold ${product.availableStock < 10 ? 'text-rose-600' : 'text-black'}`}>{product.availableStock}</span>
                                    </div>
                                    
                                    <div className="flex justify-center">
                                      <div className={`flex items-center bg-white border ${currentQty > 0 ? 'border-black ring-1 ring-black/5' : 'border-slate-200'} rounded-xl overflow-hidden h-10 w-[130px] shadow-sm transition-all focus-within:border-black focus-within:ring-2 focus-within:ring-black/10`}>
                                        <button onClick={() => handleDecrement(product)} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100"><Minus size={16} strokeWidth={3}/></button>
                                        <input 
                                          type="number"
                                          value={currentQty === 0 ? '' : currentQty}
                                          onChange={(e) => handleManualQuantity(product, e.target.value)}
                                          onBlur={(e) => handleQuantityBlur(product, e.target.value)}
                                          placeholder="0"
                                          className="flex-1 w-full h-full text-center bg-slate-50 text-sm font-bold text-black border-x border-slate-200 outline-none p-0"
                                        />
                                        <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30"><Plus size={16} strokeWidth={3}/></button>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end pr-2">
                                      <span className={`font-['Manrope',_sans-serif] text-lg font-extrabold ${currentQty > 0 ? 'text-black' : 'text-slate-300'}`}>
                                        ₹{(currentQty * displayPrice).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* MOBILE STACKED CARDS VIEW */}
                      <div className="md:hidden flex flex-col gap-3">
                        {products.map((product) => {
                          const currentQty = cart[product.id] || 0;
                          const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
                          const displayPrice = isBulkApplied ? product.bulkDealPrice : product.price;

                          return (
                            <div key={product.id} className={`bg-white border ${currentQty > 0 ? 'border-black' : 'border-slate-200'} rounded-[20px] p-4 shadow-sm flex flex-col gap-3 transition-colors`}>
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex flex-col flex-1 overflow-hidden">
                                  <span className="text-[10px] font-bold text-slate-400 mb-0.5 truncate uppercase tracking-widest">{product.brand}</span>
                                  <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-black leading-tight line-clamp-2">{product.productName}</span>
                                </div>
                                <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                  <span className="font-['Manrope',_sans-serif] text-lg font-extrabold text-black leading-none">₹{product.price.toLocaleString('en-IN')}</span>
                                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5">/{product.unit}</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-extrabold uppercase border border-rose-200 bg-rose-50 text-rose-600">
                                  Min: {product.minimumOrderQuantity} {product.unit}
                                </span>
                                {product.bulkDealQuantity && product.bulkDealPrice && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-extrabold uppercase border ${isBulkApplied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                    Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice}
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-extrabold uppercase border ${product.availableStock < 10 ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                  Stock: {product.availableStock}
                                </span>
                              </div>

                              <div className="flex items-center justify-between gap-3 mt-2 pt-3 border-t border-slate-100">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Line Total</span>
                                  <span className={`font-['Manrope',_sans-serif] text-[18px] font-extrabold leading-none ${currentQty > 0 ? 'text-black' : 'text-slate-300'}`}>
                                    ₹{(currentQty * displayPrice).toLocaleString('en-IN')}
                                  </span>
                                </div>
                                
                                <div className={`flex items-center bg-white border ${currentQty > 0 ? 'border-black ring-1 ring-black/5' : 'border-slate-200'} rounded-xl overflow-hidden h-11 w-[120px] shadow-sm`}>
                                  <button onClick={() => handleDecrement(product)} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100"><Minus size={16} strokeWidth={3}/></button>
                                  <input 
                                    type="number"
                                    value={currentQty === 0 ? '' : currentQty}
                                    onChange={(e) => handleManualQuantity(product, e.target.value)}
                                    onBlur={(e) => handleQuantityBlur(product, e.target.value)}
                                    placeholder="0"
                                    className="flex-1 w-full h-full text-center bg-slate-50 text-sm font-bold text-black border-x border-slate-200 outline-none p-0"
                                  />
                                  <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100"><Plus size={16} strokeWidth={3}/></button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* --- TAB 2: BUSINESS IDENTITY & SMART GRID --- */}
              {activeTab === 'profile' && (
                <div className="flex flex-col gap-4 md:gap-6">

                  {/* Key Metrics Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-white border border-slate-200 rounded-[20px] p-4 md:p-5 shadow-sm flex flex-col justify-center gap-1.5">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Experience</span>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-black" />
                        <span className="font-['Manrope',_sans-serif] text-lg md:text-xl font-extrabold text-black">{profile.yearsInBusiness || '< 1'} Yrs</span>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[20px] p-4 md:p-5 shadow-sm flex flex-col justify-center gap-1.5">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Orders Fulfilled</span>
                      <div className="flex items-center gap-2">
                        <PackageCheck size={18} className="text-emerald-500" />
                        <span className="font-['Manrope',_sans-serif] text-lg md:text-xl font-extrabold text-black">{profile.totalOrdersFulfilled || '0'}+</span>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[20px] p-4 md:p-5 shadow-sm flex flex-col justify-center gap-1.5 col-span-2 md:col-span-2">
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Store Format</span>
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-pink-500" />
                        <span className="font-['Manrope',_sans-serif] text-base md:text-lg font-extrabold text-black truncate">{profile.storeSize || 'Wholesale Center'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                      
                      {/* --- ABOUT SECTION WITH EXPLICIT EDIT BUTTON --- */}
                      <div className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm relative">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                          <h3 className="font-['Manrope',_sans-serif] text-[16px] md:text-xl font-extrabold text-black flex items-center gap-2">
                            <Info size={20} className="text-slate-400" /> About the Company
                          </h3>
                          
                          {!isEditingDesc ? (
                            <button 
                              onClick={() => {
                                setDescValue(profile.businessDescription || DEFAULT_DESCRIPTION);
                                setIsEditingDesc(true);
                              }} 
                              className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-slate-100 text-slate-700 text-xs md:text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                              <Edit3 size={16} /> Edit
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { 
                                  setIsEditingDesc(false); 
                                  setDescValue(profile.businessDescription || ""); 
                                }} 
                                className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={handleSaveDescription} 
                                disabled={isSavingDesc} 
                                className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-black text-white text-xs md:text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
                              >
                                {isSavingDesc ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {isEditingDesc ? (
                          <textarea 
                            className="w-full min-h-[140px] p-4 bg-slate-50  rounded-2xl text-[13px] md:text-sm font-medium text-slate-700 outline-none focus:border-pink-100 focus:ring-2 focus:ring-pink/10 resize-none transition-all"
                            value={descValue}
                            onChange={(e) => setDescValue(e.target.value)}
                            placeholder="Write a detailed description about your business, heritage, and values..."
                            autoFocus
                          />
                        ) : (
                          <p className="text-[13px] md:text-[15px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                            {profile.businessDescription || DEFAULT_DESCRIPTION}
                          </p>
                        )}
                      </div>

                      {/* Smart Sub-Category Grid */}
                      {subCategories.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
                          <h3 className="font-['Manrope',_sans-serif] text-[16px] md:text-xl font-extrabold text-black mb-4 md:mb-6">Sourcing Categories</h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
                            {displayedCats.map((cat, i) => (
                              <div key={i} className="aspect-square rounded-[16px] overflow-hidden relative group cursor-pointer border border-slate-200 shadow-sm bg-slate-50">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 p-2 flex items-end justify-center text-center translate-y-2 group-hover:translate-y-0 transition-transform">
                                  <span className="text-white text-[10px] md:text-xs font-extrabold leading-tight drop-shadow-md line-clamp-2">{cat.name}</span>
                                </div>
                              </div>
                            ))}
                            {extraCount > 0 && (
                              <div onClick={() => setShowSubCatModal(true)} className="aspect-square rounded-[16px] overflow-hidden relative cursor-pointer border border-slate-200 shadow-sm bg-slate-100 group">
                                <img src={subCategories[maxGridItems].image} alt="More" className="w-full h-full object-cover blur-sm opacity-50 transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                                  <span className="font-['Manrope',_sans-serif] text-xl md:text-3xl font-extrabold text-white">+{extraCount}</span>
                                  <span className="text-white/90 text-[9px] md:text-[11px] font-bold uppercase tracking-wider mt-1">More</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {/* Community Rating Module */}
                      {!isOwner && (
                        <div className="bg-gradient-to-br from-slate-900 to-black rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-lg text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
                          <h3 className="font-['Manrope',_sans-serif] text-[16px] md:text-xl font-extrabold mb-1.5">Rate this Partner</h3>
                          <p className="text-[11px] md:text-[13px] text-slate-400 font-medium mb-5 md:mb-6 leading-relaxed">Your rating actively influences their algorithmic Trust Score and Market Rank. <span className="text-pink-400">One-time rating only.</span></p>
                          
                          <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => initiateRating(star)}
                                disabled={profile?.hasRated || hasRatedLocally}
                                className={`focus:outline-none transition-transform ${(profile?.hasRated || hasRatedLocally) ? 'cursor-not-allowed opacity-70' : 'hover:scale-110'}`}
                              >
                                <Star 
                                  size={isMobile ? 28 : 32} 
                                  className={`${(hoverRating || (profile?.hasRated && 5)) >= star ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-slate-600'}`} 
                                />
                              </button>
                            ))}
                          </div>
                          {(profile?.hasRated || hasRatedLocally) && (
                            <div className="text-[10px] md:text-xs font-bold text-emerald-400 flex items-center gap-2 bg-emerald-400/10 py-2 px-3 rounded-xl w-fit">
                              <Check size={14} /> Rating Data Submitted
                            </div>
                          )}
                        </div>
                      )}

                      {/* Contact & Operations Info */}
                      <div className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 md:pb-4 mb-4 md:mb-5">
                          <h3 className="font-['Manrope',_sans-serif] text-[16px] md:text-xl font-extrabold text-black">Contact & Info</h3>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                          {profile.mobileNumber && (
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 shrink-0 border border-slate-200"><Phone size={16} className="md:w-5 md:h-5" /></div>
                              <div className="flex flex-col">
                                <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-0.5">Mobile</p>
                                <p className="text-[13px] md:text-[15px] font-bold text-black leading-none">{profile.mobileNumber}</p>
                              </div>
                            </div>
                          )}
                          {profile.whatsappNumber && (
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100"><MessageSquare size={16} className="md:w-5 md:h-5" /></div>
                              <div className="flex flex-col">
                                <p className="text-[10px] md:text-xs font-bold uppercase text-emerald-600 tracking-wider mb-0.5">WhatsApp</p>
                                <p className="text-[13px] md:text-[15px] font-bold text-black leading-none">{profile.whatsappNumber}</p>
                              </div>
                            </div>
                          )}
                          {profile.district && (
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 shrink-0 border border-slate-200"><MapPin size={16} className="md:w-5 md:h-5" /></div>
                              <div className="flex flex-col">
                                <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-0.5">Primary District</p>
                                <p className="text-[13px] md:text-[15px] font-bold text-black leading-none">{profile.district}</p>
                              </div>
                            </div>
                          )}
                          {profile.businessEmail && (
                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 shrink-0 border border-slate-200"><Mail size={16} className="md:w-5 md:h-5" /></div>
                              <div className="flex flex-col overflow-hidden">
                                <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-0.5">Email</p>
                                <p className="text-[13px] md:text-[15px] font-bold text-black truncate leading-none">{profile.businessEmail}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 shrink-0 border border-slate-200"><Clock size={16} className="md:w-5 md:h-5" /></div>
                            <div className="flex flex-col">
                              <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-0.5">Operating Timings</p>
                              <p className="text-[13px] md:text-[15px] font-bold text-black leading-tight">
                                {profile.openingTime && profile.closingTime ? `${formatTime(profile.openingTime)} - ${formatTime(profile.closingTime)}` : 'Standard Hours'}
                              </p>
                              <p className="text-[11px] md:text-xs font-semibold text-slate-500 mt-1">{profile.operatingDays || 'Mon - Sat'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB 3: DELIVERY & TERMS --- */}
              {activeTab === 'delivery' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 shrink-0">
                        <Truck size={24} className="md:w-8 md:h-8" />
                      </div>
                      <div>
                        <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-black leading-tight">Logistics Engine</h3>
                        <p className="text-[12px] md:text-sm font-medium text-slate-500 mt-1">B2B fulfillment rules.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 md:gap-5 flex-1">
                      <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-[14px] md:text-base font-bold text-black">Direct Delivery</span>
                        <span className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-extrabold tracking-widest uppercase ${profile.deliverySupported ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
                          {profile.deliverySupported ? 'Active' : 'Pickup Only'}
                        </span>
                      </div>
                      
                      {profile.deliverySupported && (
                        <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-4 md:space-y-5 shadow-sm">
                          <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-slate-100">
                            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Service Radius</span>
                            <span className="text-[14px] md:text-base font-extrabold text-black bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">{profile.coverageRadiusKm ? `${profile.coverageRadiusKm} KM` : 'Local'}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-slate-100">
                            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Min. Order Value</span>
                            <span className="text-[14px] md:text-base font-extrabold text-black">{profile.minimumOrderValue ? `₹${profile.minimumOrderValue.toLocaleString('en-IN')}` : 'No Minimum'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Fee</span>
                            <span className="text-[14px] md:text-base font-extrabold text-emerald-600">
                              {profile.deliveryCharge ? `₹${profile.deliveryCharge.toLocaleString('en-IN')}` : 'Free Delivery'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] p-5 sm:p-6 md:p-8 shadow-sm flex flex-col h-full relative overflow-hidden group">
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 border-[30px] md:border-[40px] border-slate-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                    
                    <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-8 relative z-10">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30 shrink-0">
                        <MapPin size={24} className="md:w-8 md:h-8" />
                      </div>
                      <div>
                        <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-black leading-tight">Dispatch Center</h3>
                        <p className="text-[12px] md:text-sm font-medium text-slate-500 mt-1">Official registered address.</p>
                      </div>
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-6 relative z-10 shadow-inner">
                      <div className="grid grid-cols-2 gap-y-4 md:gap-y-5 gap-x-3">
                        <div className="col-span-2">
                          <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Address Line 1</p>
                          <p className="text-[13px] md:text-[15px] font-bold text-black leading-snug">{profile.addressLine1 || 'N/A'}</p>
                        </div>
                        {profile.addressLine2 && (
                          <div className="col-span-2">
                            <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Address Line 2</p>
                            <p className="text-[13px] md:text-[15px] font-bold text-black leading-snug">{profile.addressLine2}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">City</p>
                          <p className="text-[13px] md:text-[15px] font-bold text-black">{profile.city || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">District</p>
                          <p className="text-[13px] md:text-[15px] font-bold text-black">{profile.district || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">State</p>
                          <p className="text-[13px] md:text-[15px] font-bold text-black">{profile.state || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Pincode</p>
                          <p className="text-[13px] md:text-[15px] font-bold text-black">{profile.pincode || 'N/A'}</p>
                        </div>
                        {profile.landmark && (
                          <div className="col-span-2 mt-2 pt-3 md:pt-4 border-t border-slate-200">
                            <p className="text-[10px] md:text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Landmark</p>
                            <p className="text-[13px] md:text-[15px] font-bold text-slate-700 leading-snug">{profile.landmark}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- BOTTOM CART BAR --- */}
        <AnimatePresence>
          {cartTotals.items > 0 && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-0 left-0 w-full bg-[#0F1626] border-t border-slate-800 shadow-[0_-12px_40px_rgba(0,0,0,0.3)] z-40 pb-safe"
            >
              <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3 md:py-5 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-8 text-white">
                  <div className="relative bg-slate-800 p-2.5 md:p-3.5 rounded-xl hidden sm:block">
                    <ShoppingCart size={isMobile ? 20 : 26} />
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-md">{cartTotals.items}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Order Value <span className="sm:hidden">({cartTotals.items} items)</span></span>
                    <span className="font-['Manrope',_sans-serif] text-[18px] sm:text-2xl md:text-3xl font-extrabold leading-none mt-1">₹{cartTotals.cost.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button onClick={() => setShowCheckoutModal(true)} className="px-5 sm:px-6 md:px-10 py-2.5 md:py-4 bg-pink-500 text-[13px] md:text-base font-bold text-white rounded-xl md:rounded-2xl hover:bg-pink-600 active:scale-95 shadow-lg shadow-pink-500/25 transition-all duration-200">
                  Review Order
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODALS --- */}
        
        {/* Rating Confirm Modal */}
        {showRatingConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white rounded-[24px] max-w-xs w-full p-6 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mx-auto border border-yellow-100"><Star fill="currentColor" size={28}/></div>
              <h4 className="font-['Manrope',_sans-serif] text-xl font-extrabold text-black">Confirm Rating?</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">You are about to rate this partner <b>{selectedRating} stars</b>. This helps establish their market rank and cannot be changed later.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowRatingConfirm(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={confirmAndSubmitRating} className="flex-1 py-3 bg-black text-white font-bold text-xs rounded-xl hover:bg-slate-800 shadow-md transition-all">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Subcategory Expand Modal */}
        <AnimatePresence>
          {showSubCatModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/80 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-4xl p-5 md:p-8 shadow-2xl max-h-[90vh] flex flex-col"
              >
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-black">All Categories</h3>
                  <button onClick={() => setShowSubCatModal(false)} className="p-2 text-slate-400 hover:text-black bg-slate-100 rounded-full transition-colors"><X size={18} className="md:w-6 md:h-6"/></button>
                </div>
                <div className="overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-5 p-1 hide-scrollbar">
                  {subCategories.map((cat, i) => (
                    <div key={i} className="aspect-square rounded-[16px] md:rounded-2xl overflow-hidden relative group border border-slate-200 shadow-sm">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
                      <div className="absolute inset-0 p-2 md:p-4 flex items-center justify-center text-center">
                        <span className="text-white text-[11px] md:text-sm font-extrabold leading-tight drop-shadow-lg">{cat.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout Modal */}
        <AnimatePresence>
          {showCheckoutModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="bg-white rounded-t-[24px] sm:rounded-[32px] max-w-2xl w-full p-5 md:p-8 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 md:pb-5 mb-3 md:mb-5">
                  <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-black">Order Request Summary</h3>
                  <button onClick={() => setShowCancelConfirmModal(true)} className="p-2 md:p-2.5 text-slate-400 hover:text-black bg-slate-50 rounded-full"><X size={18} className="md:w-5 md:h-5"/></button>
                </div>

                <div className="overflow-y-auto flex-1 pr-1 md:pr-2 space-y-4 md:space-y-5 hide-scrollbar">
                  <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-200 flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-white font-extrabold font-['Manrope',_sans-serif] text-[16px] md:text-2xl">{firstLetter}</div>
                    <div>
                      <p className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fulfilling Partner</p>
                      <p className="text-[15px] md:text-xl font-extrabold text-black leading-tight mt-0.5">{profile.businessName}</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {cartItemsList.map(item => (
                      <div key={item.id} className="p-3 md:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col gap-1 md:gap-1.5">
                          <p className="text-[13px] md:text-[15px] font-bold text-black line-clamp-1">{item.productName}</p>
                          <p className="text-[11px] md:text-xs text-slate-500 font-medium">
                            {item.orderQty} {item.unit} × ₹{item.appliedPrice.toLocaleString('en-IN')}
                            {item.appliedPrice < item.price && (
                              <span className="text-[9px] md:text-[10px] text-emerald-700 font-extrabold ml-2 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Bulk Deal</span>
                            )}
                          </p>
                        </div>
                        <p className="text-[14px] md:text-lg font-extrabold text-black">₹{item.lineTotal.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 text-white p-4 md:p-6 rounded-2xl space-y-2 md:space-y-3 shadow-lg">
                    <div className="flex justify-between text-[11px] md:text-sm font-medium text-slate-400"><span>Subtotal</span><span>₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-[11px] md:text-sm font-medium text-slate-400"><span>Est. Tax / Delivery</span><span className="text-[9px] md:text-xs bg-white/10 px-2 py-1 rounded">Calculated by Seller</span></div>
                    <div className="flex justify-between items-end border-t border-slate-700 pt-3 md:pt-4 mt-2 md:mt-3">
                      <span className="text-[12px] md:text-base font-bold text-slate-300">Request Total</span>
                      <span className="font-['Manrope',_sans-serif] text-[18px] md:text-3xl font-extrabold leading-none">₹{cartTotals.cost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-slate-100 mt-4">
                  <button onClick={() => setShowCancelConfirmModal(true)} className="flex-1 py-3.5 md:py-4 bg-white border border-slate-200 text-slate-600 font-bold text-[13px] md:text-base rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                    Discard Draft
                  </button>
                  <button onClick={() => setShowPlaceOrderConfirmModal(true)} className="flex-[2] py-3.5 md:py-4 bg-pink-500 text-white font-bold text-[13px] md:text-base rounded-xl md:rounded-2xl hover:bg-pink-600 shadow-lg shadow-pink-500/20 transition-all active:scale-95">
                    Send Order Request
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cancel Confirm Modal */}
        {showCancelConfirmModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white rounded-[24px] md:rounded-[32px] max-w-xs md:max-w-sm w-full p-6 md:p-8 shadow-2xl text-center space-y-3 md:space-y-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100"><AlertCircle size={24} className="md:w-8 md:h-8"/></div>
              <h4 className="font-['Manrope',_sans-serif] text-[18px] md:text-xl font-extrabold text-black">Discard Order?</h4>
              <p className="text-[12px] md:text-sm text-slate-500 font-medium leading-relaxed">Are you sure? All selected items and quantities will be cleared from this partner's cart.</p>
              <div className="flex flex-row gap-3 pt-3 md:pt-4">
                <button onClick={() => setShowCancelConfirmModal(false)} className="flex-1 py-3 border border-slate-200 text-black font-bold text-[12px] md:text-sm rounded-xl hover:bg-slate-50 transition-all active:scale-95">Keep Editing</button>
                <button onClick={() => { setCart({}); setShowCancelConfirmModal(false); setShowCheckoutModal(false); }} className="flex-1 py-3 bg-rose-500 text-white font-bold text-[12px] md:text-sm rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95">Yes, Discard</button>
              </div>
            </div>
          </div>
        )}

        {/* Place Order Confirm Modal */}
        {showPlaceOrderConfirmModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white rounded-[24px] md:rounded-[32px] max-w-xs md:max-w-md w-full p-6 md:p-8 shadow-2xl text-center space-y-3 md:space-y-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl"><CheckCircle2 size={24} className="md:w-8 md:h-8"/></div>
              <h4 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-black">Send Request?</h4>
              <p className="text-[12px] md:text-sm text-slate-500 font-medium leading-relaxed">This will notify <b>{profile.businessName}</b> to review and schedule your delivery. You won't be charged until they confirm.</p>
              <div className="flex flex-row gap-3 pt-3 md:pt-4">
                <button onClick={() => setShowPlaceOrderConfirmModal(false)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold text-[12px] md:text-sm rounded-xl hover:bg-slate-50 transition-all active:scale-95">Back</button>
                <button onClick={handleConfirmOrderPlacement} disabled={isPlacingOrder} className="flex-[2] py-3 bg-emerald-500 text-white font-bold text-[12px] md:text-sm rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                  {isPlacingOrder && <Loader2 size={16} className="animate-spin" />} Confirm & Send
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
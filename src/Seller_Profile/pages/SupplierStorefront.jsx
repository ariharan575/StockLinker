import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MapPin, Search, Minus, Plus, ShoppingCart, ShieldCheck, Info,
  Truck, X, Phone, Mail, MessageCircle, Clock, Award, Building2, 
  PackageCheck, Briefcase, TrendingUp, Edit3, UserPlus, Save, Check, MessageSquare, RotateCcw, ChevronDown, Loader2, AlertCircle, CheckCircle2, PackageSearch
} from 'lucide-react';
import { storefrontApi, orderApi, profileApi, networkApi } from '../../Authentication/services/api';

// --- ADDED PREMIUM COMPONENTS IMPORTS ---
import { PremiumToast } from '../../components/PremiumToast';
import { DataFetchError } from '../../components/DataFetchError';

// ============================================================
// IMAGE UTILS FOR CATEGORIES
// ============================================================
// Safely import subcategory images based on the reference provided
const subcategoryImages = import.meta.glob(
  "../../assets/subcategories/*", 
  { eager: true, import: "default" }
);

const getSubcategoryImageUrl = (imageName) => {
  if (!imageName) return null;
  if (imageName.startsWith('http') || imageName.startsWith('data:')) return imageName;
  
  // Try to match the filename across different potential path depths
  const matchingKey = Object.keys(subcategoryImages).find(key => key.includes(imageName));
  return matchingKey ? subcategoryImages[matchingKey] : null;
};

const DEFAULT_FILTERS = { category: 'all', brand: 'all', sortPrice: 'none' };

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hourString, minute] = timeStr.split(':');
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${minute} ${ampm}`;
};

const DEFAULT_DESCRIPTION = `Welcome to our center. We pride ourselves on delivering top-tier products with unmatched reliability. We ensure that your sourcing needs are met with precision, speed, and competitive pricing. Partner with us for a seamless supply chain experience.`;

const StorefrontSkeleton = () => (
  <div className="min-h-screen bg-[#FAFAFA] p-4 flex flex-col gap-6 animate-pulse w-full">
    <div className="h-64 bg-slate-200 rounded-[24px] w-full max-w-[1440px] mx-auto border border-slate-200/60"></div>
    <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 gap-6">
      <div className="h-96 bg-slate-200 rounded-[24px] border border-slate-200/60"></div>
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
  
  // --- ADDED GLOBAL FETCH ERROR STATE & TOAST ---
  const [fetchError, setFetchError] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState('profile');
  const [cart, setCart] = useState({});

  // Auth & Ownership Logic
  const currentLoggedInUserId = localStorage.getItem('userId') || "user-123"; 
  const isOwner = profile?.userId === currentLoggedInUserId;

  // Role Logic: Check if the profile belongs to a Shopkeeper
  const isShopkeeper = profile?.businessType?.toLowerCase().includes('shop') || 
                       profile?.businessType?.toLowerCase().includes('retail');

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
      setFetchError(false);
      try {
        const [profileRes, filtersRes] = await Promise.all([
          storefrontApi.getProfile(businessProfileId),
          storefrontApi.getFilters(businessProfileId)
        ]);
        setProfile(profileRes.data);
        setDescValue(profileRes.data.businessDescription || "");
        setFilterOptions(filtersRes.data);
        
        // Setup initial tab based on role
        const shopkeeperCheck = profileRes.data.businessType?.toLowerCase().includes('shop') || 
                                profileRes.data.businessType?.toLowerCase().includes('retail');
        setActiveTab(shopkeeperCheck ? 'profile' : 'catalog');
        
      } catch (error) {
        console.error("Failed to load storefront profile", error);
        setFetchError(true); // --- TRIGGER FULL PAGE ERROR ON FAIL ---
      } finally {
        setIsLoadingProfile(false);
      }
    };
    if (businessProfileId) fetchInitialData();
  }, [businessProfileId]);

  useEffect(() => {
    if (isShopkeeper) {
      setIsLoadingProducts(false); // No products for shopkeeper
      return;
    }
    const delayDebounceFn = setTimeout(() => fetchFilteredProducts(), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [businessProfileId, searchTerm, filters, isShopkeeper]);

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
      await profileApi.updateBusiness({ businessDescription: descValue });
      setProfile(prev => ({ ...prev, businessDescription: descValue }));
      setIsEditingDesc(false);
      showNotification('success', "Description updated successfully!");
    } catch (error) {
      showNotification('error', "Failed to update description. Please check your connection and try again.");
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
      showNotification('success', "Rating submitted successfully!");
    } catch (error) {
      console.error("Failed to submit rating", error);
      showNotification('error', "Failed to submit rating.");
      setShowRatingConfirm(false);
    }
  };

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      await networkApi.requestConnection(profile.businessId);
      showNotification('success', "Connection request sent successfully!");
    } catch (error) {
      showNotification('error', error.response?.data?.message || "Failed to send request.");
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
      showNotification('success', "Order placed successfully!");
      navigate('/orders');
    } catch (error) {
      showNotification('error', `Order Failed: ${error.response?.data?.message || 'Check connection.'}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const firstLetter = profile?.businessName ? profile.businessName.charAt(0).toUpperCase() : 'S';
  const subCategories = profile?.subCategories && profile.subCategories.length > 0 ? profile.subCategories : [];
  const maxGridItems = isMobile ? 5 : 9;
  const displayedCats = subCategories.slice(0, maxGridItems);
  const extraCount = subCategories.length - maxGridItems;

  const availableTabs = isShopkeeper 
    ? [{ id: 'profile', label: 'Business Identity' }] 
    : [
        { id: 'catalog', label: 'Product Catalog' },
        { id: 'profile', label: 'Business Identity' },
        { id: 'delivery', label: 'Fulfillment Details' }
      ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}} />
      
      <div className="min-h-screen bg-[#FAFAFA] font-['Inter',_sans-serif] text-[#0F1626] pb-32">
        
        {/* --- PREMIUM TOAST GLOBAL REPLACEMENT --- */}
        <PremiumToast 
          isVisible={!!notification} 
          type={notification?.type || 'info'} 
          message={notification?.msg} 
          onClose={() => setNotification(null)} 
        />

        {/* --- ADDED CHECK TO RENDER ERROR COMPONENT AS FULL PAGE REPLACEMENT --- */}
        {fetchError ? (
          <div className="pt-10">
            <DataFetchError onRetry={() => window.location.reload()} />
          </div>
        ) : isLoadingProfile ? (
          <StorefrontSkeleton />
        ) : !profile ? (
          <div className="flex items-center justify-center min-h-[50vh] font-bold text-black">Profile Not Found</div>
        ) : (
          <>
            <div className="max-w-[1440px] mx-auto flex my-2 flex-col gap-6 md:gap-8">
              
              {/* --- UNIFIED HEADER SECTION --- */}
              <section className="bg-white p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-slate-200/60 flex flex-col gap-6 w-full">
                
                <div className="flex flex-row gap-5 md:gap-8 items-start w-full">
                  <div className="flex items-center justify-center w-[72px] h-[72px] sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] bg-slate-900 rounded-[20px] md:rounded-[28px] text-white flex-shrink-0 relative">
                    <span className="font-['Manrope',_sans-serif] text-[32px] sm:text-[40px] md:text-[56px] font-extrabold tracking-tighter">{firstLetter}</span>
                    {profile.verificationStatus === 'VERIFIED' && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 md:p-2 rounded-full border-4 border-white shadow-sm">
                        <ShieldCheck size={isMobile ? 14 : 18} strokeWidth={2.5}/>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                      <h1 className="font-['Manrope',_sans-serif] text-[24px] sm:text-3xl md:text-[36px] font-extrabold text-slate-900 leading-tight tracking-tight">
                        {profile.businessName}
                      </h1>
                      {profile.gstNumber && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold tracking-widest uppercase rounded-lg border border-slate-200/60 w-fit">
                          GST Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] md:text-[15px] font-medium text-slate-500">Operated by <span className="font-bold text-slate-800">{profile.ownerName}</span> • {profile.businessType}</p>
                    
                    {/* Trust Metrics */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[13px] md:text-sm font-extrabold text-slate-900">{profile.rating || '4.8'} <span className="text-slate-400 font-medium">({profile.reviewCount || 0})</span></span>
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <Award size={16} className="text-pink-500" />
                        <span className="text-[13px] md:text-sm font-bold text-slate-700">Trust Score {profile.trustScore || '95'}</span>
                      </div>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <TrendingUp size={16} className="text-emerald-500" />
                        <span className="text-[13px] md:text-sm font-bold text-slate-700">Rank #{profile.marketplaceRank || '1'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BAR (Left Aligned, below Info) */}
                <div className="flex flex-wrap items-center gap-3 w-full justify-start mt-2">
                  {isOwner ? (
                    <div className="flex items-center gap-2 bg-pink-50 text-pink-700 px-4 py-3 rounded-xl border border-pink-100/50">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                      <span className="text-[13px] font-bold">Viewing your own profile</span>
                    </div>
                  ) : (
                    <>
                      <button className="px-5 py-3 md:px-6 bg-white border border-slate-200/80 text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <MessageCircle size={16} /> <span className="hidden sm:inline">Message</span>
                      </button>
                      <button className="px-5 py-3 md:px-6 bg-white border border-slate-200/80 text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                        <Phone size={16} /> <span className="hidden sm:inline">Call</span>
                      </button>
                      <button onClick={handleConnect} disabled={isConnecting} className="px-6 py-3 md:px-8 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-70">
                        {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />} 
                        <span>Connect</span>
                      </button>
                    </>
                  )}
                </div>

                {/* TABS */}
                <div className="flex items-center justify-start gap-8 border-b border-slate-100 mt-2 overflow-x-auto hide-scrollbar w-full">
                  {availableTabs.map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)} 
                      className={`pb-4 text-[14px] md:text-[15px] font-bold transition-all border-b-[3px] whitespace-nowrap outline-none ${activeTab === tab.id ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </section>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  
                  {/* --- TAB 1: PRODUCT CATALOG --- */}
                  {activeTab === 'catalog' && (
                    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
                      
                      {/* Integrated Search & Filter Header */}
                      <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col lg:flex-row items-center justify-between gap-4">
                        <div className="relative flex items-center w-full lg:max-w-md bg-white border border-slate-200 rounded-xl focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/10 transition-all h-12 shadow-sm">
                          <Search className="absolute left-4 text-slate-400" size={18} />
                          <input type="text" className="w-full h-full pl-12 pr-4 bg-transparent text-[14px] font-medium outline-none placeholder:text-slate-400" placeholder="Search by name or brand..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto hide-scrollbar">
                          <div className="relative inline-flex items-center flex-shrink-0">
                            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-[13px] font-bold h-12 pl-4 pr-10 rounded-xl outline-none cursor-pointer hover:border-slate-300 shadow-sm transition-colors" value={filters.category} onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}>
                              <option value="all">All Categories</option>
                              {filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={16} />
                          </div>
                          <div className="relative inline-flex items-center flex-shrink-0">
                            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-[13px] font-bold h-12 pl-4 pr-10 rounded-xl outline-none cursor-pointer hover:border-slate-300 shadow-sm transition-colors" value={filters.brand} onChange={(e) => setFilters(prev => ({...prev, brand: e.target.value}))}>
                              <option value="all">All Brands</option>
                              {filterOptions.brands.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={16} />
                          </div>
                          <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }} className="flex items-center justify-center w-12 h-12 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex-shrink-0 shadow-sm">
                            <RotateCcw size={18} />
                          </button>
                        </div>
                      </div>

                      {isLoadingProducts ? (
                        <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
                      ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 min-h-[350px] m-4 md:m-8">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white mb-5 shadow-sm border border-slate-100 ring-4 ring-slate-50">
                            <PackageSearch className="h-7 w-7 text-slate-400" />
                          </div>
                          <h3 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight text-slate-900 mb-2">
                            No products found
                          </h3>
                          <p className="text-[14px] text-slate-500 max-w-sm mb-6 leading-relaxed">
                            We couldn't find any products matching your current filters or search terms. Try adjusting them to see more results.
                          </p>
                          {(searchTerm || filters.category !== 'all' || filters.brand !== 'all') && (
                            <button
                              onClick={() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }}
                              className="rounded-xl bg-pink-50 text-pink-600 px-6 py-2.5 text-[14px] font-semibold transition-all hover:bg-pink-100 shadow-sm"
                            >
                              Clear All Filters
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="w-full">
                          {/* DESKTOP TABLE VIEW */}
                          <div className="hidden md:block w-full overflow-x-auto">
                            <div className="min-w-[1000px]">
                              <div className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                                <span>Product Details</span>
                                <span>Brand</span>
                                <span>Base Price</span>
                                <span>Rules / Deals</span>
                                <span className="text-center">Stock</span>
                                <span className="text-center">Quantity</span>
                                <span className="text-right">Line Total</span>
                              </div>
                              
                              <div className="flex flex-col divide-y divide-slate-100">
                                {products.map((product) => {
                                  const currentQty = cart[product.id] || 0;
                                  const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
                                  const displayPrice = isBulkApplied ? product.bulkDealPrice : product.price;

                                  return (
                                    <div key={product.id} className={`grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 items-center px-8 py-5 transition-colors ${currentQty > 0 ? 'bg-pink-50/30' : 'hover:bg-slate-50/50'}`}>
                                      <div className="flex flex-col gap-0.5 pr-2">
                                        <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-slate-900 truncate">{product.productName}</span>
                                        <span className="text-[12px] font-medium text-slate-500 truncate">{product.category}</span>
                                      </div>
                                      <span className="text-[13px] font-bold text-slate-700">{product.brand}</span>
                                      <div className="flex flex-col">
                                        <span className="font-['Manrope',_sans-serif] text-[15px] font-extrabold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                                        <span className="text-[11px] font-semibold text-slate-400">/{product.unit}</span>
                                      </div>
                                      <div className="flex flex-col items-start gap-1.5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-rose-100 bg-rose-50 text-rose-600">
                                          Min: {product.minimumOrderQuantity} {product.unit}
                                        </span>
                                        {product.bulkDealQuantity && product.bulkDealPrice && (
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isBulkApplied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-center justify-center">
                                        <span className={`text-[13px] font-extrabold ${product.availableStock < 10 ? 'text-rose-600' : 'text-slate-700'}`}>{product.availableStock}</span>
                                      </div>
                                      
                                      <div className="flex justify-center">
                                        <div className={`flex items-center bg-white border ${currentQty > 0 ? 'border-slate-900 ring-1 ring-slate-900/10' : 'border-slate-200'} rounded-xl overflow-hidden h-10 w-[120px] transition-all focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20`}>
                                          <button onClick={() => handleDecrement(product)} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50"><Minus size={14} strokeWidth={3}/></button>
                                          <input 
                                            type="number"
                                            value={currentQty === 0 ? '' : currentQty}
                                            onChange={(e) => handleManualQuantity(product, e.target.value)}
                                            onBlur={(e) => handleQuantityBlur(product, e.target.value)}
                                            placeholder="0"
                                            className="flex-1 w-full h-full text-center bg-transparent text-[13px] font-bold text-slate-900 border-x border-slate-100 outline-none p-0"
                                          />
                                          <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><Plus size={14} strokeWidth={3}/></button>
                                        </div>
                                      </div>

                                      <div className="flex flex-col items-end">
                                        <span className={`font-['Manrope',_sans-serif] text-[16px] font-extrabold ${currentQty > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                                          ₹{(currentQty * displayPrice).toLocaleString('en-IN')}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* MOBILE STACKED LIST VIEW */}
                          <div className="md:hidden flex flex-col divide-y divide-slate-100">
                            {products.map((product) => {
                              const currentQty = cart[product.id] || 0;
                              const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
                              const displayPrice = isBulkApplied ? product.bulkDealPrice : product.price;

                              return (
                                <div key={product.id} className={`p-4 flex flex-col gap-3 transition-colors ${currentQty > 0 ? 'bg-pink-50/20' : 'bg-white'}`}>
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex flex-col flex-1">
                                      <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">{product.brand}</span>
                                      <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-slate-900 leading-tight">{product.productName}</span>
                                    </div>
                                    <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                      <span className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 leading-none">₹{product.price.toLocaleString('en-IN')}</span>
                                      <span className="text-[11px] font-semibold text-slate-400 mt-1">/{product.unit}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-extrabold uppercase border border-rose-100 bg-rose-50 text-rose-600">
                                      Min: {product.minimumOrderQuantity} {product.unit}
                                    </span>
                                    {product.bulkDealQuantity && product.bulkDealPrice && (
                                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-extrabold uppercase border ${isBulkApplied ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                        Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between gap-3 mt-1 pt-3 border-t border-slate-100/50">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Line Total</span>
                                      <span className={`font-['Manrope',_sans-serif] text-[16px] font-extrabold leading-none ${currentQty > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                                        ₹{(currentQty * displayPrice).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                    
                                    <div className={`flex items-center bg-white border ${currentQty > 0 ? 'border-slate-900 ring-1 ring-slate-900/10' : 'border-slate-200'} rounded-xl overflow-hidden h-11 w-[120px]`}>
                                      <button onClick={() => handleDecrement(product)} className="w-10 h-full flex items-center justify-center text-slate-500"><Minus size={16}/></button>
                                      <input 
                                        type="number"
                                        value={currentQty === 0 ? '' : currentQty}
                                        onChange={(e) => handleManualQuantity(product, e.target.value)}
                                        onBlur={(e) => handleQuantityBlur(product, e.target.value)}
                                        placeholder="0"
                                        className="flex-1 w-full h-full text-center bg-transparent text-[13px] font-bold text-slate-900 border-x border-slate-100 outline-none p-0"
                                      />
                                      <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-10 h-full flex items-center justify-center text-slate-500 disabled:opacity-30"><Plus size={16}/></button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- TAB 2: BUSINESS IDENTITY & SMART GRID --- */}
                  {activeTab === 'profile' && (
                    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">

                      {/* Layout Grid inside single container */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                        
                        {/* Left Column (About & Categories) */}
                        <div className="lg:col-span-2 flex flex-col divide-y divide-slate-100">
                          
                          {/* About Section */}
                          <div className="p-6 md:p-10">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                <Info size={20} className="text-slate-400" /> Company Overview
                              </h3>
                              
                              {!isEditingDesc && isOwner && (
                                <button 
                                  onClick={() => {
                                    setDescValue(profile.businessDescription || DEFAULT_DESCRIPTION);
                                    setIsEditingDesc(true);
                                  }} 
                                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-bold rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                              )}
                              {isEditingDesc && (
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => { 
                                      setIsEditingDesc(false); 
                                      setDescValue(profile.businessDescription || ""); 
                                    }} 
                                    className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={handleSaveDescription} 
                                    disabled={isSavingDesc} 
                                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
                                  >
                                    {isSavingDesc ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            {isEditingDesc ? (
                              <textarea 
                                className="w-full min-h-[160px] p-5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-medium text-slate-700 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10 resize-none transition-all"
                                value={descValue}
                                onChange={(e) => setDescValue(e.target.value)}
                                placeholder="Write a detailed description about your business, heritage, and values..."
                                autoFocus
                              />
                            ) : (
                              <p className="text-[14px] md:text-[15px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
                                {profile.businessDescription || DEFAULT_DESCRIPTION}
                              </p>
                            )}
                          </div>

                          {/* Smart Sub-Category Grid */}
                          {subCategories.length > 0 && (
                            <div className="p-6 md:p-10">
                              <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-xl font-extrabold text-slate-900 mb-6">Sourcing Categories</h3>
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
                                {displayedCats.map((cat, i) => {
                                  // Safely resolve image
                                  const imgUrl = getSubcategoryImageUrl(cat.image) || cat.image;
                                  
                                  return (
                                    <div key={i} className="aspect-square rounded-[16px] overflow-hidden relative group cursor-pointer border border-slate-200/60 bg-slate-50 shadow-sm">
                                      {imgUrl ? (
                                        <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase">{cat.name?.charAt(0)}</div>
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute inset-0 p-3 flex items-end justify-center text-center translate-y-1 group-hover:translate-y-0 transition-transform">
                                        <span className="text-white text-[11px] md:text-xs font-extrabold leading-tight drop-shadow-md line-clamp-2">{cat.name}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                                {extraCount > 0 && (
                                  <div onClick={() => setShowSubCatModal(true)} className="aspect-square rounded-[16px] overflow-hidden relative cursor-pointer border border-slate-200/60 bg-slate-100 group shadow-sm">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/5 group-hover:bg-slate-900/10 transition-colors">
                                      <span className="font-['Manrope',_sans-serif] text-xl md:text-2xl font-extrabold text-slate-800">+{extraCount}</span>
                                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">More</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column (Contact & Rating) */}
                        <div className="flex flex-col divide-y divide-slate-100 bg-slate-50/30">
                          
                          {/* Community Rating Module */}
                          {!isOwner && (
                            <div className="p-6 md:p-8">
                              <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 mb-2">Rate this Partner</h3>
                              <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed">Your rating actively influences their algorithmic Trust Score. <span className="text-pink-500">One-time rating only.</span></p>
                              
                              <div className="flex items-center gap-2 mb-4">
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
                                      size={28} 
                                      className={`${(hoverRating || (profile?.hasRated && 5)) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                                    />
                                  </button>
                                ))}
                              </div>
                              {(profile?.hasRated || hasRatedLocally) && (
                                <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 py-2 px-3 rounded-lg w-fit">
                                  <Check size={14} /> Data Submitted
                                </div>
                              )}
                            </div>
                          )}

                          {/* Contact & Operations Info */}
                          <div className="p-6 md:p-8 flex-1">
                            <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 mb-6">Contact & Info</h3>
                            
                            <div className="space-y-6">
                              {profile.mobileNumber && (
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><Phone size={16} /></div>
                                  <div className="flex flex-col pt-0.5">
                                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Mobile</p>
                                    <p className="text-[14px] font-bold text-slate-900">{profile.mobileNumber}</p>
                                  </div>
                                </div>
                              )}
                              {profile.whatsappNumber && (
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100 shadow-sm"><MessageSquare size={16} /></div>
                                  <div className="flex flex-col pt-0.5">
                                    <p className="text-[11px] font-bold uppercase text-emerald-600/70 tracking-wider mb-0.5">WhatsApp</p>
                                    <p className="text-[14px] font-bold text-slate-900">{profile.whatsappNumber}</p>
                                  </div>
                                </div>
                              )}
                              {profile.district && (
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><MapPin size={16} /></div>
                                  <div className="flex flex-col pt-0.5">
                                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Region</p>
                                    <p className="text-[14px] font-bold text-slate-900">{profile.district}</p>
                                  </div>
                                </div>
                              )}
                              {profile.businessEmail && (
                                <div className="flex items-start gap-4 overflow-hidden">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><Mail size={16} /></div>
                                  <div className="flex flex-col pt-0.5 overflow-hidden">
                                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Email</p>
                                    <p className="text-[14px] font-bold text-slate-900 truncate">{profile.businessEmail}</p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm"><Clock size={16} /></div>
                                <div className="flex flex-col pt-0.5">
                                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Operating Hours</p>
                                  <p className="text-[14px] font-bold text-slate-900">
                                    {profile.openingTime && profile.closingTime ? `${formatTime(profile.openingTime)} - ${formatTime(profile.closingTime)}` : 'Standard Hours'}
                                  </p>
                                  <p className="text-[12px] font-medium text-slate-500 mt-0.5">{profile.operatingDays || 'Mon - Sat'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB 3: DELIVERY & TERMS (Hidden for Shopkeepers) --- */}
                  {activeTab === 'delivery' && !isShopkeeper && (
                    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        
                        {/* Logistics Config */}
                        <div className="p-6 md:p-10 flex flex-col h-full">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
                              <Truck size={20} />
                            </div>
                            <div>
                              <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-slate-900 leading-tight">Logistics Engine</h3>
                              <p className="text-[13px] font-medium text-slate-500 mt-1">B2B fulfillment rules.</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-200/60 rounded-xl">
                              <span className="text-[14px] font-bold text-slate-900">Direct Delivery</span>
                              <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold tracking-widest uppercase ${profile.deliverySupported ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                {profile.deliverySupported ? 'Active' : 'Pickup Only'}
                              </span>
                            </div>
                            
                            {profile.deliverySupported && (
                              <div className="border border-slate-200/60 rounded-xl p-5 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Service Radius</span>
                                  <span className="text-[14px] font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/60">{profile.coverageRadiusKm ? `${profile.coverageRadiusKm} KM` : 'Local'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Min. Order Value</span>
                                  <span className="text-[14px] font-extrabold text-slate-900">{profile.minimumOrderValue ? `₹${profile.minimumOrderValue.toLocaleString('en-IN')}` : 'No Minimum'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Delivery Fee</span>
                                  <span className="text-[14px] font-extrabold text-emerald-600">
                                    {profile.deliveryCharge ? `₹${profile.deliveryCharge.toLocaleString('en-IN')}` : 'Free Delivery'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dispatch Address */}
                        <div className="p-6 md:p-10 flex flex-col h-full bg-slate-50/30">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                              <MapPin size={20} />
                            </div>
                            <div>
                              <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-slate-900 leading-tight">Dispatch Center</h3>
                              <p className="text-[13px] font-medium text-slate-500 mt-1">Official registered address.</p>
                            </div>
                          </div>

                          <div className="flex-1 bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                              <div className="col-span-2">
                                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Address Line 1</p>
                                <p className="text-[14px] font-bold text-slate-900 leading-snug">{profile.addressLine1 || 'N/A'}</p>
                              </div>
                              {profile.addressLine2 && (
                                <div className="col-span-2">
                                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Address Line 2</p>
                                  <p className="text-[14px] font-bold text-slate-900 leading-snug">{profile.addressLine2}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">City</p>
                                <p className="text-[14px] font-bold text-slate-900">{profile.city || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">District</p>
                                <p className="text-[14px] font-bold text-slate-900">{profile.district || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">State</p>
                                <p className="text-[14px] font-bold text-slate-900">{profile.state || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Pincode</p>
                                <p className="text-[14px] font-bold text-slate-900">{profile.pincode || 'N/A'}</p>
                              </div>
                              {profile.landmark && (
                                <div className="col-span-2 mt-2 pt-4 border-t border-slate-100">
                                  <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">Landmark</p>
                                  <p className="text-[14px] font-bold text-slate-700 leading-snug">{profile.landmark}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* --- BOTTOM CART BAR (Hidden for Shopkeepers) --- */}
            {!isShopkeeper && (
              <AnimatePresence>
                {cartTotals.items > 0 && (
                  <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 w-full bg-[#0F1626] shadow-[0_-12px_40px_rgba(0,0,0,0.3)] z-40 pb-safe"
                  >
                    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-8 text-white">
                        <div className="relative bg-slate-800 p-2.5 md:p-3.5 rounded-xl hidden sm:block">
                          <ShoppingCart size={isMobile ? 20 : 26} />
                          <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full shadow-md">{cartTotals.items}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] md:text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Order Value <span className="sm:hidden">({cartTotals.items} items)</span></span>
                          <span className="font-['Manrope',_sans-serif] text-[20px] sm:text-2xl md:text-3xl font-extrabold leading-none mt-1">₹{cartTotals.cost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <button onClick={() => setShowCheckoutModal(true)} className="px-6 sm:px-8 md:px-10 py-3 md:py-4 bg-pink-500 text-[13px] md:text-base font-bold text-white rounded-xl md:rounded-2xl hover:bg-pink-600 active:scale-95 shadow-lg shadow-pink-500/25 transition-all duration-200">
                        Review Order
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* --- MODALS --- */}
            
            {/* Subcategory Expand Modal */}
            <AnimatePresence>
              {showSubCatModal && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm"
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-4xl p-6 md:p-8 shadow-2xl max-h-[90vh] flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-['Manrope',_sans-serif] text-[20px] md:text-2xl font-extrabold text-slate-900">All Categories</h3>
                      <button onClick={() => setShowSubCatModal(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full transition-colors"><X size={20}/></button>
                    </div>
                    <div className="overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 p-1 hide-scrollbar">
                      {subCategories.map((cat, i) => {
                        const imgUrl = getSubcategoryImageUrl(cat.image) || cat.image;
                        return (
                          <div key={i} className="aspect-square rounded-[16px] md:rounded-2xl overflow-hidden relative group border border-slate-200/60 bg-slate-50 shadow-sm">
                            {imgUrl ? (
                              <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-xs uppercase">{cat.name?.charAt(0)}</div>
                            )}
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/60 transition-colors" />
                            <div className="absolute inset-0 p-3 md:p-4 flex items-center justify-center text-center">
                              <span className="text-white text-[12px] md:text-sm font-extrabold leading-tight drop-shadow-lg">{cat.name}</span>
                            </div>
                          </div>
                        );
                      })}
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
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                      <h3 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-slate-900">Order Request Summary</h3>
                      <button onClick={() => setShowCancelConfirmModal(true)} className="p-2 md:p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full"><X size={18} className="md:w-5 md:h-5"/></button>
                    </div>

                    <div className="overflow-y-auto flex-1 pr-1 md:pr-2 space-y-4 md:space-y-5 hide-scrollbar">
                      <div className="bg-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-200/60 flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-extrabold font-['Manrope',_sans-serif] text-[18px] md:text-2xl">{firstLetter}</div>
                        <div>
                          <p className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fulfilling Partner</p>
                          <p className="text-[15px] md:text-xl font-extrabold text-slate-900 leading-tight mt-0.5">{profile.businessName}</p>
                        </div>
                      </div>

                      <div className="border border-slate-200/60 rounded-2xl overflow-hidden divide-y divide-slate-100">
                        {cartItemsList.map(item => (
                          <div key={item.id} className="p-4 md:p-5 flex items-center justify-between bg-white">
                            <div className="flex flex-col gap-1">
                              <p className="text-[13px] md:text-[15px] font-bold text-slate-900 line-clamp-1">{item.productName}</p>
                              <p className="text-[11px] md:text-xs text-slate-500 font-medium">
                                {item.orderQty} {item.unit} × ₹{item.appliedPrice.toLocaleString('en-IN')}
                                {item.appliedPrice < item.price && (
                                  <span className="text-[10px] text-emerald-700 font-extrabold ml-2 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Bulk Deal</span>
                                )}
                              </p>
                            </div>
                            <p className="text-[14px] md:text-lg font-extrabold text-slate-900">₹{item.lineTotal.toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-900 text-white p-5 md:p-6 rounded-2xl space-y-3 shadow-lg">
                        <div className="flex justify-between text-[12px] md:text-sm font-medium text-slate-400"><span>Subtotal</span><span>₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-[12px] md:text-sm font-medium text-slate-400"><span>Est. Tax / Delivery</span><span className="text-[10px] md:text-xs bg-white/10 px-2 py-1 rounded">Calculated by Seller</span></div>
                        <div className="flex justify-between items-end border-t border-slate-700 pt-4 mt-3">
                          <span className="text-[13px] md:text-base font-bold text-slate-300">Request Total</span>
                          <span className="font-['Manrope',_sans-serif] text-[20px] md:text-3xl font-extrabold leading-none">₹{cartTotals.cost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-4 pt-5 border-t border-slate-100 mt-4">
                      <button onClick={() => setShowCancelConfirmModal(true)} className="flex-1 py-3.5 md:py-4 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] md:text-base rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all active:scale-95">
                        Discard Draft
                      </button>
                      <button onClick={handleConfirmOrderPlacement} disabled={isPlacingOrder} className="flex-[2] py-3.5 md:py-4 bg-pink-500 text-white font-bold text-[13px] md:text-base rounded-xl md:rounded-2xl hover:bg-pink-600 shadow-lg shadow-pink-500/20 transition-all active:scale-95">
                        Send Order Request
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cancel Confirm Modal */}
            {showCancelConfirmModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-[24px] md:rounded-[32px] max-w-xs md:max-w-sm w-full p-6 md:p-8 shadow-2xl text-center space-y-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100"><AlertCircle size={24}/></div>
                  <h4 className="font-['Manrope',_sans-serif] text-[18px] md:text-xl font-extrabold text-slate-900">Discard Order?</h4>
                  <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-relaxed">Are you sure? All selected items and quantities will be cleared from this partner's cart.</p>
                  <div className="flex flex-row gap-3 pt-4">
                    <button onClick={() => setShowCancelConfirmModal(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-900 font-bold text-[13px] md:text-sm rounded-xl hover:bg-slate-50 transition-all active:scale-95">Keep Editing</button>
                    <button onClick={() => { setCart({}); setShowCancelConfirmModal(false); setShowCheckoutModal(false); }} className="flex-1 py-3 bg-rose-500 text-white font-bold text-[13px] md:text-sm rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95">Yes, Discard</button>
                  </div>
                </div>
              </div>
            )}

            {/* Place Order Confirm Modal */}
            {showPlaceOrderConfirmModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-[24px] md:rounded-[32px] max-w-xs md:max-w-md w-full p-6 md:p-8 shadow-2xl text-center space-y-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl"><CheckCircle2 size={24}/></div>
                  <h4 className="font-['Manrope',_sans-serif] text-[18px] md:text-2xl font-extrabold text-slate-900">Send Request?</h4>
                  <p className="text-[13px] md:text-sm text-slate-500 font-medium leading-relaxed">This will notify <b>{profile.businessName}</b> to review and schedule your delivery. You won't be charged until they confirm.</p>
                  <div className="flex flex-row gap-3 pt-4">
                    <button onClick={() => setShowPlaceOrderConfirmModal(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] md:text-sm rounded-xl hover:bg-slate-50 transition-all active:scale-95">Back</button>
                    <button onClick={handleConfirmOrderPlacement} disabled={isPlacingOrder} className="flex-[2] py-3 bg-emerald-500 text-white font-bold text-[13px] md:text-sm rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95">
                      {isPlacingOrder && <Loader2 size={16} className="animate-spin" />} Confirm & Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rating Confirm Modal */}
            {showRatingConfirm && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-[24px] max-w-xs w-full p-6 shadow-2xl text-center space-y-4">
                  <div className="w-14 h-14 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mx-auto border border-yellow-100"><Star fill="currentColor" size={28}/></div>
                  <h4 className="font-['Manrope',_sans-serif] text-xl font-extrabold text-slate-900">Confirm Rating?</h4>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed">You are about to rate this partner <b>{selectedRating} stars</b>. This helps establish their market rank and cannot be changed later.</p>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowRatingConfirm(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-[13px] rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                    <button onClick={confirmAndSubmitRating} className="flex-1 py-3 bg-slate-900 text-white font-bold text-[13px] rounded-xl hover:bg-slate-800 shadow-md transition-all">Confirm</button>
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </>
  );
}
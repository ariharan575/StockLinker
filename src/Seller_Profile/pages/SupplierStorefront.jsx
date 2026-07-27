import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Search, Minus, Plus, ShoppingCart, ShieldCheck, 
  Truck, ChevronLeft, Info, PackageSearch, RotateCcw, ChevronDown, 
  Loader2, AlertCircle, CheckCircle2, X, Globe, Phone, Mail, 
  MessageCircle, Clock, Award, Building2, PackageCheck, Briefcase, TrendingUp
} from 'lucide-react';
import { storefrontApi, orderApi } from '../../Authentication/services/api';

const DEFAULT_FILTERS = { category: 'all', brand: 'all', sortPrice: 'none' };

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hourString, minute] = timeStr.split(':');
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

export default function SupplierStorefront() {
  const { businessProfileId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ brands: [], categories: [] });
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState('catalog');
  
  const [cart, setCart] = useState({});

  // Modals
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showPlaceOrderConfirmModal, setShowPlaceOrderConfirmModal] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileRes, filtersRes] = await Promise.all([
          storefrontApi.getProfile(businessProfileId),
          storefrontApi.getFilters(businessProfileId)
        ]);
        setProfile(profileRes.data);
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
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredProducts();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [businessProfileId, searchTerm, filters]);

  const fetchFilteredProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const params = {
        search: searchTerm,
        category: filters.category,
        brand: filters.brand,
        sortPrice: filters.sortPrice
      };
      const res = await storefrontApi.getProducts(businessProfileId, params);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // --- QUANTITY LOGIC (MANUAL TYPING + BUTTONS) ---
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
    if (!isNaN(parsed)) {
      setCart(prev => ({ ...prev, [product.id]: parsed }));
    }
  };

  const handleQuantityBlur = (product, value) => {
    if (value === '') return;
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      updateQuantity(product, parsed);
    }
  };

  const cartItemsList = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      if (!product) return null;
      
      const isBulkApplied = product.bulkDealQuantity && qty >= product.bulkDealQuantity;
      const appliedPrice = isBulkApplied ? product.bulkDealPrice : product.price;
      
      return { 
        ...product, 
        orderQty: qty, 
        appliedPrice: appliedPrice,
        lineTotal: appliedPrice * qty 
      };
    }).filter(Boolean);
  }, [cart, products]);

  const cartTotals = useMemo(() => {
    let items = 0, cost = 0;
    cartItemsList.forEach(item => {
      items += 1;
      cost += item.lineTotal;
    });
    return { items, cost };
  }, [cartItemsList]);

  const handleConfirmOrderPlacement = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    try {
      const orderItems = cartItemsList.map(item => ({
        productId: item.id,
        quantity: item.orderQty
      }));
      await orderApi.placeOrder({ businessProfileId: businessProfileId, items: orderItems });
      setCart({});
      setShowPlaceOrderConfirmModal(false);
      setShowCheckoutModal(false);
      navigate('/orders');
    } catch (error) {
      alert(`Failed to place order: ${error.response?.data?.message || 'Please check your connection and try again.'}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoadingProfile) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>;
  if (!profile) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] font-bold text-black">Supplier Not Found</div>;

  const firstLetter = profile.businessName ? profile.businessName.charAt(0).toUpperCase() : 'S';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        /* Hide arrows on number input for clean manual typing */
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}} />
      <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] text-[#0F1626] pb-32">
        
        {/* Top Navbar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => navigate('/nearbyseller')} className="flex items-center gap-1.5 text-[14px] font-bold text-slate-600 hover:text-black transition-colors">
              <ChevronLeft size={18} strokeWidth={2.5} /> Back to Network
            </button>
            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
              <ShieldCheck size={16} className="text-pink-500" /> Verified {profile.businessType || 'Partner'}
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 pt-8 flex flex-col gap-6">
          
          {/* Enhanced Premium Header Card */}
          <section className="bg-white border border-slate-200 rounded-[24px] shadow-sm p-8 pb-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(236,72,153,0.04),transparent_60%)] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative z-10">
              <div className="flex gap-6 items-center md:items-start">
                
                {/* Initial Logo (Black Theme) */}
                <div className="flex items-center justify-center w-[100px] h-[100px] bg-black rounded-[24px] text-white flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.12)] border border-slate-800">
                  <span className="font-['Manrope',_sans-serif] text-[44px] font-extrabold tracking-tighter">{firstLetter}</span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-['Manrope',_sans-serif] text-[32px] font-extrabold text-black leading-none tracking-tight">
                    {profile.businessName}
                  </h1>
                  <p className="text-[14px] font-semibold text-slate-500 tracking-wide">Operated by {profile.ownerName}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {/* Market Rank */}
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                      <TrendingUp size={14} className="text-pink-500" />
                      <span className="text-[12px] font-bold text-slate-800">Rank #{profile.marketplaceRank || 'N/A'}</span>
                    </div>
                    {/* Trust Score */}
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                      <Award size={14} className="text-black" />
                      <span className="text-[12px] font-bold text-slate-800">Trust Score {profile.trustScore || 'N/A'}/100</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                      <MapPin size={14} className="text-slate-400" /> {profile.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Black) */}
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 bg-white border border-slate-200 text-[13px] font-bold text-black rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-2">
                  <MessageCircle size={16} /> Message
                </button>
                <button className="px-6 py-2.5 bg-black text-white text-[13px] font-bold rounded-xl hover:bg-slate-800 shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2">
                  <Phone size={16} /> Call Now
                </button>
              </div>
            </div>

            <div className="flex items-center gap-8 border-t border-slate-100 pt-4 relative z-10">
              <button onClick={() => setActiveTab('catalog')} className={`pb-4 text-[14px] font-bold transition-all border-b-[3px] ${activeTab === 'catalog' ? 'text-black border-black' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>
                Order Catalog
              </button>
              <button onClick={() => setActiveTab('profile')} className={`pb-4 text-[14px] font-bold transition-all border-b-[3px] ${activeTab === 'profile' ? 'text-black border-black' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>
                Business Details
              </button>
              <button onClick={() => setActiveTab('delivery')} className={`pb-4 text-[14px] font-bold transition-all border-b-[3px] ${activeTab === 'delivery' ? 'text-black border-black' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>
                Delivery & Terms
              </button>
            </div>
          </section>

          {/* TAB 1: CATALOG (7 Columns & Manual Input) */}
          {activeTab === 'catalog' && (
            <div className="flex flex-col gap-5 animate-[fadeUp_0.3s_ease-out_both]">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-[16px] shadow-sm">
                <div className="relative flex items-center w-full md:w-[400px] bg-slate-50 border border-slate-200 rounded-xl focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/10 transition-all shadow-sm">
                  <Search className="absolute left-3.5 text-slate-400" size={16} />
                  <input type="text" className="w-full py-2.5 pl-10 pr-4 bg-transparent text-[13px] font-medium outline-none placeholder:text-slate-400" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative inline-flex items-center">
                    <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold py-2.5 pl-3.5 pr-9 rounded-xl outline-none cursor-pointer hover:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" value={filters.category} onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}>
                      <option value="all">All Categories</option>
                      {filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  <div className="relative inline-flex items-center">
                    <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold py-2.5 pl-3.5 pr-9 rounded-xl outline-none cursor-pointer hover:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/10" value={filters.brand} onChange={(e) => setFilters(prev => ({...prev, brand: e.target.value}))}>
                      <option value="all">All Brands</option>
                      {filterOptions.brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearchTerm(''); }} className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[16px] shadow-sm overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[1100px]">
                    {/* 7 Column Layout */}
                    <div className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-[11px] font-bold tracking-widest uppercase text-slate-500">
                      <span>Product Info</span>
                      <span>Brand</span>
                      <span>Base Price</span>
                      <span>Rules</span>
                      <span className="text-center">Stock</span>
                      <span className="text-center">Order Quantity</span>
                      <span className="text-right">Line Total</span>
                    </div>
                    
                    {isLoadingProducts ? (
                      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-black" /></div>
                    ) : products.length === 0 ? (
                      <div className="flex flex-col items-center py-16 text-slate-400"><PackageSearch size={32} className="mb-2"/><p className="text-sm font-medium">No products found</p></div>
                    ) : (
                      <div className="flex flex-col">
                        {products.map((product) => {
                          const currentQty = cart[product.id] || 0;
                          const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
                          const displayPrice = isBulkApplied ? product.bulkDealPrice : product.price;

                          return (
                            <div key={product.id} className={`grid grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr_1.5fr_1.2fr] gap-4 items-center px-6 py-5 border-b border-slate-100 ${currentQty > 0 ? 'bg-slate-50/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                              
                              {/* 1. Product Name & Category */}
                              <div className="flex flex-col gap-1 pr-2 overflow-hidden">
                                <span className="font-['Manrope',_sans-serif] text-[15px] font-bold text-black truncate" title={product.productName}>{product.productName}</span>
                                <span className="text-[12px] font-medium text-slate-500 truncate">{product.category}</span>
                              </div>

                              {/* 2. Brand */}
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-slate-700">{product.brand}</span>
                              </div>

                              {/* 3. Base Price */}
                              <div className="flex flex-col">
                                <span className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-black">₹{product.price.toLocaleString('en-IN')}</span>
                                <span className="text-[11px] font-semibold text-slate-400">/{product.unit}</span>
                              </div>

                              {/* 4. Rules */}
                              <div className="flex flex-col items-start gap-1.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                                  Min: {product.minimumOrderQuantity} {product.unit}
                                </span>
                                {product.bulkDealQuantity && product.bulkDealPrice && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${isBulkApplied ? 'bg-pink-50 text-pink-700 border-pink-200 shadow-sm' : 'bg-white text-slate-600 border-slate-200'}`}>
                                    Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>

                              {/* 5. Stock Availability */}
                              <div className="flex flex-col items-center justify-center gap-1">
                                <span className="text-[14px] font-extrabold text-black">{product.availableStock}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Available</span>
                              </div>

                              {/* 6. Manually Typable Order Quantity */}
                              <div className="flex justify-center">
                                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-10 w-[130px] shadow-sm focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 transition-all">
                                  <button onClick={() => handleDecrement(product)} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-pink-600 transition-colors"><Minus size={14} /></button>
                                  <input 
                                    type="number"
                                    value={currentQty === 0 ? '' : currentQty}
                                    onChange={(e) => handleManualQuantity(product, e.target.value)}
                                    onBlur={(e) => handleQuantityBlur(product, e.target.value)}
                                    placeholder="0"
                                    className="flex-1 w-full h-full text-center bg-slate-50 text-[14px] font-bold text-black border-x border-slate-200 outline-none p-0 m-0"
                                  />
                                  <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-pink-600 transition-colors disabled:opacity-30"><Plus size={14} /></button>
                                </div>
                              </div>

                              {/* 7. Line Total */}
                              <div className="flex flex-col items-end pr-2">
                                <span className={`font-['Manrope',_sans-serif] text-[18px] font-extrabold ${currentQty > 0 ? 'text-black' : 'text-slate-300'}`}>
                                  ₹{(currentQty * displayPrice).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESS DETAILS */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeUp_0.3s_ease-out_both]">
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-[20px] p-8 shadow-sm">
                  <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-black mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-slate-400" /> About the Company
                  </h3>
                  <p className="text-[14px] leading-relaxed text-slate-600 font-medium">
                    {profile.businessDescription || "Detailed business description is pending. This is a registered partner on the StockLinker network."}
                  </p>
                  
                  {/* Fetched Categories Display */}
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h4 className="text-[12px] font-bold uppercase text-slate-400 tracking-wider mb-3">Primary Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.categoryIds ? profile.categoryIds.split(',').map((cat, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold rounded-lg shadow-sm">
                          {cat.trim()}
                        </span>
                      )) : <span className="text-slate-500 text-[13px]">Categories not specified</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-black border border-slate-200 rounded-full flex items-center justify-center shrink-0">
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <span className="font-['Manrope',_sans-serif] text-[24px] font-extrabold text-black">{profile.yearsInBusiness || '< 1'}</span>
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">Years in Business</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 text-black border border-slate-200 rounded-full flex items-center justify-center shrink-0">
                      <PackageCheck size={22} />
                    </div>
                    <div>
                      <span className="font-['Manrope',_sans-serif] text-[24px] font-extrabold text-black">{profile.totalOrdersFulfilled || '0'}</span>
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">Orders Fulfilled</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm">
                  <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-black mb-5 border-b border-slate-100 pb-3">
                    Contact Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Phone</p>
                        <p className="text-[14px] font-bold text-black">{profile.mobileNumber || 'Not available'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={18} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Email</p>
                        <p className="text-[14px] font-bold text-black truncate">{profile.businessEmail || 'Not available'}</p>
                      </div>
                    </div>
                    {profile.website && (
                      <div className="flex items-start gap-3">
                        <Globe size={18} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Website</p>
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-[14px] font-bold text-pink-600 hover:underline truncate block">
                            {profile.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm">
                  <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-black mb-5 border-b border-slate-100 pb-3">
                    Operations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck size={18} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">GSTIN / Tax ID</p>
                        <p className="text-[13px] font-bold text-black font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                          {profile.gstNumber || 'Pending Verification'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Operating Hours</p>
                        <p className="text-[14px] font-bold text-black mt-1">
                          {profile.openingTime && profile.closingTime 
                            ? `${formatTime(profile.openingTime)} - ${formatTime(profile.closingTime)}` 
                            : 'Standard Hours'}
                        </p>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5">{profile.operatingDays || 'Mon - Sat'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DELIVERY & TERMS */}
          {activeTab === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeUp_0.3s_ease-out_both]">
              <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-5">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-sm">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-black leading-tight">
                      Fulfillment Capabilities
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500">Logistics configuration for B2B orders.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5 flex-1">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-[14px] font-bold text-black">Direct Delivery</span>
                    <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold tracking-widest uppercase ${profile.deliverySupported ? 'bg-black text-white shadow-sm' : 'bg-slate-200 text-slate-600 border border-slate-300'}`}>
                      {profile.deliverySupported ? 'Available' : 'Store Pickup Only'}
                    </span>
                  </div>
                  
                  {profile.deliverySupported ? (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Service Radius</span>
                        <span className="text-[15px] font-extrabold text-black">{profile.coverageRadiusKm ? `${profile.coverageRadiusKm} Kilometers` : 'Local Area'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Min. Order Value</span>
                        <span className="text-[15px] font-extrabold text-black">{profile.minimumOrderValue ? `₹${profile.minimumOrderValue.toLocaleString('en-IN')}` : 'No Minimum'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Delivery Fee</span>
                        <span className="text-[15px] font-extrabold text-black">
                          {profile.deliveryCharge ? `₹${profile.deliveryCharge.toLocaleString('en-IN')}` : 'Free Delivery'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50 mt-2">
                      <MapPin size={24} className="text-slate-400 mb-2" />
                      <p className="text-[14px] font-bold text-black">Buyer Pickup Required</p>
                      <p className="text-[13px] font-medium text-slate-500 mt-1 max-w-[250px]">This wholesaler requires you to arrange logistics for order pickup.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-5">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-black leading-tight">
                      Dispatch Center
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500">Registered warehouse / store address.</p>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(0,0,0,0.04),transparent_70%)] -mr-10 -mt-10 pointer-events-none" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-black shrink-0">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Registered Address</p>
                      <p className="text-[15px] font-bold text-black leading-relaxed pr-4">
                        {profile.fullAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Cart Bar (Black Theme) */}
        {cartTotals.items > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-black border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] z-50 animate-[fadeUp_0.3s_ease-out_both]">
            <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative"><ShoppingCart size={24} /><span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">{cartTotals.items}</span></div>
                  <div className="hidden sm:flex flex-col"><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Cart</span><span className="text-sm font-bold truncate max-w-[200px]">{profile.businessName}</span></div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex flex-col"><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Total Value</span><span className="font-['Manrope',_sans-serif] text-2xl font-extrabold">₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
              </div>
              <button onClick={() => setShowCheckoutModal(true)} className="px-8 py-3 bg-white text-[14px] font-bold text-black rounded-xl hover:bg-slate-200 active:scale-95 flex items-center gap-2 shadow-lg transition-all duration-200">
                Review & Checkout
              </button>
            </div>
          </div>
        )}

        {/* MODALS */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="font-['Manrope',_sans-serif] text-xl font-extrabold text-black">Order Summary Review</h3>
                <button onClick={() => setShowCancelConfirmModal(true)} className="p-1 text-slate-400 hover:text-black rounded-lg transition-colors"><X size={20}/></button>
              </div>

              <div className="overflow-y-auto flex-1 pr-2 space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-extrabold font-['Manrope',_sans-serif]">{firstLetter}</div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Wholesaler Partner</p>
                    <p className="text-base font-extrabold text-black">{profile.businessName}</p>
                  </div>
                </div>

                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Items Manifest</p>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {cartItemsList.map(item => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-black">{item.productName}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.orderQty} {item.unit} × ₹{item.appliedPrice.toLocaleString('en-IN')}
                          {item.appliedPrice < item.price && (
                            <span className="text-[10px] text-pink-600 font-bold ml-2 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">Bulk Deal Applied</span>
                          )}
                        </p>
                      </div>
                      <p className="text-sm font-extrabold text-black">₹{item.lineTotal.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 mt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-600"><span>Subtotal</span><span>₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600"><span>Estimated Tax</span><span>₹0</span></div>
                  <div className="flex justify-between text-base font-extrabold text-black border-t border-slate-200 pt-2 mt-1"><span>Total Payable</span><span>₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100 mt-4">
                <button onClick={() => setShowCancelConfirmModal(true)} className="flex-1 py-3 bg-white border border-slate-200 text-black font-bold text-sm rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm active:scale-95">
                  Cancel Request
                </button>
                <button onClick={() => setShowPlaceOrderConfirmModal(true)} className="flex-1 py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-md active:scale-95">
                  Send Order Request
                </button>
              </div>
            </div>
          </div>
        )}

        {showCancelConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-black rounded-2xl flex items-center justify-center mx-auto border border-slate-200"><AlertCircle size={24}/></div>
              <h4 className="text-lg font-bold text-black">Discard Order Request?</h4>
              <p className="text-xs text-slate-500">Are you sure you want to cancel? All selected order items will be cleared from your cart.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCancelConfirmModal(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-black font-bold text-[13px] rounded-xl hover:bg-slate-50 transition-all active:scale-95">No, Continue</button>
                <button onClick={() => { setCart({}); setShowCancelConfirmModal(false); setShowCheckoutModal(false); }} className="flex-1 py-2.5 bg-black text-white font-bold text-[13px] rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95">Yes, Cancel Order</button>
              </div>
            </div>
          </div>
        )}

        {showPlaceOrderConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm"><CheckCircle2 size={24}/></div>
              <h4 className="text-lg font-bold text-black">Confirm Dispatch?</h4>
              <p className="text-xs text-slate-500">Your order request will be sent to <b>{profile.businessName}</b> for verification and scheduling.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPlaceOrderConfirmModal(false)} className="flex-1 py-2.5 bg-white border border-slate-200 text-black font-bold text-[13px] rounded-xl hover:bg-slate-50 transition-all active:scale-95">Back to Review</button>
                <button onClick={handleConfirmOrderPlacement} disabled={isPlacingOrder} className="flex-1 py-2.5 bg-black text-white font-bold text-[13px] rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
                  {isPlacingOrder && <Loader2 size={14} className="animate-spin"/>} Confirm & Send
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
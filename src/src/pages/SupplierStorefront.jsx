import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, Star, MapPin, Search, Minus, Plus, ShoppingCart, ShieldCheck, Truck, ChevronLeft, Info, PackageSearch, RotateCcw, ChevronDown, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { storefrontApi, orderApi } from '../../Authentication/services/api';

const DEFAULT_FILTERS = { category: 'all', brand: 'all', sortPrice: 'none' };

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

  // Safeguard Confirmation Modals
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

  const updateQuantity = (product, newQty) => {
    setCart(prev => {
      const updated = { ...prev };
      if (newQty <= 0) {
        delete updated[product.id];
        return updated;
      }
      updated[product.id] = Math.max(product.minimumOrderQuantity, Math.min(newQty, product.availableStock));
      return updated;
    });
  };

  const handleIncrement = (p) => updateQuantity(p, (cart[p.id] || 0) === 0 ? p.minimumOrderQuantity : (cart[p.id] || 0) + 1);
  const handleDecrement = (p) => updateQuantity(p, ((cart[p.id] || 0) - 1) < p.minimumOrderQuantity ? 0 : (cart[p.id] || 0) - 1);

  // Dynamic cart calculations handling Bulk Deals
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

      await orderApi.placeOrder({
        businessProfileId: businessProfileId,
        items: orderItems
      });

      setCart({});
      setShowPlaceOrderConfirmModal(false);
      setShowCheckoutModal(false);
      navigate('/orders');
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(`Failed to place order: ${error.response?.data?.message || 'Please check your connection and try again.'}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoadingProfile) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]"><Loader2 className="w-10 h-10 animate-spin text-slate-900" /></div>;
  if (!profile) return <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] font-bold text-slate-900">Supplier Not Found</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}} />
      <div className="min-h-screen bg-[#F8FAFC] font-['Inter',_sans-serif] text-[#0F1626] pb-32">
        
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => navigate('/nearbyseller')} className="flex items-center gap-1.5 text-[14px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
              <ChevronLeft size={18} strokeWidth={2.5} /> Back to Network
            </button>
            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              <ShieldCheck size={16} className="text-[#17B26A]" /> Verified Wholesale Partner
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 pt-8 flex flex-col gap-6">
          <section className="bg-white border border-slate-200 rounded-[20px] shadow-sm p-8 pb-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div className="flex gap-5 items-center md:items-start">
                <div className="flex items-center justify-center w-20 h-20 bg-slate-50 border border-slate-200 rounded-[16px] text-slate-400 flex-shrink-0 shadow-sm">
                  <Store size={32} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h1 className="font-['Manrope',_sans-serif] text-[28px] font-extrabold text-[#0F1626] leading-none tracking-tight">
                    {profile.businessName}
                  </h1>
                  <p className="text-[13px] font-medium text-slate-500">Operated by {profile.ownerName}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 bg-[#FFFBEB] px-2 py-0.5 rounded-md border border-[#FEF0C7]">
                      <Star size={12} className="text-[#F79009] fill-[#F79009]" />
                      <span className="text-[11px] font-bold text-[#B54708]">{profile.rating} <span className="font-medium opacity-80">({profile.reviewCount})</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      <MapPin size={12} className="text-slate-400" /> {profile.location}
                    </div>
                  </div>
                </div>
              </div>
              <button className="px-5 py-2 bg-white border border-slate-200 text-[13px] font-bold text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-95">
                Message Supplier
              </button>
            </div>

            <div className="flex items-center gap-8 border-t border-slate-100 pt-4">
              <button onClick={() => setActiveTab('catalog')} className={`pb-4 text-[14px] font-bold transition-all border-b-[3px] ${activeTab === 'catalog' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                Order Catalog
              </button>
              <button onClick={() => setActiveTab('profile')} className={`pb-4 text-[14px] font-bold transition-all border-b-[3px] ${activeTab === 'profile' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                Business Profile
              </button>
              <button onClick={() => setActiveTab('delivery')} className={`pb-4 text-[14px] font-bold transition-all border-b-[3px] ${activeTab === 'delivery' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                Delivery & Terms
              </button>
            </div>
          </section>

          {activeTab === 'catalog' && (
            <div className="flex flex-col gap-5 animate-[fadeUp_0.3s_ease-out_both]">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-[16px] shadow-sm">
                <div className="relative flex items-center w-full md:w-[400px] bg-slate-50 border border-slate-200 rounded-xl focus-within:border-slate-900 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  <Search className="absolute left-3.5 text-slate-400" size={16} />
                  <input type="text" className="w-full py-2.5 pl-10 pr-4 bg-transparent text-[13px] font-medium outline-none placeholder:text-slate-400" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative inline-flex items-center">
                    <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold py-2.5 pl-3.5 pr-9 rounded-xl outline-none cursor-pointer hover:bg-white focus:border-slate-900" value={filters.category} onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}>
                      <option value="all">All Categories</option>
                      {filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={14} />
                  </div>
                  <div className="relative inline-flex items-center">
                    <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-bold py-2.5 pl-3.5 pr-9 rounded-xl outline-none cursor-pointer hover:bg-white focus:border-slate-900" value={filters.brand} onChange={(e) => setFilters(prev => ({...prev, brand: e.target.value}))}>
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
                  <div className="min-w-[1000px]">
                    <div className="grid grid-cols-[2.5fr_1fr_1.5fr_1fr_1.5fr_1.5fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-[11px] font-bold tracking-widest uppercase text-slate-500">
                      <span>Product Information</span><span>Price</span><span>Rules</span><span className="text-center">Order Quantity</span><span className="text-right">Line Total</span>
                    </div>
                    {isLoadingProducts ? (
                      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-slate-900" /></div>
                    ) : products.length === 0 ? (
                      <div className="flex flex-col items-center py-16 text-slate-400"><PackageSearch size={32} className="mb-2"/><p className="text-sm font-medium">No products found</p></div>
                    ) : (
                      <div className="flex flex-col">
                        {products.map((product) => {
                          const currentQty = cart[product.id] || 0;
                          const isBulkApplied = product.bulkDealQuantity && currentQty >= product.bulkDealQuantity;
                          const displayPrice = isBulkApplied ? product.bulkDealPrice : product.price;

                          return (
                            <div key={product.id} className={`grid grid-cols-[2.5fr_1fr_1.5fr_1fr_1.5fr_1.5fr] gap-4 items-center px-6 py-4 border-b border-slate-100 ${currentQty > 0 ? 'bg-slate-50/50' : 'hover:bg-slate-50/50'}`}>
                              <div className="flex flex-col gap-1 pr-4">
                                <span className="font-['Manrope',_sans-serif] text-[14px] font-bold text-slate-900">{product.productName}</span>
                                <span className="text-[12px] font-medium text-slate-500">{product.brand} • {product.category}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-[#067647]">₹{displayPrice.toLocaleString('en-IN')}</span>
                                {isBulkApplied ? (
                                  <span className="text-[11px] font-semibold text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-slate-400">/{product.packageSize} {product.unit}</span>
                                )}
                              </div>
                              <div className="flex flex-col items-start gap-1.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200 w-fit">Min: {product.minimumOrderQuantity} {product.unit}</span>
                                {product.bulkDealQuantity && product.bulkDealPrice && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border w-fit ${isBulkApplied ? 'bg-[#ECFDF3] text-[#067647] border-[#DCFAE6]' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                    Bulk: {product.bulkDealQuantity}+ @ ₹{product.bulkDealPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col items-center justify-center gap-1.5">
                                <span className="text-[13px] font-bold text-slate-900">{product.availableStock} <span className="text-[11px] font-medium text-slate-500">In Stock</span></span>
                              </div>
                              <div className="flex justify-center">
                                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-9 w-[110px] shadow-sm">
                                  <button onClick={() => handleDecrement(product)} className="w-9 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50"><Minus size={14} /></button>
                                  <div className="flex-1 h-full flex items-center justify-center bg-slate-50 text-[13px] font-bold text-slate-900 border-x border-slate-200">{currentQty === 0 ? '-' : currentQty}</div>
                                  <button onClick={() => handleIncrement(product)} disabled={currentQty >= product.availableStock} className="w-9 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><Plus size={14} /></button>
                                </div>
                              </div>
                              <div className="flex justify-end pr-2">
                                <span className={`font-['Manrope',_sans-serif] text-[16px] font-extrabold ${currentQty > 0 ? 'text-slate-900' : 'text-slate-300'}`}>₹{(currentQty * displayPrice).toLocaleString('en-IN')}</span>
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

          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeUp_0.3s_ease-out_both]">
              <div className="bg-white border border-slate-200 rounded-[16px] p-6 shadow-sm">
                <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                  <Info size={18} className="text-[#EC4899]" strokeWidth={2.5} /> Company Details
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Legal Name</p>
                    <p className="text-[15px] font-bold text-slate-900">{profile.businessName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Business Type</p>
                    <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">{profile.businessType || 'SHOPKEEPER'}</p>
                  </div>
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400 mb-2">GSTIN / Tax ID</p>
                      <span className="inline-flex text-[13px] font-bold text-[#0F1626] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg tracking-wide shadow-sm">
                        {profile.gstNumber || 'Pending Verification'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400 mb-2">Store Size</p>
                      <span className="inline-flex text-[13px] font-bold text-[#0F1626] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg tracking-wide shadow-sm">
                        {profile.storeSize ? profile.storeSize.replace(/_/g, ' ') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[16px] p-6 shadow-sm">
                <h3 className="font-['Manrope',_sans-serif] text-[16px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin size={18} className="text-[#EC4899]" strokeWidth={2.5} /> Location & Contact
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Registered Address</p>
                    <p className="text-[14px] font-semibold text-slate-900 leading-relaxed">{profile.fullAddress || 'Address not provided'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Mobile</p>
                      <p className="text-[14px] font-bold text-slate-900">{profile.mobileNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">Email</p>
                      <p className="text-[14px] font-bold text-slate-900">{profile.businessEmail || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeUp_0.3s_ease-out_both]">
              <div className="bg-white border border-slate-200 rounded-[16px] p-8 shadow-sm">
                <h3 className="font-['Manrope',_sans-serif] text-[18px] font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                  <Truck size={18} className="text-[#EC4899]" strokeWidth={2.5} /> Logistics & Fulfillment
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    <span className="text-[14px] font-bold text-slate-900">Delivery Support</span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-widest uppercase ${profile.deliverySupported ? 'bg-[#ECFDF3] text-[#067647] border border-[#DCFAE6]' : 'bg-slate-200 text-slate-500'}`}>
                      {profile.deliverySupported ? 'Available' : 'Pickup Only'}
                    </span>
                  </div>
                  
                  {profile.deliverySupported && (
                    <>
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Coverage Radius</span>
                        <span className="text-[14px] font-bold text-slate-900">{profile.coverageRadiusKm ? `${profile.coverageRadiusKm} km` : 'Standard Limits'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Min. Order Value</span>
                        <span className="text-[14px] font-bold text-slate-900">{profile.minimumOrderValue ? `₹${profile.minimumOrderValue.toLocaleString('en-IN')}` : 'No Minimum'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Delivery Charge</span>
                        <span className="text-[14px] font-bold text-emerald-600">{profile.deliveryCharge ? `₹${profile.deliveryCharge.toLocaleString('en-IN')}` : 'Free Delivery'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5">
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Operating Days</span>
                        <span className="text-[14px] font-bold text-slate-900">{profile.operatingDays || 'Mon - Sat'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Cart Bar */}
        {cartTotals.items > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-[#0F1626] border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] z-50 animate-[fadeUp_0.3s_ease-out_both]">
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative"><ShoppingCart size={24} /><span className="absolute -top-2 -right-2 bg-[#EC4899] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900">{cartTotals.items}</span></div>
                  <div className="hidden sm:flex flex-col"><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Cart</span><span className="text-sm font-bold truncate max-w-[200px]">{profile.businessName}</span></div>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div className="flex flex-col"><span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Total Value</span><span className="font-['Manrope',_sans-serif] text-2xl font-extrabold">₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
              </div>
              <button onClick={() => setShowCheckoutModal(true)} className="px-8 py-3 bg-white text-[14px] font-bold text-slate-900 rounded-xl hover:bg-slate-100 active:scale-95 flex items-center gap-2 shadow-lg transition-all">
                Review & Place Order
              </button>
            </div>
          </div>
        )}

        {/* 1. ORDER SUMMARY CHECKOUT MODAL */}
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="font-['Manrope',_sans-serif] text-xl font-extrabold text-slate-900">Order Summary Review</h3>
                <button onClick={() => setShowCancelConfirmModal(true)} className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"><X size={20}/></button>
              </div>

              <div className="overflow-y-auto flex-1 pr-2 space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Wholesaler Partner</p>
                  <p className="text-base font-extrabold text-slate-900">{profile.businessName}</p>
                </div>

                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Items Manifest</p>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {cartItemsList.map(item => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.productName}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {item.orderQty} {item.unit} × ₹{item.appliedPrice.toLocaleString('en-IN')}
                          {item.appliedPrice < item.price && (
                            <span className="text-[10px] text-[#067647] font-bold ml-2">(Bulk Price Applied)</span>
                          )}
                        </p>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">₹{item.lineTotal.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 mt-4">
                  <div className="flex justify-between text-xs font-semibold text-slate-600"><span>Subtotal</span><span>₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600"><span>Estimated Tax</span><span>₹0</span></div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2"><span>Total Payable</span><span>₹{cartTotals.cost.toLocaleString('en-IN')}</span></div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100 mt-4">
                <button onClick={() => setShowCancelConfirmModal(true)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors">
                  Cancel Request
                </button>
                <button onClick={() => setShowPlaceOrderConfirmModal(true)} className="flex-1 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-colors shadow-sm">
                  Send Order Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. CANCEL DOUBLE CONFIRMATION MODAL */}
        {showCancelConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto"><AlertCircle size={24}/></div>
              <h4 className="text-lg font-bold text-slate-900">Discard Order Request?</h4>
              <p className="text-xs text-slate-500">Are you sure you want to cancel? All selected order items will be cleared from your cart.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCancelConfirmModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200">No, Continue Order</button>
                <button onClick={() => { setCart({}); setShowCancelConfirmModal(false); setShowCheckoutModal(false); }} className="flex-1 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700">Yes, Cancel Order</button>
              </div>
            </div>
          </div>
        )}

        {/* 3. PLACE ORDER DOUBLE CONFIRMATION MODAL */}
        {showPlaceOrderConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto"><CheckCircle2 size={24}/></div>
              <h4 className="text-lg font-bold text-slate-900">Confirm Order Dispatch?</h4>
              <p className="text-xs text-slate-500">Your order will be sent to <b>{profile.businessName}</b> for verification and schedule.</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowPlaceOrderConfirmModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200">Back to Review</button>
                <button onClick={handleConfirmOrderPlacement} disabled={isPlacingOrder} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2">
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
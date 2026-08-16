import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 

import { storefrontApi, orderApi, profileApi, networkApi } from '../../auth/services/api';
import { useAuth } from '../../auth/context/AuthContext';
import { PremiumToast } from '../../components/PremiumToast';
import { DataFetchError } from '../../components/DataFetchError';
import { DEFAULT_FILTERS, DEFAULT_DESCRIPTION } from '../utils/constants';

// Modular Imports
import { PremiumStorefrontSkeleton } from '../components/PremiumStorefrontSkeleton';
import { ProfileHeader } from '../components/ProfileHeader';
import { FloatingCartBar } from '../components/FloatingCartBar';
import { CatalogTab } from '../components/tabs/CatalogTab';
import { ProfileTab } from '../components/tabs/ProfileTab';
import { DeliveryTab } from '../components/tabs/DeliveryTab';
import { 
  SubCategoryModal, CheckoutModal, CancelConfirmModal, 
  PlaceOrderConfirmModal, RatingConfirmModal 
} from '../components/StorefrontModals';

export default function SupplierStorefront() {
  const { businessProfileId: rawProfileId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const { profileData } = useAuth();
  
  const [notification, setNotification] = useState(null);
  const showNotification = (type, msg) => setNotification({ type, msg });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState('profile');
  const [cart, setCart] = useState({});
  const [page, setPage] = useState(0);

  // LOGIC FIX: Instantly resolves to 'own' if no ID is present in the URL
  const businessProfileId = (!rawProfileId || rawProfileId === 'undefined' || rawProfileId === 'null') 
    ? 'own' 
    : rawProfileId;

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");
  const [isSavingDesc, setIsSavingDesc] = useState(false);
  
  const [showSubCatModal, setShowSubCatModal] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showRatingConfirm, setShowRatingConfirm] = useState(false);
  const [hasRatedLocally, setHasRatedLocally] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false); // ✅ Added state for Rating submission
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showPlaceOrderConfirmModal, setShowPlaceOrderConfirmModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, filters]);

  // React Query fires IMMEDIATELY now. No waiting!
  const { data: storeData, isLoading: isLoadingProfile, isError: isProfileError, error: profileError, refetch: refetchProfile } = useQuery({
    queryKey: ['storefrontProfile', businessProfileId],
    queryFn: async () => {
      const [profileRes, filtersRes] = await Promise.all([
        storefrontApi.getProfile(businessProfileId),
        storefrontApi.getFilters(businessProfileId)
      ]);
      return { profile: profileRes.data, filterOptions: filtersRes.data };
    },
    enabled: true, 
    staleTime: 5 * 60 * 1000, 
  });

  const profile = storeData?.profile || null;
  const filterOptions = storeData?.filterOptions || { brands: [], categories: [] };
  
  // Dynamically check ownership using the fetched ID or AuthContext
  const isOwner = location.state?.isOwner || (profileData?.businessProfileId === profile?.businessId) || businessProfileId === 'own';
  const isShopkeeper = profile?.businessType?.toLowerCase().includes('shop') || profile?.businessType?.toLowerCase().includes('retail');

  useEffect(() => {
    if (profile) {
      setActiveTab(isShopkeeper ? 'profile' : 'catalog');
      setDescValue(profile.businessDescription || "");
    }
  }, [profile?.businessId, isShopkeeper]);

  const { data: productPageData = { content: [], totalPages: 0 }, isLoading: isLoadingProducts, isError: isProductsError, error: productsError } = useQuery({
    queryKey: ['storefrontProducts', businessProfileId, debouncedSearch, filters.category, filters.brand, filters.sortPrice, page],
    queryFn: async () => {
      const params = { search: debouncedSearch, category: filters.category, brand: filters.brand, sortPrice: filters.sortPrice, page, size: 10 };
      const res = await storefrontApi.getProducts(businessProfileId, params);
      return res.data;
    },
    enabled: !!profile && !isShopkeeper && activeTab === 'catalog',
    keepPreviousData: true,
  });

  const products = productPageData.content || [];
  const totalPages = productPageData.totalPages || 0;

  const handleSaveDescription = async () => {
    if (isSavingDesc) return;
    setIsSavingDesc(true);
    try {
      await profileApi.updateBusiness({ businessDescription: descValue });
      queryClient.setQueryData(['storefrontProfile', businessProfileId], (old) => ({
        ...old, profile: { ...old.profile, businessDescription: descValue }
      }));
      setIsEditingDesc(false);
      showNotification('success', "Description updated successfully!");
    } catch (error) {
      showNotification('error', error.response?.data?.message || "Failed to update description.");
    } finally {
      setIsSavingDesc(false);
    }
  };

  const initiateRating = (rating) => {
    if (profile?.hasRated || hasRatedLocally) return;
    setSelectedRating(rating);
    setShowRatingConfirm(true);
  };

  // ✅ PERFECTED LOGIC: Added loading states for Rating Submission
  const confirmAndSubmitRating = async () => {
    if (isSubmittingRating) return;
    setIsSubmittingRating(true);
    try {
      await storefrontApi.submitRating(businessProfileId, { rating: selectedRating });
      setHasRatedLocally(true);
      queryClient.setQueryData(['storefrontProfile', businessProfileId], (old) => ({
        ...old, profile: { ...old.profile, hasRated: true }
      }));
      setShowRatingConfirm(false);
      showNotification('success', "Rating submitted successfully!");
    } catch (error) {
      showNotification('error', error.response?.data?.message || "Failed to submit rating.");
      setShowRatingConfirm(false);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleConnect = async () => {
    if (isConnecting || !profile) return;
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
      const appliedPrice = (isBulkApplied && product.bulkDealQuantity > 0) ? (product.bulkDealPrice / product.bulkDealQuantity) : product.price;
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
    if (isPlacingOrder || !profile) return;
    setIsPlacingOrder(true);
    try {
      const orderItems = cartItemsList.map(item => ({ productId: item.id, quantity: item.orderQty }));
      // SAFETY FIX: Uses profile.businessId ensuring the true UUID goes to the order API, not "own"
      await orderApi.placeOrder({ businessProfileId: profile.businessId, items: orderItems });
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

  if (isProfileError) {
    return (
      <div className="pt-10 min-h-screen bg-[#FAFAFA]">
        <DataFetchError 
          errorTitle="Failed to Load Storefront"
          errorMessage={profileError?.response?.data?.message || profileError?.message || "An unexpected error occurred."} 
          onRetry={refetchProfile} 
        />
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}} />
      
      <div className="min-h-screen bg-[#FAFAFA] font-['Inter',_sans-serif] text-[#0F1626] pb-40">
        
        <PremiumToast isVisible={!!notification} type={notification?.type || 'info'} message={notification?.msg} onClose={() => setNotification(null)} />

        {isLoadingProfile ? (
          <PremiumStorefrontSkeleton />
        ) : !profile ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <h2 className="font-bold text-xl text-black">Profile Not Found</h2>
            <p className="text-slate-500">It looks like this profile doesn't exist or you haven't onboarded yet.</p>
          </div>
        ) : (
          <>
            <div className="max-w-[1440px] mx-auto flex my-2 flex-col gap-6 md:gap-8">
              
              <ProfileHeader 
                profile={profile} isOwner={isOwner} firstLetter={firstLetter} 
                handleConnect={handleConnect} isConnecting={isConnecting} 
                activeTab={activeTab} setActiveTab={setActiveTab} 
                availableTabs={availableTabs} navigate={navigate} isMobile={isMobile}
              />

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === 'catalog' && (
                    <CatalogTab 
                      searchTerm={searchTerm} setSearchTerm={setSearchTerm} filters={filters} setFilters={setFilters} 
                      filterOptions={filterOptions} isLoadingProducts={isLoadingProducts} isProductsError={isProductsError} 
                      productsError={productsError} products={products} cart={cart} handleDecrement={handleDecrement} 
                      handleIncrement={handleIncrement} handleManualQuantity={handleManualQuantity} 
                      handleQuantityBlur={handleQuantityBlur} totalPages={totalPages} page={page} setPage={setPage}
                    />
                  )}
                  {activeTab === 'profile' && (
                    <ProfileTab 
                      profile={profile} isOwner={isOwner} isEditingDesc={isEditingDesc} setIsEditingDesc={setIsEditingDesc} 
                      descValue={descValue} setDescValue={setDescValue} handleSaveDescription={handleSaveDescription} 
                      isSavingDesc={isSavingDesc} subCategories={subCategories} displayedCats={displayedCats} 
                      extraCount={extraCount} setShowSubCatModal={setShowSubCatModal} hoverRating={hoverRating} 
                      setHoverRating={setHoverRating} initiateRating={initiateRating} hasRatedLocally={hasRatedLocally}
                    />
                  )}
                  {activeTab === 'delivery' && !isShopkeeper && (
                    <DeliveryTab profile={profile} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {!isShopkeeper && (
              <FloatingCartBar cartTotals={cartTotals} setShowCheckoutModal={setShowCheckoutModal} isMobile={isMobile} />
            )}

            <SubCategoryModal show={showSubCatModal} onClose={() => setShowSubCatModal(false)} subCategories={subCategories} />
            
            <CheckoutModal 
              show={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} profile={profile} 
              cartItemsList={cartItemsList} cartTotals={cartTotals} firstLetter={firstLetter} 
              setShowCancelConfirmModal={setShowCancelConfirmModal} handleConfirmOrderPlacement={handleConfirmOrderPlacement} 
              isPlacingOrder={isPlacingOrder}
            />
            
            <CancelConfirmModal show={showCancelConfirmModal} onClose={() => setShowCancelConfirmModal(false)} onConfirm={() => { setCart({}); setShowCancelConfirmModal(false); setShowCheckoutModal(false); }} />
            
            <PlaceOrderConfirmModal show={showPlaceOrderConfirmModal} onClose={() => setShowPlaceOrderConfirmModal(false)} onConfirm={handleConfirmOrderPlacement} profile={profile} isPlacingOrder={isPlacingOrder} />
            
            {/* ✅ PASSED THE NEW isSubmittingRating PROP HERE */}
            <RatingConfirmModal 
              show={showRatingConfirm} onClose={() => setShowRatingConfirm(false)} 
              onConfirm={confirmAndSubmitRating} selectedRating={selectedRating} 
              isSubmittingRating={isSubmittingRating} 
            />
          </>
        )}
      </div>
    </>
  );
}
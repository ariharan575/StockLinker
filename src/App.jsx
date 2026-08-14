import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Global UI States ---
import GlobalNetworkState from './components/GlobalNetworkState'
// --- Context & Route Guards ---
import { AuthProvider, useAuth } from './Authentication/context/AuthContext';
import PrivateRoute from './Authentication/components/PrivateRoute'; 
import PublicRoute from './Authentication/components/PublicRoute'; 
import Documentation from './documentation/Documentation'

// --- Auth Pages ---
import Login from './Authentication/pages/Loginx';
import OAuthSuccess from './Authentication/pages/OAuthSuccess';
import RoleSelectionPage from './Authentication/pages/RoleSelection';
import StockLinkerEnterpriseOnboarding from './onboarding/StockLinkerEnterpriseOnboarding';

// --- Public/Landing Pages ---
import { LandingPage } from './Landing/Pages/LandingPage';

// --- Application Pages ---
import StockLinkerHomepage from './Shopkeeper_Home/pages/StockLinkerHomepage';
import ConnectedSupplierWrapper from './ConnectedNetwork/wrapper/ConnectedSupplierWrapper';
import ProductCategoryWrapper from './ProductCatagories/wrapper/ProductCategoryWrapper';
import OrdersWrapper from './Order/wrapper/OrdersWrapper';
import MessagePageWrapper from './Message/wrapper/MessagePageWrapper';
import NearbySellerWrapper from './NearBy/wrapper/NearbySellerWrapper';
import WholesalerHomePageWrapper from './WholeSaler_Home/pages/WholesalerHomePageWrapper';
import ProductListWrapper from './ProductList/wrapper/ProductListWrapper';
import ComparePageWrapper from './Compare_Price/wrapper/ComparePageWrapper';
import SettingsRouter from './settings/SettingsRouter';
import SellerProfileWrapper from './Seller_Profile/wrapper/SellerProfileWrapper';

import GlobalChatListener from './Message/components/GlobalChatListener'; 
import GlobalOrderListener from './Order/components/GlobalOrderListener'; // Import the new file

// =========================================================
// ✅ DYNAMIC DASHBOARD ROUTER
// =========================================================
const RoleBasedDashboard = () => {
  const { role } = useAuth();
  
  // Render Wholesaler home if role matches, otherwise default to Shopkeeper home
  if (role?.toUpperCase() === 'WHOLESALER') {
    return <WholesalerHomePageWrapper />;
  }
  return <StockLinkerHomepage />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
        {/* ========================================================= */}
        {/* 🌍 WORLD-CLASS GLOBAL NETWORK ERROR STATE OVERLAY */}
        {/* Sits outside the routes so it protects EVERY page globally */}
        {/* ========================================================= */}
        <GlobalNetworkState />
        <GlobalChatListener />
        <GlobalOrderListener />

        <Routes>
          {/* ✅ PUBLIC ROUTES */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* ✅ TRANSITIONAL ROUTE */}
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* ✅ PRIVATE ROUTES */}
          <Route path="/role-selection" element={<PrivateRoute><RoleSelectionPage /></PrivateRoute>} />
          <Route path="/onboarding" element={<PrivateRoute><StockLinkerEnterpriseOnboarding /></PrivateRoute>} />

          {/* ✅ UNIFIED DASHBOARD ROUTE */}
          <Route path="/dashboard" element={<PrivateRoute><RoleBasedDashboard /></PrivateRoute>} />
          
          <Route path="/Compare" element={<PrivateRoute><ComparePageWrapper /></PrivateRoute>} />
          <Route path="/nearby" element={<PrivateRoute><NearbySellerWrapper /></PrivateRoute>} />
          <Route path="/message" element={<PrivateRoute><MessagePageWrapper /></PrivateRoute>} />
          <Route path="/category" element={<PrivateRoute><ProductCategoryWrapper /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrdersWrapper /></PrivateRoute>} />
          <Route path="/saved" element={<PrivateRoute><ConnectedSupplierWrapper /></PrivateRoute>} />
          <Route path="/product" element={<PrivateRoute><ProductListWrapper /></PrivateRoute>} />

          <Route path='/documentation' element={<PublicRoute><Documentation/></PublicRoute>} />
          
          <Route path="/storefront/:businessProfileId" element={<SellerProfileWrapper />} />          
          
          {/* Settings & Profile */}
          <Route path="/settings/:section" element={<PrivateRoute><SettingsRouter /></PrivateRoute>} />

          {/* ✅ FALLBACK ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
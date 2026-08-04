import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Global UI States ---
import GlobalNetworkState from './components/GlobalNetworkState'; // 👈 IMPORT IT HERE (Adjust path if needed)

// --- Context & Route Guards ---
import { AuthProvider, useAuth } from './Authentication/context/AuthContext';
import PrivateRoute from './Authentication/components/PrivateRoute'; 
import PublicRoute from './Authentication/components/PublicRoute'; 

// --- Auth Pages ---
import Login from './Authentication/pages/Loginx';
import OAuthSuccess from './Authentication/pages/OAuthSuccess';
import RoleSelectionPage from './Authentication/pages/RoleSelection';
import StockLinkerEnterpriseOnboarding from './Onboarding/StockLinkerEnterpriseOnboarding';

// --- Public/Landing Pages ---
import { LandingPage } from './Landing/Pages/LandingPage';

// --- Application Pages ---
import StockLinkerHomepage from './Shopkeeper_Home/pages/StockLinkerHomepage';
import ConnectedSupplierWrapper from './BusinessConnection/ConnectedSupplierWrapper';
import ProductCategoryWrapper from './ProductCatagories/ProductCategoryWrapper';
import OrdersWrapper from './Order/OrdersWrapper';
import MessagePageWrapper from './Message/MessagePageWrapper';
import NearbySellerWrapper from './NearBy/NearbySellerWrapper';
import WholesalerHomePageWrapper from './WholeSaler_Home/pages/WholesalerHomePageWrapper';
import ProductListWrapper from './Seller_Profile/ProductListWrapper';
import ComparePageWrapper from './Compare_Price/wrapper/ComparePageWrapper';
import SettingsRouter from './settings/SettingsRouter';
import SellerProfileWrapper from './Seller_Profile/SellerProfileWrapper';

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
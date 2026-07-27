import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Context & Route Guards ---
import { AuthProvider } from './Authentication/context/AuthContext';
import PrivateRoute from './Authentication/components/PrivateRoute'; // Adjust path if needed
import PublicRoute from './Authentication/components/PublicRoute';   // Adjust path if needed

// --- Auth Pages ---
import SaaSAuthUI from './Authentication/pages/Loginx';
import OAuthSuccess from './Authentication/pages/OAuthSuccess';
import RoleSelectionPage from './Authentication/pages/RoleSelection';
import StockLinkerEnterpriseOnboarding from './Onboarding/StockLinkerEnterpriseOnboarding';

// --- Public/Landing Pages ---
import { LandingPage } from './Landing/Pages/LandingPage';

// --- Application Pages ---
import PremiumLanguageSelector from './Components/PremiumLanguageSelector';
import ProfilePage from './Profile/ProfilePage';
import EnterpriseNavbar from './Components/EnterpriseNavbar';
import StockLinkerLanding from './Profile/StockLinkerLanding';
import StockLinkerLandingPage from './Profile/StockLinkerLandingPage';
import StockLinkerHomepage from './Shopkeeper_Home/pages/StockLinkerHomepage';
import SettingsRoute from './Settings/SettingsRoute';
import ConnectedSupplierWrapper from './BusinessConnection/ConnectedSupplierWrapper';
import ProductCategoryWrapper from './ProductCatagories/ProductCategoryWrapper';
import OrdersWrapper from './Order/OrdersWrapper';
import MessagePageWrapper from './Message/MessagePageWrapper';
import NearbySellerWrapper from './NearBy/NearbySellerWrapper';
import DashboardHome from './WholeSaler_Home/pages/DashboardHome';
import ProductListPage from './Seller_Profile/components/ProductListPage';
import NewLanding from './Profile/NewLanding';
import WholesalerHomePageWrapper from './WholeSaler_Home/pages/WholesalerHomePageWrapper'
import ProductListWrapper from './Seller_Profile/ProductListWrapper'
import SupplierStorefront from './Seller_Profile/pages/SupplierStorefront';

import ComparePageWrapper from './Compare_Price/wrapper/ComparePageWrapper';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ========================================================= */}
          {/* ✅ PUBLIC ROUTES (Accessible only if NOT logged in) */}
          {/* ========================================================= */}

          {/* Landing Page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <SaaSAuthUI />
              </PublicRoute>
            }
          />

          {/* ========================================================= */}
          {/* ✅ TRANSITIONAL ROUTE (Unwrapped to allow internal redirect) */}
          {/* ========================================================= */}
          
          <Route path="/oauth-success" element={<OAuthSuccess />} />


          {/* ========================================================= */}
          {/* ✅ PRIVATE ROUTES (Accessible ONLY if logged in) */}
          {/* ========================================================= */}

          {/* Authentication & Onboarding Flows */}
          <Route path="/role-selection" element={<PrivateRoute><RoleSelectionPage /></PrivateRoute>} />
          
          <Route path="/onboarding" element={
             <PrivateRoute>
              <StockLinkerEnterpriseOnboarding />
             </PrivateRoute> 
            } />

          {/* Main Application Routes */}
          <Route path="/dashboard" element={<PrivateRoute><StockLinkerHomepage /></PrivateRoute>} />
          
          <Route path="/Compare" element={<PrivateRoute><ComparePageWrapper /></PrivateRoute>} />
          
          <Route path="/nearby" element={<PrivateRoute><NearbySellerWrapper /></PrivateRoute>} />
          <Route path="/message" element={<PrivateRoute><MessagePageWrapper /></PrivateRoute>} />
          
          {/* ⬇️ THIS IS CORRECT: React Router handles ?id= automatically here */}
          <Route path="/category" element={<PrivateRoute><ProductCategoryWrapper /></PrivateRoute>} />
          
          <Route path="/orders" element={<PrivateRoute><OrdersWrapper /></PrivateRoute>} />
          <Route path="/saved" element={<PrivateRoute><ConnectedSupplierWrapper /></PrivateRoute>} />
          <Route path="/product" element={<PrivateRoute><ProductListWrapper /></PrivateRoute>} />

          <Route path="/storefront/:businessProfileId" element={<SupplierStorefront />} />          
          
          {/* Settings & Profile */}
          <Route path="/settings/:section" element={<PrivateRoute><SettingsRoute /></PrivateRoute>} />
                    
          {/* Miscellaneous Internal Routes */}
          <Route path="/add" element={<PrivateRoute><WholesalerHomePageWrapper /></PrivateRoute>} />


          {/* ========================================================= */}
          {/* ✅ FALLBACK ROUTE */}
          {/* ========================================================= */}

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
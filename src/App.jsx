import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './AuthFolder/context/AuthContext';
import { PrivateRoute, PublicRoute } from './AuthFolder/routes/PrivateRoute';

import SaaSAuthUI from './AuthFolder/pages/Loginx';
import Dashboard from './AuthFolder/pages/Dashboard';
import OAuthSuccess from './AuthFolder/pages/OAuthSuccess';
import RoleSelectionPage from './AuthFolder/pages/RoleSelection';

import PremiumLanguageSelector from './Components/PremiumLanguageSelector';

import StockLinkerSettingsPage from './SettingsFolder/StockLinkerSettingsPage';
import ExampleProfile from './SettingsFolder/ExampleProfile';
import NewProfile from './SettingsFolder/NewProfile';

import ProfilePage from './ProfileFolder/ProfilePage';
import EnterpriseNavbar from './Components/EnterpriseNavbar';

import StockLinkerLanding from './ProfileFolder/StockLinkerLanding';
import StockLinkerLandingPage from './ProfileFolder/StockLinkerLandingPage';

import { LandingPage } from './LandingPageFolder/Pages/LandingPage';

import StockLinkerEnterpriseOnboarding from './OnboardingFolder/StockLinkerEnterpriseOnboarding';

import ComparePage from './ComparePageFolder/ComparePage';

import StockLinkerHomepage from './HomePageFolder/pages/StockLinkerHomepage';
import  NearbySellers  from './NearBySellerFolder/NearbySeller';
import NearbySellerPage from './NearBySellerFolder/NearbySellerPage';

import Message from './MessageFolder/Message'



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ========================================================= */}
          {/* ✅ PUBLIC ROUTES */}
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
        //      <PublicRoute>
                <SaaSAuthUI />
        //      </PublicRoute>
            }
          />

          {/* OAuth Success */}
          <Route
            path="/oauth-success"
            element={
          //    <PublicRoute>
                <OAuthSuccess />
          //    </PublicRoute>
            }
          />

          {/* ========================================================= */}
          {/* ✅ PRIVATE ROUTES */}
          {/* ========================================================= */}

          <Route
            path="/dashboard"
            element={
          //    <PrivateRoute>
                <Dashboard />
        //      </PrivateRoute>
            }
          />

          <Route
            path="/role-selection"
            element={
         //     <PrivateRoute>
                <RoleSelectionPage />
         //     </PrivateRoute>
            }
          />

          <Route
            path="/language"
            element={
         //     <PrivateRoute>
                <PremiumLanguageSelector />
         //     </PrivateRoute>
            }
          />

          <Route
            path="/set"
            element={
          //    <PrivateRoute>
                <StockLinkerSettingsPage />
          //    </PrivateRoute>
            }
          />

          <Route
            path="/sete"
            element={
         //     <PrivateRoute>
                <ExampleProfile />
         //     </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
         //     <PrivateRoute>
                <NewProfile />
         //     </PrivateRoute>
            }
          />

          <Route
            path="/pro"
            element={
          //    <PrivateRoute>
                <ProfilePage />
          //    </PrivateRoute>
            }
          />

          <Route
            path="/sam"
            element={
           //   <PrivateRoute>
                <StockLinkerLanding />
           //   </PrivateRoute>
            }
          />

          <Route
            path="/same"
            element={
             // <PrivateRoute>
                <StockLinkerLandingPage />
           //    </PrivateRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              // <PrivateRoute>
                <StockLinkerEnterpriseOnboarding />
              // </PrivateRoute> 
            }
          />

          <Route path='/dash' element={<StockLinkerHomepage/>}/>
          <Route path='/Compare' element={<ComparePage/>}/> 
          <Route path='/nearby' element={<NearbySellers/>}/>
          <Route path='/message' element={<Message/>}/>
          

          {/* ========================================================= */}
          {/* ✅ UNKNOWN ROUTE */}
          {/* ========================================================= */}

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
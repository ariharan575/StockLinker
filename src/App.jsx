// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// import { AuthProvider } from './Authentication/context/AuthContext';

// import SaaSAuthUI from './Authentication/pages/Loginx';
// import Dashboard from './Authentication/pages/Dashboard';
// import OAuthSuccess from './Authentication/pages/OAuthSuccess';
// import RoleSelectionPage from './Authentication/pages/RoleSelection';

// import PremiumLanguageSelector from './Components/PremiumLanguageSelector';

// import ProfilePage from './Profile/ProfilePage';
// import EnterpriseNavbar from './Components/EnterpriseNavbar';

// import StockLinkerLanding from './Profile/StockLinkerLanding';
// import StockLinkerLandingPage from './Profile/StockLinkerLandingPage';

// import { LandingPage } from './LandingPage/Pages/LandingPage';

// import StockLinkerEnterpriseOnboarding from './Onboarding/StockLinkerEnterpriseOnboarding';

// import ComparePageWrapper from './ComparePage/ComparePageWrapper';

// import StockLinkerHomepage from './HomePage/pages/StockLinkerHomepage';

// import { AccountSection } from './settings/sections/AccountSection';
// import SettingsRoute from './settings/SettingsRoute';
// import ConnectedSupplierWrapper from './Saved Supplier/ConnectedSupplierWrapper';
// import ProductCategoryWrapper from './ProductCatagories/ProductCategoryWrapper';
// import OrdersWrapper from './Order/OrdersWrapper';
// import MessagePageWrapper from './Message/MessagePageWrapper';
// import NearbySellerWrapper from './NearBySeller/NearbySellerWrapper';
// import DashboardHome from './WholeSaler/pages/DashboardHome'
// import ProductListPage from './src/components/ProductListPage';
// import NewLanding from './Profile/NewLanding'




// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>

//           {/* ========================================================= */}
//           {/* ✅ PUBLIC ROUTES */}
//           {/* ========================================================= */}

//           {/* Landing Page */}
//           <Route
//             path="/"
//             element={
//               <PublicRoute>
//                 <LandingPage />
//               </PublicRoute>
//             }
//           />

//           {/* Login Page */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <SaaSAuthUI />
//               </PublicRoute>
//             }
//           />

//           {/* OAuth Success */}
//           <Route
//             path="/oauth-success"
//             element={
//           //    <PublicRoute>
//                 <OAuthSuccess />
//           //    </PublicRoute>
//             }
//           />

//           {/* ========================================================= */}
//           {/* ✅ PRIVATE ROUTES */}
//           {/* ========================================================= */}

//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/role-selection"
//             element={
//               <PrivateRoute>
//                 <RoleSelectionPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/language"
//             element={
//               <PrivateRoute>
//                 <PremiumLanguageSelector />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/pro"
//             element={
//               <PrivateRoute>
//                 <ProfilePage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/sam"
//             element={
//               <PrivateRoute>
//                 <StockLinkerLanding />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/same"
//             element={
//               <PrivateRoute>
//                 <StockLinkerLandingPage />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/onboarding"
//             element={
//               // <PrivateRoute>
//                 <StockLinkerEnterpriseOnboarding />
//               // </PrivateRoute>  
//             }
//           />

//           <Route path='/dash' element={<StockLinkerHomepage/>}/>
//           <Route path='/Compare' element={<ComparePageWrapper/>}/> 
//           <Route path='/nearby' element={<NearbySellerWrapper/>}/>
//           <Route path='/message' element={<MessagePageWrapper/>}/>
//           <Route path='/category' element={<ProductCategoryWrapper/>}/>
//           <Route path='/orders' element={<OrdersWrapper/>}/>
//           <Route path='/saved' element={<ConnectedSupplierWrapper/>}/>
//           <Route path="/settings/:section" element={<SettingsRoute />} />
//           <Route path="/ex" element={<DashboardHome />} />
//           <Route path="/product" element={<ProductListPage />} />
//           <Route path="/landing" element={<NewLanding />} />
//         {/* <Route path='/productlist' element={<ProductListPage/>}/> */}
        



//           {/* ========================================================= */}
//           {/* ✅ UNKNOWN ROUTE */}
//           {/* ========================================================= */}

//           <Route path="*" element={<Navigate to="/" replace />} />

//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Context & Route Guards ---
import { AuthProvider } from './Authentication/context/AuthContext';
import PrivateRoute from './Authentication/components/PrivateRoute'; // Adjust path if needed
import PublicRoute from './Authentication/components/PublicRoute';   // Adjust path if needed

// --- Auth Pages ---
import SaaSAuthUI from './Authentication/pages/Loginx';
import Dashboard from './Authentication/pages/Dashboard';
import OAuthSuccess from './Authentication/pages/OAuthSuccess';
import RoleSelectionPage from './Authentication/pages/RoleSelection';
import StockLinkerEnterpriseOnboarding from './Onboarding/StockLinkerEnterpriseOnboarding';

// --- Public/Landing Pages ---
import { LandingPage } from './LandingPage/Pages/LandingPage';

// --- Application Pages ---
import PremiumLanguageSelector from './Components/PremiumLanguageSelector';
import ProfilePage from './Profile/ProfilePage';
import EnterpriseNavbar from './Components/EnterpriseNavbar';
import StockLinkerLanding from './Profile/StockLinkerLanding';
import StockLinkerLandingPage from './Profile/StockLinkerLandingPage';
import ComparePageWrapper from './ComparePage/ComparePageWrapper';
import StockLinkerHomepage from './HomePage/pages/StockLinkerHomepage';
import { AccountSection } from './settings/sections/AccountSection';
import SettingsRoute from './settings/SettingsRoute';
import ConnectedSupplierWrapper from './Saved Supplier/ConnectedSupplierWrapper';
import ProductCategoryWrapper from './ProductCatagories/ProductCategoryWrapper';
import OrdersWrapper from './Order/OrdersWrapper';
import MessagePageWrapper from './Message/MessagePageWrapper';
import NearbySellerWrapper from './NearBySeller/NearbySellerWrapper';
import DashboardHome from './WholeSaler/pages/DashboardHome';
import ProductListPage from './src/components/ProductListPage';
import NewLanding from './Profile/NewLanding';


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
          <Route path="/onboarding" element={<PrivateRoute><StockLinkerEnterpriseOnboarding /></PrivateRoute>} />

          {/* Main Application Routes */}
          <Route path="/dashboard" element={<PrivateRoute><StockLinkerHomepage /></PrivateRoute>} />
          
          {/* Features & Modules */}
          <Route path="/Compare" element={<PrivateRoute><ComparePageWrapper /></PrivateRoute>} />
          <Route path="/nearby" element={<PrivateRoute><NearbySellerWrapper /></PrivateRoute>} />
          <Route path="/message" element={<PrivateRoute><MessagePageWrapper /></PrivateRoute>} />
          <Route path="/category" element={<PrivateRoute><ProductCategoryWrapper /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrdersWrapper /></PrivateRoute>} />
          <Route path="/saved" element={<PrivateRoute><ConnectedSupplierWrapper /></PrivateRoute>} />
          <Route path="/product" element={<PrivateRoute><ProductListPage /></PrivateRoute>} />
          <Route path="/language" element={<PrivateRoute><PremiumLanguageSelector /></PrivateRoute>} />
          
          {/* Settings & Profile */}
          <Route path="/settings/:section" element={<PrivateRoute><SettingsRoute /></PrivateRoute>} />
          <Route path="/pro" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          
          {/* Miscellaneous Internal Routes */}
          <Route path="/ex" element={<PrivateRoute><DashboardHome /></PrivateRoute>} />
          <Route path="/sam" element={<PrivateRoute><StockLinkerLanding /></PrivateRoute>} />
          <Route path="/same" element={<PrivateRoute><StockLinkerLandingPage /></PrivateRoute>} />
          <Route path="/landing" element={<PrivateRoute><NewLanding /></PrivateRoute>} />


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
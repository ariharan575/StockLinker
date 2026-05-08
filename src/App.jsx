import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthFolder/context/AuthContext';
import { PrivateRoute, PublicRoute } from './AuthFolder/components/PrivateRoute';
import SaaSAuthUI from './AuthFolder/pages/Loginx';
import Dashboard from './AuthFolder/pages/Dashboard';
import OAuthSuccess from './AuthFolder/pages/OAuthSuccess';
import RoleSelectionPage from './AuthFolder/pages/RoleSelection';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <SaaSAuthUI />
            </PublicRoute>
          } />
          <Route path="/role-selection" element={
            <PrivateRoute>
              <RoleSelectionPage/>
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path='/oauth-success' element={
              <OAuthSuccess/>
            }/>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
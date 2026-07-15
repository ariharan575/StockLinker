import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Loader2, Sparkles, Building, LayoutDashboard, Globe, MessageSquare, Settings, Home, Users } from 'lucide-react';

export default function Dashboard() {
  const { user, logout, logoutAll, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.role === null || user.role === undefined) && user.provider !== 'GUEST') {
      navigate('/role-selection');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLogoutAll = async () => {
    await logoutAll();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Home className="text-pink-500 mr-2" size={24} />
              <h1 className="text-xl font-bold text-pink-600">StockLinker</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogoutAll}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Users size={18} />
                Logout All
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard!</h2>
            <div className="space-y-2">
              <p className="text-gray-600"><strong>User ID:</strong> {user?.userId}</p>
              <p className="text-gray-600"><strong>Roles:</strong> {user?.roleName || 'None'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
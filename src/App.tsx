import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BulkLike from './pages/BulkLike';
import BulkComment from './pages/BulkComment';
import BulkFollow from './pages/BulkFollow';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

// Placeholder components for other routes
const AccountManager = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Manager</h1>
    <p className="text-gray-600">Manage your IMVU accounts - Coming Soon</p>
  </div>
);

const Analytics = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h1>
    <p className="text-gray-600">View detailed analytics and reports - Coming Soon</p>
  </div>
);

const ActivityLog = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Activity Log</h1>
    <p className="text-gray-600">View recent automation activities - Coming Soon</p>
  </div>
);

const Settings = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
    <p className="text-gray-600">Configure automation settings - Coming Soon</p>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Main Application Routes - Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services/bulk-like" element={<BulkLike />} />
            <Route path="services/bulk-comment" element={<BulkComment />} />
            <Route path="services/bulk-follow" element={<BulkFollow />} />
            <Route path="accounts" element={<AccountManager />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

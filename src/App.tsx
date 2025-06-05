import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BulkLike from './pages/BulkLike';
import BulkComment from './pages/BulkComment';
import BulkFollow from './pages/BulkFollow';
import Plans from './pages/Plans';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Main Application Routes - Now Open to All Users */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services/bulk-like" element={<BulkLike />} />
            <Route path="services/bulk-comment" element={<BulkComment />} />
            <Route path="services/bulk-follow" element={<BulkFollow />} />
            <Route path="accounts" element={<AccountManager />} />
            <Route path="plans" element={<Plans />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

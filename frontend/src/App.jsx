import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerMenu from './pages/owner/Menu';
import OwnerOrders from './pages/owner/Orders';
import CustomerMenu from './pages/customer/Menu';
import CustomerOrders from './pages/customer/Orders';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Customer Routes */}
              <Route path="/customer" element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/customer/menu" element={
                <ProtectedRoute role="customer">
                  <CustomerMenu />
                </ProtectedRoute>
              } />
              <Route path="/customer/orders" element={
                <ProtectedRoute role="customer">
                  <CustomerOrders />
                </ProtectedRoute>
              } />
              
              {/* Owner Routes */}
              <Route path="/owner" element={
                <ProtectedRoute role="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/owner/menu" element={
                <ProtectedRoute role="owner">
                  <OwnerMenu />
                </ProtectedRoute>
              } />
              <Route path="/owner/orders" element={
                <ProtectedRoute role="owner">
                  <OwnerOrders />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { FaShoppingBag, FaUtensils, FaClock } from 'react-icons/fa';

const CustomerDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    menuItems: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRes = await axios.get('http://localhost:8000/api/v1/orders/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const menuRes = await axios.get('http://localhost:8000/api/v1/menu/me');
        
        setStats({
          totalOrders: ordersRes.data.count,
          pendingOrders: ordersRes.data.data.filter(o => o.status === 'created').length,
          menuItems: menuRes.data.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, [token]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Customer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
              </div>
              <FaShoppingBag className="text-4xl text-blue-200" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <FaClock className="text-4xl text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Menu Items</p>
                <p className="text-3xl font-bold text-green-600">{stats.menuItems}</p>
              </div>
              <FaUtensils className="text-4xl text-green-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/customer/menu" className="block">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-2">Browse Menu</h2>
              <p>Explore our delicious food items and place your order</p>
            </div>
          </Link>
          
          <Link to="/customer/orders" className="block">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-2">My Orders</h2>
              <p>Track your orders and view order history</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
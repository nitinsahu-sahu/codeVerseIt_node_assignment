import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { FaShoppingBag, FaUtensils, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const OwnerDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    menuItems: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRes = await axios.get('http://localhost:8000/api/v1/orders/restaurant', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const menuRes = await axios.get('http://localhost:8000/api/v1/menu/me');
        
        const orders = ordersRes.data.data;
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'created').length,
          acceptedOrders: orders.filter(o => o.status === 'accepted').length,
          deliveredOrders: orders.filter(o => o.status === 'delivered').length,
          cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
          menuItems: menuRes.data.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, [token]);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: FaShoppingBag, color: 'blue' },
    { label: 'Pending', value: stats.pendingOrders, icon: FaClock, color: 'yellow' },
    { label: 'Accepted', value: stats.acceptedOrders, icon: FaCheckCircle, color: 'green' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: FaCheckCircle, color: 'green' },
    { label: 'Cancelled', value: stats.cancelledOrders, icon: FaTimesCircle, color: 'red' },
    { label: 'Menu Items', value: stats.menuItems, icon: FaUtensils, color: 'purple' },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurant Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
                <stat.icon className={`text-4xl text-${stat.color}-200`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/owner/menu" className="block">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-2">Manage Menu</h2>
              <p>Add, edit, or remove menu items</p>
            </div>
          </Link>
          
          <Link to="/owner/orders" className="block">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-2">View Orders</h2>
              <p>Manage and track customer orders</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Navbar from '../../components/Navbar';
import OrderCard from '../../components/OrderCard';
import OrderDetails from '../../components/OrderDetails';
import OrderFilters from '../../components/OrderFilters';
import toast from 'react-hot-toast';
import { FaShoppingBag } from 'react-icons/fa';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrders();

    // Listen for order status updates
    if (socket) {
      socket.on('orderStatusUpdated', (updatedOrder) => {
        toast.success(`Order #${updatedOrder._id.slice(-8)} status updated to ${updatedOrder.status}`);
        fetchOrders(); // Refresh orders
      });

      return () => socket.off('orderStatusUpdated');
    }
  }, [socket]);

  useEffect(() => {
    filterOrders();
  }, [orders, filter, dateRange, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/v1/orders/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
      setFilteredOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching orders');
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }

    // Apply date range filter
    const now = new Date();
    if (dateRange === 'today') {
      const today = new Date(now.setHours(0, 0, 0, 0));
      filtered = filtered.filter(order => new Date(order.createdAt) >= today);
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(order => new Date(order.createdAt) >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(order => new Date(order.createdAt) >= monthAgo);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.restaurant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'created').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0)
    };
  };

  const handleReorder = async (order) => {
    try {
      const orderItems = order.items.map(item => ({
        item: item.item._id,
        quantity: item.quantity
      }));

      await axios.post('http://localhost:8000/api/v1/orders', 
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Order placed successfully!');
      fetchOrders();
    } catch (error) {
      toast.error('Error placing order');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Error cancelling order');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Accepted</p>
            <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-purple-600">₹{stats.totalSpent}</p>
          </div>
        </div>

        {/* Filters */}
        <OrderFilters
          filter={filter}
          setFilter={setFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaShoppingBag className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {filter !== 'all' 
                ? `You don't have any ${filter} orders yet.` 
                : "You haven't placed any orders yet."}
            </p>
            <button
              onClick={() => window.location.href = '/customer/menu'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List - Left Side */}
            <div className="lg:col-span-1 space-y-4">
              {filteredOrders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isSelected={selectedOrder?._id === order._id}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>

            {/* Order Details - Right Side */}
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <OrderDetails
                  order={selectedOrder}
                  onReorder={() => handleReorder(selectedOrder)}
                  onCancel={() => handleCancelOrder(selectedOrder._id)}
                  canCancel={selectedOrder.status === 'created'}
                />
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
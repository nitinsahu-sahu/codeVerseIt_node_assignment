import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaTruck } from 'react-icons/fa';

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on('newOrder', (order) => {
        toast.success('New order received!');
        fetchOrders(); // Refresh orders
      });

      return () => socket.off('newOrder');
    }
  }, [filter, page, socket]);

  const fetchOrders = async () => {
    try {
      const url = filter === 'all'
        ? `http://localhost:8000/api/v1/orders/restaurant?page=${page}&limit=10`
        : `http://localhost:8000/api/v1/orders/restaurant?status=${filter}&page=${page}&limit=10`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching orders');
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/orders/${orderId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order accepted');
      fetchOrders();
    } catch (error) {
      toast.error('Error accepting order');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Order cancelled');
      fetchOrders();
    } catch (error) {
      toast.error('Error cancelling order');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'created': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Orders</h1>

        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          {['all', 'created', 'accepted', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order._id.slice(-8)}</p>
                  <p className="font-semibold">Customer: {order.customer?.name}</p>
                  <p className="text-sm text-gray-600">{order.customer?.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t border-b py-4 my-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-2">
                    <span>{item.item?.name} x {item.quantity}</span>
                    <span>₹{item.item?.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-xl">Total: ₹{order.totalPrice}</span>
                
                <div className="space-x-2">
                  {order.status === 'created' && (
                    <>
                      <button
                        onClick={() => handleAcceptOrder(order._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 inline-flex items-center"
                      >
                        <FaCheck className="mr-2" /> Accept
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 inline-flex items-center"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => {/* Handle delivery */}}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                    >
                      <FaTruck className="mr-2" /> Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={orders.length < 10}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerOrders;
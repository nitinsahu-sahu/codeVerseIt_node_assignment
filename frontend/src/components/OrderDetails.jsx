import { useState } from 'react';
import { FaStore, FaCalendar, FaRupeeSign, FaMapMarker, FaPhone, FaEnvelope } from 'react-icons/fa';

const OrderDetails = ({ order, onReorder, onCancel, canCancel }) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case 'created': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status) => {
    switch(status) {
      case 'created': return 'Your order is pending and waiting to be accepted by the restaurant.';
      case 'accepted': return 'Your order has been accepted and is being prepared.';
      case 'delivered': return 'Your order has been delivered. Thank you for ordering!';
      case 'cancelled': return 'This order has been cancelled.';
      default: return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  const getTimelineSteps = () => {
    const steps = [
      { status: 'created', label: 'Order Placed', icon: '📝' },
      { status: 'accepted', label: 'Order Accepted', icon: '✅' },
      { status: 'delivered', label: 'Delivered', icon: '📦' }
    ];

    const currentStepIndex = steps.findIndex(step => step.status === order.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex && order.status !== 'cancelled',
      active: index === currentStepIndex && order.status !== 'cancelled'
    }));
  };

  if (!order) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Order Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">Order Details</h2>
            <p className="text-blue-100 text-sm">#{order._id}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Status Message */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <p className="text-gray-700">{getStatusMessage(order.status)}</p>
      </div>

      {/* Order Timeline */}
      {order.status !== 'cancelled' && (
        <div className="px-6 py-6 border-b">
          <h3 className="font-semibold text-gray-800 mb-4">Order Timeline</h3>
          <div className="relative">
            {getTimelineSteps().map((step, index) => (
              <div key={step.status} className="flex items-start mb-4 last:mb-0">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : step.active ? 'bg-blue-500' : 'bg-gray-300'
                  } text-white`}>
                    {step.icon}
                  </div>
                  {index < 2 && (
                    <div className={`absolute top-8 left-4 w-0.5 h-8 ${
                      getTimelineSteps()[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${
                    step.completed ? 'text-green-600' : step.active ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.completed && order.status === step.status && (
                    <p className="text-sm text-gray-500">
                      {formatDate(order.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restaurant Info */}
      <div className="px-6 py-4 border-b">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FaStore className="mr-2 text-blue-600" /> Restaurant Details
        </h3>
        <div className="space-y-2">
          <p className="font-medium">{order.restaurant?.name || 'Restaurant Name'}</p>
          <p className="text-sm text-gray-600 flex items-center">
            <FaEnvelope className="mr-2 text-gray-400" /> {order.restaurant?.email || 'email@example.com'}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <FaPhone className="mr-2 text-gray-400" /> +91 98765 43210
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <FaMapMarker className="mr-2 text-gray-400" /> 123, Food Street, Mumbai
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-6 py-4 border-b">
        <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-medium">{item.item?.name}</span>
                <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
              </div>
              <span className="font-medium">₹{item.item?.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{order.totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (GST)</span>
            <span>₹{Math.round(order.totalPrice * 0.05)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-xl text-blue-600">₹{order.totalPrice + Math.round(order.totalPrice * 0.05)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="px-6 py-4 border-t text-sm text-gray-500">
        <p className="flex items-center mb-1">
          <FaCalendar className="mr-2" /> Placed on: {formatDate(order.createdAt)}
        </p>
        {order.updatedAt !== order.createdAt && (
          <p className="flex items-center">
            <FaCalendar className="mr-2" /> Last updated: {formatDate(order.updatedAt)}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t flex space-x-3">
        <button
          onClick={onReorder}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reorder
        </button>
        {canCancel && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-xl font-bold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                No, Keep
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  onCancel();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
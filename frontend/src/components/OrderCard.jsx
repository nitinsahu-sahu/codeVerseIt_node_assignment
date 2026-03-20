import { formatDistanceToNow } from 'date-fns';

const OrderCard = ({ order, isSelected, onClick }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'created': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'created': return '⏳';
      case 'accepted': return '✅';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const formatTime = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      {/* Order Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-600">Order #{order._id.slice(-8)}</p>
          <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)} {order.status}
        </span>
      </div>

      {/* Restaurant Info */}
      <div className="mb-3">
        <p className="font-semibold text-gray-800">{order.restaurant?.name || 'Restaurant'}</p>
        <p className="text-sm text-gray-600">{order.restaurant?.email}</p>
      </div>

      {/* Items Preview */}
      <div className="space-y-1 mb-3">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.item?.name} x{item.quantity}
            </span>
            <span className="font-medium">₹{item.item?.price * item.quantity}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
        )}
      </div>

      {/* Order Total */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-sm text-gray-600">Total</span>
        <span className="font-bold text-blue-600">₹{order.totalPrice}</span>
      </div>
    </div>
  );
};

export default OrderCard;
const MenuItem = ({ item, onEdit, onAddToCart, showEdit = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-600 mt-1">Category: {item.category}</p>
          </div>
          <span className="text-2xl font-bold text-blue-600">₹{item.price}</span>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          {showEdit && (
            <button
              onClick={() => onEdit(item)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Edit
            </button>
          )}
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(item)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
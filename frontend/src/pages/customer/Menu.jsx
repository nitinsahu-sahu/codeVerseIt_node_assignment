import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import MenuItem from '../../components/MenuItem';
import Cart from '../../components/Cart';
import toast from 'react-hot-toast';

const CustomerMenu = () => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { token } = useAuth();

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, page]);

  const fetchMenu = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? `http://localhost:8000/api/v1/menu/me?page=${page}&limit=10`
        : `http://localhost:8000/api/v1/menu/me?category=${selectedCategory}&page=${page}&limit=10`;
      
      const response = await axios.get(url);
      setMenu(response.data.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.data.map(item => item.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching menu');
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.item._id === item._id);
      if (existing) {
        return prev.map(i => 
          i.item._id === item._id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success('Added to cart');
  };

  const placeOrder = async () => {
    try {
      const orderItems = cart.map(({ item, quantity }) => ({
        item: item._id,
        quantity
      }));

      await axios.post('http://localhost:8000/api/v1/orders', 
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart([]);
      setShowCart(false);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Error placing order');
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Menu</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map(item => (
            <MenuItem
              key={item._id}
              item={item}
              onAddToCart={addToCart}
            />
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
            disabled={menu.length < 10}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Cart Modal */}
        {showCart && (
          <Cart
            cart={cart}
            setCart={setCart}
            onClose={() => setShowCart(false)}
            onPlaceOrder={placeOrder}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerMenu;
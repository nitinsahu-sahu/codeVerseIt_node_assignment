import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import MenuItem from '../../components/MenuItem';
import MenuForm from '../../components/MenuForm';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';

const OwnerMenu = () => {
  const [menu, setMenu] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/menu/me');
      setMenu(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching menu');
      setLoading(false);
    }
  };

  const handleAddItem = async (formData) => {
    try {
      await axios.post('http://localhost:8000/api/v1/menu', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Item added successfully');
      fetchMenu();
      setShowForm(false);
    } catch (error) {
      toast.error('Error adding item');
    }
  };

  const handleUpdateItem = async (id, formData) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/menu/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Item updated successfully');
      fetchMenu();
      setEditingItem(null);
    } catch (error) {
      toast.error('Error updating item');
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
          <h1 className="text-3xl font-bold text-gray-800">Manage Menu</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map(item => (
            <MenuItem
              key={item._id}
              item={item}
              showEdit={true}
              onEdit={() => setEditingItem(item)}
            />
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {(showForm || editingItem) && (
          <MenuForm
            item={editingItem}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          />
        )}
      </div>
    </div>
  );
};

export default OwnerMenu;
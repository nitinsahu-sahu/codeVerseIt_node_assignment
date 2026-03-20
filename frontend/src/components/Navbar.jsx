import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUtensils, FaShoppingBag, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isOwner = user?.role === 'owner';
  const basePath = isOwner ? '/owner' : '/customer';

  const navItems = [
    { path: basePath, label: 'Dashboard', icon: FaHome },
    { path: `${basePath}/menu`, label: 'Menu', icon: FaUtensils },
    { path: `${basePath}/orders`, label: 'Orders', icon: FaShoppingBag },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <item.icon className="mr-2" />
                {item.label}
              </Link>
            ))}
          </div>
          
          <button
            onClick={logout}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
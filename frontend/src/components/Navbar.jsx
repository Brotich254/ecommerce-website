import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">ShopSwift</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">Shop</Link>
          {user && <Link to="/orders" className="text-sm text-gray-600 hover:text-indigo-600">Orders</Link>}
          <Link to="/cart" className="relative text-sm text-gray-600 hover:text-indigo-600">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={logout} className="text-sm text-gray-600 hover:text-red-500">Logout</button>
          ) : (
            <Link to="/login" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

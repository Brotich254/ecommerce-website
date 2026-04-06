import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url || 'https://placehold.co/400x400?text=Product'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-indigo-500 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold mt-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-indigo-600">${Number(product.price).toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

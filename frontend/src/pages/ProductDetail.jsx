import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={product.image_url || 'https://placehold.co/600x600?text=Product'}
          alt={product.name}
          className="w-full rounded-2xl object-cover aspect-square"
        />
        <div className="flex flex-col justify-center">
          <p className="text-sm text-indigo-500 uppercase tracking-wide">{product.category}</p>
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          <p className="text-gray-500 mt-4">{product.description}</p>
          <p className="text-3xl font-bold text-indigo-600 mt-6">${Number(product.price).toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-1">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          <button
            disabled={product.stock === 0}
            onClick={() => { addToCart(product); toast.success('Added to cart'); }}
            className="mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

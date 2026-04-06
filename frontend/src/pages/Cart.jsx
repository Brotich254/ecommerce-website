import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart();

  if (cart.length === 0) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">Your cart is empty.</p>
      <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">Continue Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <img
              src={item.image_url || 'https://placehold.co/80x80?text=P'}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-indigo-600 font-bold">${Number(item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100">-</button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100">+</button>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-indigo-600">${total.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="mt-4 block text-center bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

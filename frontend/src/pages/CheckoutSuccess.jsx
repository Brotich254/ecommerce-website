import { Link } from 'react-router-dom';

export default function CheckoutSuccess() {
  return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-indigo-600">Order Placed!</h1>
      <p className="text-gray-500 mt-2">Thanks for your purchase. We'll get it shipped soon.</p>
      <div className="mt-8 flex gap-4 justify-center">
        <Link to="/orders" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700">View Orders</Link>
        <Link to="/" className="border px-6 py-2.5 rounded-xl hover:bg-gray-50">Continue Shopping</Link>
      </div>
    </div>
  );
}

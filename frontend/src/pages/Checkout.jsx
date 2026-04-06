import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret, paymentIntentId, shipping, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Create order in DB
    try {
      await api.post('/orders', {
        items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity, price: i.price })),
        shipping_address: shipping,
        stripe_payment_intent: paymentIntentId,
      });
      clearCart();
      onSuccess();
    } catch {
      toast.error('Order creation failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [shipping, setShipping] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (cart.length === 0) { navigate('/cart'); return; }

    api.post('/payments/create-intent', {
      items: cart.map((i) => ({ price: i.price, quantity: i.quantity })),
    }).then(({ data }) => {
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    });
  }, []);

  if (!clientSecret) return <div className="text-center py-20">Preparing checkout...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* Order Summary */}
      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-indigo-600">${total.toFixed(2)}</span>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Shipping Address</label>
          <textarea
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            rows={3}
            placeholder="Enter your shipping address"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Payment */}
      <div>
        <h2 className="text-xl font-bold mb-4">Payment</h2>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            clientSecret={clientSecret}
            paymentIntentId={paymentIntentId}
            shipping={shipping}
            onSuccess={() => navigate('/checkout/success')}
          />
        </Elements>
      </div>
    </div>
  );
}

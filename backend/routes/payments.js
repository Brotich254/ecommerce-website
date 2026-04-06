const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/db');
const auth = require('../middleware/auth');

// Create payment intent for fast checkout
router.post('/create-intent', auth, async (req, res) => {
  const { items } = req.body;
  const amount = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { user_id: req.user.id },
    });
    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stripe webhook to confirm payment and update order status
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).send('Webhook signature failed');
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    await db.execute(
      "UPDATE orders SET status = 'paid' WHERE stripe_payment_intent = ?",
      [pi.id]
    );
  }

  res.json({ received: true });
});

module.exports = router;

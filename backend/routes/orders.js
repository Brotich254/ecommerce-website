const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    for (const order of orders) {
      const [items] = await db.execute(
        `SELECT oi.*, p.name, p.image_url FROM order_items oi
         JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order (called after payment intent created)
router.post('/', auth, async (req, res) => {
  const { items, shipping_address, stripe_payment_intent } = req.body;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [order] = await conn.execute(
      'INSERT INTO orders (user_id, total, stripe_payment_intent, shipping_address) VALUES (?, ?, ?, ?)',
      [req.user.id, total, stripe_payment_intent, shipping_address]
    );
    for (const item of items) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order.insertId, item.product_id, item.quantity, item.price]
      );
      await conn.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }
    await conn.commit();
    res.status(201).json({ id: order.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Order failed' });
  } finally {
    conn.release();
  }
});

module.exports = router;

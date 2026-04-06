const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all products (with optional search/category filter)
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) { query += ' AND name LIKE ?'; params.push(`%${search}%`); }
  if (category) { query += ' AND category = ?'; params.push(category); }

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create product
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { name, description, price, image_url, stock, category } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image_url, stock, category]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update product
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { name, description, price, image_url, stock, category } = req.body;
  try {
    await db.execute(
      'UPDATE products SET name=?, description=?, price=?, image_url=?, stock=?, category=? WHERE id=?',
      [name, description, price, image_url, stock, category, req.params.id]
    );
    res.json({ message: 'Updated' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: delete product
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

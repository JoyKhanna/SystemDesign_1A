const pool = require('../config/db');

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || 1;

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT ci.id, ci.quantity, ci.product_id,
              p.name, p.price, p.original_price, p.discount_percent,
              p.brand, p.stock,
              (SELECT image_url FROM product_images pi 
               WHERE pi.product_id = p.id AND pi.is_primary = true 
               LIMIT 1) AS image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = \$1
       ORDER BY ci.created_at DESC`,
      [DEFAULT_USER_ID]
    );

    const items = result.rows;
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.original_price || item.price) * item.quantity,
      0
    );
    const totalPrice = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const discount = subtotal - totalPrice;
    const deliveryCharges = totalPrice >= 500 ? 0 : 40;
    const finalAmount = totalPrice + deliveryCharges;

    res.json({
      items,
      summary: {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        deliveryCharges: deliveryCharges.toFixed(2),
        totalAmount: finalAmount.toFixed(2),
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check product exists and has stock
    const productCheck = await pool.query(
      'SELECT id, stock FROM products WHERE id = \$1',
      [product_id]
    );
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (productCheck.rows[0].stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Upsert: insert or update quantity
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (\$1, \$2, \$3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + \$3
       RETURNING *`,
      [DEFAULT_USER_ID, product_id, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/:id
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    // Check stock
    const cartItem = await pool.query(
      `SELECT ci.*, p.stock FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.id = \$1 AND ci.user_id = \$2`,
      [id, DEFAULT_USER_ID]
    );
    if (cartItem.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    if (cartItem.rows[0].stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const result = await pool.query(
      'UPDATE cart_items SET quantity = \$1 WHERE id = \$2 AND user_id = \$3 RETURNING *',
      [quantity, id, DEFAULT_USER_ID]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:id
const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = \$1 AND user_id = \$2 RETURNING *',
      [id, DEFAULT_USER_ID]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = \$1', [DEFAULT_USER_ID]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
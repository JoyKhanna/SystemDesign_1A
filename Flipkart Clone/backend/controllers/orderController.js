const pool = require('../config/db');

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || 1;

// POST /api/orders
const placeOrder = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { address } = req.body;

    // 1. Get cart items
    const cartResult = await client.query(
      `SELECT ci.*, p.name AS product_name, p.price, p.original_price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = \$1`,
      [DEFAULT_USER_ID]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Verify stock for all items
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Insufficient stock for ${item.product_name}`,
        });
      }
    }

    // 3. Save address
    const addressResult = await client.query(
      `INSERT INTO addresses (user_id, name, phone, address_line1, address_line2, city, state, pincode)
       VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8) RETURNING id`,
      [
        DEFAULT_USER_ID,
        address.name,
        address.phone,
        address.address_line1,
        address.address_line2 || '',
        address.city,
        address.state,
        address.pincode,
      ]
    );
    const addressId = addressResult.rows[0].id;

    // 4. Calculate totals
    const items = cartResult.rows;
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

    // 5. Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, address_id, total_amount, discount_amount, delivery_charges, final_amount, status, payment_method)
       VALUES (\$1, \$2, \$3, \$4, \$5, \$6, 'placed', 'cod') RETURNING *`,
      [DEFAULT_USER_ID, addressId, subtotal, discount, deliveryCharges, finalAmount]
    );
    const order = orderResult.rows[0];

    // 6. Create order items and reduce stock
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
         VALUES (\$1, \$2, \$3, \$4, \$5)`,
        [order.id, item.product_id, item.product_name, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - \$1 WHERE id = \$2',
        [item.quantity, item.product_id]
      );
    }

    // 7. Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = \$1', [DEFAULT_USER_ID]);

    await client.query('COMMIT');

    // Fetch complete order with items
    const fullOrder = await pool.query(
      `SELECT o.*, a.name AS address_name, a.phone AS address_phone,
              a.address_line1, a.address_line2, a.city, a.state, a.pincode
       FROM orders o
       JOIN addresses a ON o.address_id = a.id
       WHERE o.id = \$1`,
      [order.id]
    );

    const orderItems = await pool.query(
      'SELECT * FROM order_items WHERE order_id = \$1',
      [order.id]
    );

    res.status(201).json({
      ...fullOrder.rows[0],
      items: orderItems.rows,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT o.*, a.name AS address_name, a.city, a.state
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.user_id = \$1
       ORDER BY o.created_at DESC`,
      [DEFAULT_USER_ID]
    );

    // Get items for each order
    const orders = [];
    for (const order of result.rows) {
      const itemsResult = await pool.query(
        `SELECT oi.*, 
                (SELECT image_url FROM product_images pi 
                 WHERE pi.product_id = oi.product_id AND pi.is_primary = true 
                 LIMIT 1) AS image_url
         FROM order_items oi
         WHERE oi.order_id = \$1`,
        [order.id]
      );
      orders.push({ ...order, items: itemsResult.rows });
    }

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderResult = await pool.query(
      `SELECT o.*, a.name AS address_name, a.phone AS address_phone,
              a.address_line1, a.address_line2, a.city, a.state, a.pincode
       FROM orders o
       LEFT JOIN addresses a ON o.address_id = a.id
       WHERE o.id = \$1 AND o.user_id = \$2`,
      [id, DEFAULT_USER_ID]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query(
      `SELECT oi.*,
              (SELECT image_url FROM product_images pi 
               WHERE pi.product_id = oi.product_id AND pi.is_primary = true 
               LIMIT 1) AS image_url
       FROM order_items oi WHERE oi.order_id = \$1`,
      [id]
    );

    res.json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { placeOrder, getOrders, getOrderById };

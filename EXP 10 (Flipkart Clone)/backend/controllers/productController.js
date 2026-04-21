const pool = require('../config/db');

// GET /api/products?search=&category=&sort=&page=&limit=
const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug,
             (SELECT image_url FROM product_images pi 
              WHERE pi.product_id = p.id AND pi.is_primary = true 
              LIMIT 1) AS primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.brand ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND c.slug = $${paramCount}`;
      params.push(category);
    }

    // Sorting
    switch (sort) {
      case 'price_low':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price_high':
        query += ' ORDER BY p.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY p.rating DESC';
        break;
      case 'discount':
        query += ' ORDER BY p.discount_percent DESC';
        break;
      default:
        query += ' ORDER BY p.created_at DESC';
    }

    // Count total (multiline-safe: main query has a subquery with its own FROM)
    const countQuery = query
      .replace(
        /SELECT[\s\S]+?FROM products p/i,
        'SELECT COUNT(*)::int AS count FROM products p'
      )
      .replace(/\s+ORDER BY[\s\S]*$/i, '');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // Pagination
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      products: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productResult = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = \$1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagesResult = await pool.query(
      'SELECT * FROM product_images WHERE product_id = \$1 ORDER BY sort_order',
      [id]
    );

    const product = productResult.rows[0];
    product.images = imagesResult.rows;

    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductById };
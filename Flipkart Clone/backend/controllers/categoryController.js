const pool = require('../config/db');

const getAllCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCategories };
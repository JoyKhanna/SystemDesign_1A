// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT || 5432,
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'password',
//   database: process.env.DB_NAME || 'flipkart_clone',
// });

// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if available, otherwise fallback to a local connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/flipkart_clone';

const pool = new Pool({
  connectionString,
  // Uncomment the lines below if you are deploying to a production environment (like Render, Heroku, etc.)
  // that requires SSL connections:
  /*
  ssl: {
    rejectUnauthorized: false,
  }
  */
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',      // Host of your MySQL server
  user: process.env.DB_USER || 'root',           // MySQL username
  password: process.env.DB_PASSWORD || 'Dinushka123@', // MySQL password
  database: process.env.DB_NAME || 'auth_system', // Database name
  waitForConnections: true,                      // Wait for connections when the pool is full
  connectionLimit: 10,                           // Maximum number of connections in the pool
  queueLimit: 0                                  // Unlimited queued requests
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
  connection.release(); // Release the connection back to the pool
});

// Export the pool for use in other parts of the application
module.exports = pool;

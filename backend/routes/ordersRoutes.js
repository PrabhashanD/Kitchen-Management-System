const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure this points to your database connection module

// Fetch all orders
router.get('/', (req, res) => {
  const query = 'SELECT * FROM orders';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log error for debugging
      return res.status(500).json({ error: 'Database error while fetching orders' });
    }
    res.json(results); // Return all orders in JSON format
  });
});

// Add a new order
router.post('/add', (req, res) => {
  const { item_name, quantity, customer, order_date, status = 'Pending' } = req.body;  // Changed from supplier to customer

  // Validate input fields
  if (!item_name || !quantity || !customer || !order_date) { // Updated supplier to customer
    return res.status(400).json({ error: 'All fields (item_name, quantity, customer, order_date) are required' });
  }

  // Ensure the quantity is a number
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'Quantity must be a positive number' });
  }

  // SQL query to insert a new order
  const query = 'INSERT INTO orders (item_name, quantity, customer, order_date, status) VALUES (?, ?, ?, ?, ?)';  // Updated supplier to customer
  db.query(query, [item_name, quantity, customer, order_date, status], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log error for debugging
      return res.status(500).json({ error: 'Database error while adding order' });
    }

    res.status(201).json({
      message: 'Order added successfully',
      id: results.insertId // Return the ID of the newly inserted order
    });
  });
});

// Update order status
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  // Check if order exists
  const checkQuery = 'SELECT * FROM orders WHERE id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log error for debugging
      return res.status(500).json({ error: 'Database error while checking order' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // SQL query to update order status
    const updateQuery = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(updateQuery, [status, id], (err) => {
      if (err) {
        console.error('Database error:', err); // Log error for debugging
        return res.status(500).json({ error: 'Database error while updating order status' });
      }

      res.json({ message: 'Order status updated successfully' });
    });
  });
});

module.exports = router;

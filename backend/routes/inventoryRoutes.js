const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch all inventory items
router.get('/', (req, res) => {
  const query = 'SELECT * FROM inventory';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Add a new inventory item
router.post('/add', (req, res) => {
  const { item_name, category, quantity, unit, expiry_date } = req.body;
  const query = 'INSERT INTO inventory (item_name, category, quantity, unit, expiry_date) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [item_name, category, quantity, unit, expiry_date], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Item added successfully', id: results.insertId });
  });
});

module.exports = router;

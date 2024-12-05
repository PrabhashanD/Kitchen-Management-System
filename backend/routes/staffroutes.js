const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all staff
router.get('/', (req, res) => {
  const query = 'SELECT * FROM staff';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Add a staff member (id auto-incremented)
router.post('/add', (req, res) => {
  const { full_name, role, contact_info } = req.body;

  // Validate the required fields
  if (!full_name || !role || !contact_info) {
    return res.status(400).json({ error: 'Full Name, Role, and Contact Information are required.' });
  }

  // Insert the new staff into the database (auto-incremented id handled by MySQL)
  const query = 'INSERT INTO staff (full_name, role, contact_info) VALUES (?, ?, ?)';
  db.query(query, [full_name, role, contact_info], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Staff member added successfully', id: results.insertId });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helper function to format the ISO string to MySQL DATETIME format
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toISOString().slice(0, 19).replace('T', ' '); // Converts '2024-11-28T18:17:31.341Z' to '2024-11-28 18:17:31'
};

// GET all reports from the database
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM reporting');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Failed to retrieve reports' });
  }
});

// POST a new report into the database
router.post('/', async (req, res) => {
  const { report_name, report_value, created_at } = req.body;

  // Validate that the required fields are present
  if (!report_name || report_value === undefined || !created_at) {
    return res.status(400).json({ message: 'Report name, report_value, and created_at are required.' });
  }

  // Format the created_at value before inserting into the database
  const formattedCreatedAt = formatDate(created_at);

  try {
    // Insert the new report into the database (with report_value and formatted created_at)
    const [result] = await pool.promise().query(
      'INSERT INTO reporting (report_name, report_value, created_at) VALUES (?, ?, ?)',
      [report_name, report_value, formattedCreatedAt]
    );

    const newReport = {
      id: result.insertId,
      report_name,
      report_value,
      created_at: formattedCreatedAt,
    };

    res.status(201).json(newReport);
  } catch (err) {
    console.error('Error inserting report:', err);
    res.status(500).json({ message: 'Failed to insert report' });
  }
});

module.exports = router;

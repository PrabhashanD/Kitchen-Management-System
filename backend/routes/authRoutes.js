const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Import the db connection
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register route
router.post('/register', async (req, res) => {
  const { fullName, username, password, email } = req.body;

  console.log('Register Request Body:', req.body); // Log incoming request body for debugging

  // Validate that all required fields are present
  if (!fullName || !username || !password || !email) {
    return res.status(400).json({ message: 'All fields (fullName, username, password, email) are required' });
  }

  // Check if user already exists by username or email
  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.execute(query, [username, email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Username or email already taken' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to database (update to reflect actual column names)
      const insertQuery = 'INSERT INTO users (full_name, username, email, password) VALUES (?, ?, ?, ?)';
      db.execute(insertQuery, [fullName, username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error saving user:', err);
          return res.status(500).json({ message: 'Failed to register user' });
        }

        console.log('Registered User:', result); // Debugging

        // Create and send JWT token
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
          message: 'User registered successfully',
          token,
        });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Login Request Body:', req.body); // Debugging

  // Validate that username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find user by username
  const query = 'SELECT * FROM users WHERE username = ?';
  db.execute(query, [username], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result[0];

    try {
      // Compare entered password with stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create and send JWT token
      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
});

module.exports = router;

// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const ordersRoutes = require('./routes/ordersRoutes');
const staffRoutes = require('./routes/staffRoutes');
const reportRoutes = require('./routes/reportRoutes');  // Import the report routes
const inventoryRoutes = require('./routes/inventoryRoutes');  // Import the inventory routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json());  // Middleware to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);       // Authentication routes
app.use('/api/orders', ordersRoutes);   // Orders routes
app.use('/api/staff', staffRoutes);     // Staff routes
app.use('/api/reports', reportRoutes);  // Reports routes
app.use('/api/inventory', inventoryRoutes);  // Inventory routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');
const errorHandler = require('./middleware/errorHandler');

/**
 * DeskFlow Backend Server
 * MERN Stack Support Ticket System
 */

const app = express();

// ─────────────────────────────────────────────
// DATABASE CONNECTION
// ─────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────

// CORS
app.use(cors());
// Body Parser
app.use(express.json());

// ─────────────────────────────────────────────
// HEALTH CHECK ROUTE
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DeskFlow API is running successfully',
  });
});

// ─────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────
app.use('/api/tickets', ticketRoutes);

// ─────────────────────────────────────────────
// 404 ROUTE HANDLER
// ─────────────────────────────────────────────
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
// SERVER START
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }

    app.listen(PORT, () => {
      console.log(`🚀 DeskFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

// ─────────────────────────────────────────────
// HANDLE UNHANDLED PROMISE REJECTIONS
// ─────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});
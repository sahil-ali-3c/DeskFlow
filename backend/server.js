const dotenv = require('dotenv');
const path = require('path');

// Load environment variables before anything else
dotenv.config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');
const errorHandler = require('./middleware/errorHandler');

/**
 * DeskFlow API Server
 *
 * Express application that serves the support-ticket triage board API.
 * Connects to MongoDB, applies middleware, mounts routes, and starts
 * listening on the configured port.
 */

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────
const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  ...(vercelOrigin ? [vercelOrigin] : []),
  ...configuredOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body parser ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Frontend static files (single-container deployment) ────────────────
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendDistPath) && fs.existsSync(frontendIndexPath);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
}

// ── Health-check endpoint ────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'DeskFlow API is running' });
});

// ── Routes ───────────────────────────────────────────────────────────────
app.use('/api/tickets', ticketRoutes);

if (hasFrontendBuild) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(frontendIndexPath);
  });
}

// ── Catch-all for unmatched routes ─────────────────────────────────────
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Error handler (must be LAST middleware) ──────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'Missing MONGODB_URI. Add it to Railway Environment Variables or your local .env file.'
      );
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(`DeskFlow API server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();

  // ── Handle unhandled promise rejections globally ─────────────────────
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    // Graceful shutdown: close server then exit
    process.exit(1);
  });
}

module.exports = app;

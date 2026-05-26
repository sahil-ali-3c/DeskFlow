const ApiError = require('../utils/ApiError');

/**
 * Central Express error-handling middleware.
 * Translates known error types into consistent JSON responses
 * and ensures the server never crashes on unhandled errors.
 *
 * Response shape: { success: false, message: string }
 *
 * @param {Error}    err  - The error object
 * @param {object}   req  - Express request
 * @param {object}   res  - Express response
 * @param {Function} next - Express next (unused but required by signature)
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // ── Known ApiError instances ───────────────────────────────────────────
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ── Mongoose ValidationError (schema-level validation failures) ────────
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // ── Mongoose CastError (invalid ObjectId, etc.) ───────────────────────
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── MongoDB duplicate key error (code 11000) ──────────────────────────
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value for field(s): ${field}`;
  }

  // ── Fallback – use the error's own message if available ───────────────
  else if (err.message) {
    message = err.message;
  }

  // Log the full error in development for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

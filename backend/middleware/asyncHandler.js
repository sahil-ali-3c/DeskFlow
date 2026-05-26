/**
 * Wraps an async route handler so that any rejected promise is
 * automatically forwarded to Express's error-handling middleware.
 *
 * @param {Function} fn - Async Express route handler (req, res, next)
 * @returns {Function} Wrapped handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

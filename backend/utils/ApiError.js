/**
 * Custom API error class that carries an HTTP status code.
 * Use the static factory methods for common error types.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message    - Human-readable error message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Creates a 400 Bad Request error.
   * @param {string} message - Error description
   * @returns {ApiError}
   */
  static badRequest(message) {
    return new ApiError(400, message);
  }

  /**
   * Creates a 404 Not Found error.
   * @param {string} message - Error description
   * @returns {ApiError}
   */
  static notFound(message) {
    return new ApiError(404, message);
  }
}

module.exports = ApiError;

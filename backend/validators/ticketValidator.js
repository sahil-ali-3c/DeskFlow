/**
 * Request body validators for ticket operations.
 * Each validator returns { isValid: boolean, errors: string[] }.
 */

/** Simple email regex – intentionally permissive for real-world addresses */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

/**
 * Validates the body of a create-ticket request.
 *
 * @param {object} body - Express request body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateCreateTicket = (body) => {
  const errors = [];

  // ── subject ────────────────────────────────────────────────────────────
  if (!body.subject || typeof body.subject !== 'string' || body.subject.trim().length === 0) {
    errors.push('Subject is required and must be a non-empty string');
  } else if (body.subject.trim().length > 200) {
    errors.push('Subject must be at most 200 characters');
  }

  // ── description ────────────────────────────────────────────────────────
  if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  } else if (body.description.trim().length > 2000) {
    errors.push('Description must be at most 2000 characters');
  }

  // ── customerEmail ──────────────────────────────────────────────────────
  if (!body.customerEmail || typeof body.customerEmail !== 'string' || body.customerEmail.trim().length === 0) {
    errors.push('Customer email is required');
  } else if (!EMAIL_REGEX.test(body.customerEmail.trim())) {
    errors.push('Customer email must be a valid email address');
  }

  // ── priority ───────────────────────────────────────────────────────────
  if (!body.priority || typeof body.priority !== 'string') {
    errors.push('Priority is required');
  } else if (!VALID_PRIORITIES.includes(body.priority.toLowerCase())) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates the body of an update-status request.
 *
 * @param {object} body - Express request body
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateUpdateStatus = (body) => {
  const errors = [];

  if (!body.status || typeof body.status !== 'string') {
    errors.push('Status is required');
  } else if (!VALID_STATUSES.includes(body.status.toLowerCase())) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateCreateTicket,
  validateUpdateStatus,
};

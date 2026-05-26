/**
 * SLA (Service Level Agreement) utility functions.
 * Provides target resolution times per priority and helpers to
 * compute ticket age and breach status.
 */

/** SLA targets in minutes keyed by priority level */
const SLA_TARGETS = {
  urgent: 60,     // 1 hour
  high: 240,      // 4 hours
  medium: 1440,   // 24 hours (1 day)
  low: 4320,      // 72 hours (3 days)
};

/**
 * Calculates the age of a ticket in minutes.
 * If resolvedAt is provided the age is measured from createdAt to resolvedAt,
 * otherwise it is measured from createdAt to the current time.
 *
 * @param {Date}      createdAt  - Ticket creation timestamp
 * @param {Date|null} resolvedAt - Ticket resolution timestamp (or null)
 * @returns {number} Age in minutes (rounded to 2 decimal places)
 */
const calculateAgeMinutes = (createdAt, resolvedAt) => {
  const start = new Date(createdAt).getTime();
  const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
  const diffMs = end - start;
  return Math.round((diffMs / 1000 / 60) * 100) / 100;
};

/**
 * Determines whether a ticket has breached its SLA target.
 *
 * - For **resolved / closed** tickets the breach is based on the time
 *   between createdAt and resolvedAt.
 * - For **open / in_progress** tickets the breach is based on the time
 *   between createdAt and *now*.
 *
 * @param {object} ticket - Ticket document (plain object or Mongoose doc)
 * @returns {boolean} `true` if the ticket has exceeded its SLA target
 */
const isSLABreached = (ticket) => {
  const target = SLA_TARGETS[ticket.priority];
  if (target === undefined) return false;

  const status = ticket.status;
  const createdAt = ticket.createdAt;

  if (status === 'resolved' || status === 'closed') {
    // Use resolvedAt when available; fall back to updatedAt then now
    const endTime = ticket.resolvedAt || ticket.updatedAt || new Date();
    const age = calculateAgeMinutes(createdAt, endTime);
    return age > target;
  }

  // open or in_progress — compare against current time
  const age = calculateAgeMinutes(createdAt, null);
  return age > target;
};

/**
 * Enriches a plain ticket object with computed SLA fields.
 *
 * @param {object} ticket - Ticket object (plain JS object)
 * @returns {object} The same ticket object with `ageMinutes` and `slaBreached` added
 */
const enrichTicketWithSLA = (ticket) => {
  const resolvedAt = ticket.resolvedAt || null;
  ticket.ageMinutes = calculateAgeMinutes(ticket.createdAt, resolvedAt);
  ticket.slaBreached = isSLABreached(ticket);
  return ticket;
};

module.exports = {
  SLA_TARGETS,
  calculateAgeMinutes,
  isSLABreached,
  enrichTicketWithSLA,
};

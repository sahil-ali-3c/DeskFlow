/**
 * Ticket status transition rules.
 * Defines the finite-state-machine for valid status changes.
 */

/** Map of current status → array of allowed next statuses */
const VALID_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved'],
};

/**
 * Checks whether a status transition is allowed.
 *
 * @param {string} currentStatus - The ticket's current status
 * @param {string} newStatus     - The desired new status
 * @returns {boolean} `true` if the transition is valid
 */
const isValidTransition = (currentStatus, newStatus) => {
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(newStatus);
};

/**
 * Returns the list of statuses a ticket can transition to from its current status.
 *
 * @param {string} currentStatus - The ticket's current status
 * @returns {string[]} Array of valid next statuses (empty if currentStatus is unknown)
 */
const getValidTransitions = (currentStatus) => {
  return VALID_TRANSITIONS[currentStatus] || [];
};

module.exports = {
  VALID_TRANSITIONS,
  isValidTransition,
  getValidTransitions,
};

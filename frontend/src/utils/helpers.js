/**
 * Format age in minutes to human-readable string
 * @param {number} minutes - Age in minutes
 * @returns {string} Formatted age string like "2h 30m" or "3d 5h"
 */
export function formatAge(minutes) {
  if (minutes === null || minutes === undefined || isNaN(minutes)) return '—';
  
  const mins = Math.floor(minutes);
  
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  if (hours < 24) {
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days < 30) {
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
  
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  return remainingDays > 0 ? `${months}mo ${remainingDays}d` : `${months}mo`;
}

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Validate the ticket creation form
 * @param {Object} formData - { subject, description, customerEmail, priority }
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateTicketForm(formData) {
  const errors = {};

  if (!formData.subject || formData.subject.trim().length === 0) {
    errors.subject = 'Subject is required';
  } else if (formData.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  } else if (formData.subject.trim().length > 200) {
    errors.subject = 'Subject must be less than 200 characters';
  }

  if (!formData.description || formData.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (formData.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!formData.customerEmail || formData.customerEmail.trim().length === 0) {
    errors.customerEmail = 'Customer email is required';
  } else if (!validateEmail(formData.customerEmail)) {
    errors.customerEmail = 'Please enter a valid email address';
  }

  if (!formData.priority) {
    errors.priority = 'Priority is required';
  } else if (!['low', 'medium', 'high', 'urgent'].includes(formData.priority)) {
    errors.priority = 'Invalid priority level';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

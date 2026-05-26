import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;

const unwrapResponse = (response) => {
  if (response?.data && Object.prototype.hasOwnProperty.call(response.data, 'data')) {
    return response.data.data;
  }

  return response?.data;
};

const getErrorMessage = (error, fallbackMessage) => {
  return error.response?.data?.message || error.response?.data?.error || error.message || fallbackMessage;
};

/**
 * Fetch tickets with optional filters
 * @param {Object} filters - { priority, sla_breached }
 * @returns {Promise<Array>} Array of ticket objects
 */
export async function fetchTickets(filters = {}) {
  try {
    const params = {};

    if (filters.priority) {
      params.priority = filters.priority;
    }

    if (filters.sla_breached !== undefined && filters.sla_breached !== null) {
      params.breached = filters.sla_breached;
    }

    const response = await api.get('/tickets', { params });
    return unwrapResponse(response);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to fetch tickets'));
  }
}

/**
 * Fetch ticket statistics
 * @returns {Promise<Object>} Stats object with counts by status and breached count
 */
export async function fetchStats() {
  try {
    const response = await api.get('/tickets/stats');
    return unwrapResponse(response);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to fetch stats'));
  }
}

/**
 * Create a new ticket
 * @param {Object} ticketData - { subject, description, customerEmail, priority }
 * @returns {Promise<Object>} Created ticket object
 */
export async function createTicket(ticketData) {
  try {
    const response = await api.post('/tickets', ticketData);
    return unwrapResponse(response);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to create ticket'));
  }
}

/**
 * Update a ticket's status
 * @param {string} id - Ticket ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated ticket object
 */
export async function updateTicketStatus(id, status) {
  try {
    const response = await api.patch(`/tickets/${id}`, { status });
    return unwrapResponse(response);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to update ticket'));
  }
}

/**
 * Delete a ticket
 * @param {string} id - Ticket ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export async function deleteTicket(id) {
  try {
    const response = await api.delete(`/tickets/${id}`);
    return unwrapResponse(response);
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to delete ticket'));
  }
}

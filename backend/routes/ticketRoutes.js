const express = require('express');
const router = express.Router();

const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
  getTicketStats,
} = require('../controllers/ticketController');

/**
 * Ticket routes – mounted at /api/tickets in server.js
 *
 * IMPORTANT: The /stats route MUST be declared before /:id
 * so that "stats" is not interpreted as a Mongo ObjectId.
 */

// GET  /api/tickets/stats  → Dashboard statistics
router.get('/stats', getTicketStats);

// POST /api/tickets         → Create a new ticket
router.post('/', createTicket);

// GET  /api/tickets         → List all tickets (with optional filters)
router.get('/', getAllTickets);

// GET  /api/tickets/:id     → Get a single ticket
router.get('/:id', getTicketById);

// PATCH /api/tickets/:id    → Update ticket status
router.patch('/:id', updateTicketStatus);

// DELETE /api/tickets/:id   → Delete a ticket
router.delete('/:id', deleteTicket);

module.exports = router;

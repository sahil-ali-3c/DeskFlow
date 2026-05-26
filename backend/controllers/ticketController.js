const Ticket = require('../models/Ticket');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../middleware/asyncHandler');
const { validateCreateTicket, validateUpdateStatus } = require('../validators/ticketValidator');
const { isValidTransition, getValidTransitions } = require('../utils/transitionRules');
const { isSLABreached } = require('../utils/slaUtils');

/**
 * @desc    Create a new support ticket
 * @route   POST /api/tickets
 * @access  Public
 */
const createTicket = asyncHandler(async (req, res) => {
  const { isValid, errors } = validateCreateTicket(req.body);

  if (!isValid) {
    throw ApiError.badRequest(errors.join('. '));
  }

  const { subject, description, customerEmail, priority } = req.body;

  const ticket = await Ticket.create({
    subject,
    description,
    customerEmail,
    priority: priority.toLowerCase(),
  });

  res.status(201).json({
    success: true,
    data: ticket,
  });
});

/**
 * @desc    Get all tickets with optional filters (status, priority, breached)
 * @route   GET /api/tickets
 * @access  Public
 */
const getAllTickets = asyncHandler(async (req, res) => {
  const { status, priority, breached } = req.query;

  // Build MongoDB filter from query params
  const filter = {};

  if (status) {
    filter.status = status.toLowerCase();
  }

  if (priority) {
    filter.priority = priority.toLowerCase();
  }

  // Fetch tickets sorted newest-first
  let tickets = await Ticket.find(filter).sort({ createdAt: -1 });

  // Convert to plain objects so toJSON transform fires
  tickets = tickets.map((t) => t.toJSON());

  // Post-query filter: SLA breached (computed field, not in DB)
  if (breached === 'true') {
    tickets = tickets.filter((t) => t.slaBreached === true);
  }

  res.status(200).json({
    success: true,
    data: tickets,
    count: tickets.length,
  });
});

/**
 * @desc    Get a single ticket by ID
 * @route   GET /api/tickets/:id
 * @access  Public
 */
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw ApiError.notFound(`Ticket not found with id ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

/**
 * @desc    Update a ticket's status (with transition-rule enforcement)
 * @route   PATCH /api/tickets/:id
 * @access  Public
 */
const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw ApiError.notFound(`Ticket not found with id ${req.params.id}`);
  }

  // Validate the incoming status value
  const { isValid, errors } = validateUpdateStatus(req.body);

  if (!isValid) {
    throw ApiError.badRequest(errors.join('. '));
  }

  const newStatus = req.body.status.toLowerCase();
  const currentStatus = ticket.status;

  // Enforce transition rules
  if (!isValidTransition(currentStatus, newStatus)) {
    const allowed = getValidTransitions(currentStatus);
    throw ApiError.badRequest(
      `Invalid status transition: "${currentStatus}" → "${newStatus}". ` +
        `Allowed transitions from "${currentStatus}": [${allowed.join(', ')}]`
    );
  }

  // Handle resolvedAt timestamps
  if (newStatus === 'resolved') {
    ticket.resolvedAt = new Date();
  } else if (currentStatus === 'resolved' && newStatus !== 'resolved') {
    // Moving AWAY from resolved – clear the resolution timestamp
    ticket.resolvedAt = null;
  }

  ticket.status = newStatus;
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket,
  });
});

/**
 * @desc    Delete a ticket
 * @route   DELETE /api/tickets/:id
 * @access  Public
 */
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw ApiError.notFound(`Ticket not found with id ${req.params.id}`);
  }

  await ticket.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Ticket deleted successfully',
  });
});

/**
 * @desc    Get dashboard statistics (counts by status, priority, breached)
 * @route   GET /api/tickets/stats
 * @access  Public
 */
const getTicketStats = asyncHandler(async (req, res) => {
  // ── Aggregation: count by status ───────────────────────────────────────
  const statusAgg = await Ticket.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const byStatus = {};
  statusAgg.forEach((item) => {
    byStatus[item._id] = item.count;
  });

  // ── Aggregation: count by priority ─────────────────────────────────────
  const priorityAgg = await Ticket.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  const byPriority = {};
  priorityAgg.forEach((item) => {
    byPriority[item._id] = item.count;
  });

  // ── Breached count ─────────────────────────────────────────────────────
  // Fetch all non-closed tickets and check SLA in application code
  // (SLA breach is a computed field that can't be aggregated in Mongo)
  const activeTickets = await Ticket.find({
    status: { $in: ['open', 'in_progress'] },
  });

  let breachedCount = 0;
  activeTickets.forEach((ticket) => {
    if (isSLABreached(ticket)) {
      breachedCount += 1;
    }
  });

  // Also count resolved tickets that were breached (resolved after SLA)
  const resolvedTickets = await Ticket.find({
    status: { $in: ['resolved', 'closed'] },
  });

  resolvedTickets.forEach((ticket) => {
    if (isSLABreached(ticket)) {
      breachedCount += 1;
    }
  });

  // ── Total ticket count ─────────────────────────────────────────────────
  const total = await Ticket.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      byStatus,
      byPriority,
      breached: breachedCount,
      breachedCount,
      sla_breached: breachedCount,
      total,
    },
  });
});

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
  getTicketStats,
};

const mongoose = require('mongoose');
const { calculateAgeMinutes, isSLABreached } = require('../utils/slaUtils');

/** Simple email regex used for schema-level validation */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mongoose schema for a support ticket.
 *
 * Computed fields `ageMinutes` and `slaBreached` are injected via the
 * toJSON transform so they appear in every API response automatically.
 */
const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => EMAIL_REGEX.test(value),
        message: 'Please provide a valid email address',
      },
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be one of: low, medium, high, urgent',
      },
      required: [true, 'Priority is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status must be one of: open, in_progress, resolved, closed',
      },
      default: 'open',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: {
      /**
       * Transform function that enriches the JSON output with computed
       * SLA fields every time a ticket is serialised.
       */
      transform(_doc, ret) {
        const resolvedAt = ret.resolvedAt || null;
        const ageMinutes = calculateAgeMinutes(ret.createdAt, resolvedAt);
        const slaBreached = isSLABreached(ret);

        ret.ageMinutes = ageMinutes;
        ret.age_minutes = ageMinutes;
        ret.slaBreached = slaBreached;
        ret.sla_breached = slaBreached;

        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);

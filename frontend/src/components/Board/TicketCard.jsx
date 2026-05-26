import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { formatAge } from '../../utils/helpers';
import { VALID_TRANSITIONS, STATUS_LABELS } from '../../utils/constants';

/**
 * Ticket card with drag support, priority badge, SLA indicator, and action buttons
 * @param {{ ticket: Object, onMove: Function, onDelete: Function }} props
 */
export default function TicketCard({ ticket, onMove, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket._id,
    data: { ticket }
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 100 : undefined
      }
    : undefined;

  const validTransitions = VALID_TRANSITIONS[ticket.status] || [];
  const isBreached = ticket.sla_breached;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ticket-card ${isDragging ? 'ticket-card--dragging' : ''} ${isBreached ? 'ticket-card--breached' : ''}`}
      {...listeners}
      {...attributes}
    >
      {/* Drag handle indicator */}
      <div className="drag-handle">
        <svg viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="4" r="1.2" />
          <circle cx="11" cy="4" r="1.2" />
          <circle cx="5" cy="8" r="1.2" />
          <circle cx="11" cy="8" r="1.2" />
          <circle cx="5" cy="12" r="1.2" />
          <circle cx="11" cy="12" r="1.2" />
        </svg>
      </div>

      {/* Header: Subject + Priority */}
      <div className="card-header">
        <span className="card-subject" title={ticket.subject}>
          {ticket.subject}
        </span>
        <span className={`priority-badge priority-badge--${ticket.priority}`}>
          {ticket.priority}
        </span>
      </div>

      {/* Body: Email + Age */}
      <div className="card-body">
        <span className="card-email" title={ticket.customerEmail}>
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1 5l7 4 7-4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {ticket.customerEmail}
        </span>
        <span className="card-age">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {formatAge(ticket.age_minutes)}
        </span>

        {/* SLA Breach Indicator */}
        {isBreached && (
          <div className="sla-indicator">
            <span className="sla-dot" />
            SLA Breached
          </div>
        )}
      </div>

      {/* Footer: Actions */}
      <div className="card-footer">
        <div className="card-actions">
          {validTransitions.map((targetStatus) => (
            <button
              key={targetStatus}
              className="card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMove(ticket._id, targetStatus);
              }}
              title={`Move to ${STATUS_LABELS[targetStatus]}`}
            >
              <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {STATUS_LABELS[targetStatus]}
            </button>
          ))}
        </div>

        <button
          className="card-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ticket._id);
          }}
          title="Delete ticket"
        >
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 7v5M8 7v5M11 7v5M4 4l.8 9a1 1 0 001 .9h4.4a1 1 0 001-.9L12 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

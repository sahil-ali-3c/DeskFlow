import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { STATUS_LABELS } from '../../utils/constants';
import TicketCard from './TicketCard';
import EmptyState from '../common/EmptyState';

const STATUS_ICONS = {
  open: '📥',
  in_progress: '⚡',
  resolved: '✅',
  closed: '📦'
};

/**
 * Board column with droppable zone, header, and ticket list
 * @param {{
 *   status: string,
 *   tickets: Array,
 *   onMove: Function,
 *   onDelete: Function
 * }} props
 */
export default function BoardColumn({ status, tickets, onMove, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status }
  });

  return (
    <div
      ref={setNodeRef}
      className={`board-column board-column--${status} ${isOver ? 'board-column--over' : ''}`}
    >
      <div className="column-header">
        <span className="column-title">
          {STATUS_LABELS[status] || status}
        </span>
        <span className="column-count">{tickets.length}</span>
      </div>

      <div className="ticket-list">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onMove={onMove}
              onDelete={onDelete}
            />
          ))
        ) : (
          <EmptyState
            message="No tickets"
            icon={STATUS_ICONS[status] || '📭'}
          />
        )}
      </div>
    </div>
  );
}

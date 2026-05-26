import React from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { STATUSES, VALID_TRANSITIONS } from '../../utils/constants';
import BoardColumn from './BoardColumn';

/**
 * Kanban board with 4 status columns and drag-and-drop
 * @param {{
 *   tickets: Array,
 *   onMove: Function,
 *   onDelete: Function,
 *   onInvalidDrop: Function
 * }} props
 */
export default function KanbanBoard({ tickets, onMove, onDelete, onInvalidDrop }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  // Group tickets by status
  const ticketsByStatus = {};
  STATUSES.forEach((status) => {
    ticketsByStatus[status] = [];
  });
  tickets.forEach((ticket) => {
    if (ticketsByStatus[ticket.status]) {
      ticketsByStatus[ticket.status].push(ticket);
    }
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || !active) return;

    const ticket = active.data?.current?.ticket;
    const targetStatus = over.id;

    if (!ticket) return;

    // Same column — do nothing
    if (ticket.status === targetStatus) return;

    // Check valid transitions
    const allowed = VALID_TRANSITIONS[ticket.status] || [];
    if (allowed.includes(targetStatus)) {
      onMove(ticket._id, targetStatus);
    } else {
      onInvalidDrop?.(
        `Cannot move ticket from "${ticket.status.replace('_', ' ')}" to "${targetStatus.replace('_', ' ')}"`
      );
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {STATUSES.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tickets={ticketsByStatus[status]}
            onMove={onMove}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DndContext>
  );
}

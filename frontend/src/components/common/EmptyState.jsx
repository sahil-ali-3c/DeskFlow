import React from 'react';

/**
 * Empty state display with icon and message
 * @param {{ message: string, icon: string }} props
 */
export default function EmptyState({ message = 'No items found', icon = '📭' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}

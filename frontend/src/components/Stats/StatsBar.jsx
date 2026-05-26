import React from 'react';

const STAT_CARDS = [
  { key: 'open', label: 'Open', statusClass: 'open' },
  { key: 'in_progress', label: 'In Progress', statusClass: 'in_progress' },
  { key: 'resolved', label: 'Resolved', statusClass: 'resolved' },
  { key: 'closed', label: 'Closed', statusClass: 'closed' },
  { key: 'breached', label: 'SLA Breached', statusClass: 'breached' }
];

/**
 * Horizontal strip of stat cards
 * @param {{ stats: Object, loading: boolean }} props
 */
export default function StatsBar({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="stats-bar">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="stat-skeleton" />
        ))}
      </div>
    );
  }

  const getCount = (key) => {
    if (key === 'breached') {
      return stats.breached ?? stats.sla_breached ?? 0;
    }
    if (stats.byStatus) {
      return stats.byStatus[key] ?? 0;
    }
    return stats[key] ?? 0;
  };

  return (
    <div className="stats-bar">
      {STAT_CARDS.map((card) => (
        <div
          key={card.key}
          className={`stat-card stat-card--${card.statusClass}`}
        >
          <span className="stat-value">{getCount(card.key)}</span>
          <span className="stat-label">{card.label}</span>
        </div>
      ))}
    </div>
  );
}

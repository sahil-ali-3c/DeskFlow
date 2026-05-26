import React from 'react';
import { PRIORITIES } from '../../utils/constants';

/**
 * Filter bar with priority dropdown, SLA toggle, and clear button
 * @param {{ filters: Object, onFilterChange: Function }} props
 */
export default function FilterBar({ filters, onFilterChange }) {
  const hasActiveFilters = filters.priority || filters.sla_breached;

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      priority: value || undefined
    });
  };

  const handleSlaToggle = () => {
    onFilterChange({
      ...filters,
      sla_breached: filters.sla_breached ? undefined : true
    });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="filter-bar">
      <span className="filter-label">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 3h12M4 8h8M6 13h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Filters
        {hasActiveFilters && <span className="filter-active-indicator" />}
      </span>

      <select
        className="select"
        value={filters.priority || ''}
        onChange={handlePriorityChange}
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>

      <button
        className={`sla-toggle ${filters.sla_breached ? 'sla-toggle--active' : ''}`}
        onClick={handleSlaToggle}
      >
        <span className="sla-dot" />
        SLA Breached
      </button>

      {hasActiveFilters && (
        <button
          className="btn btn-ghost btn-sm clear-filters-btn"
          onClick={handleClearFilters}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}

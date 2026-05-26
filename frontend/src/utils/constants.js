export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production' ? '/_backend' : 'http://localhost:5000/api');

export const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  urgent: '#ef4444'
};

export const VALID_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: ['resolved']
};

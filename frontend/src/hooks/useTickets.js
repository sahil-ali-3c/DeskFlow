import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchTickets,
  fetchStats,
  createTicket,
  updateTicketStatus,
  deleteTicket
} from '../api/ticketApi';

/**
 * Custom hook for managing tickets, stats, filters, and CRUD operations
 */
export function useTickets(showToast) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFiltersState] = useState({});
  const mountedRef = useRef(true);

  const loadTickets = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTickets(currentFilters || filters);
      if (mountedRef.current) {
        setTickets(data);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        showToast?.(err.message, 'error');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [filters, showToast]);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStats();
      if (mountedRef.current) {
        setStats(data);
      }
    } catch (err) {
      // Stats loading failure is non-critical
      console.error('Failed to load stats:', err.message);
    }
  }, []);

  const addTicket = useCallback(async (ticketData) => {
    try {
      await createTicket(ticketData);
      showToast?.('Ticket created successfully!', 'success');
      await Promise.all([loadTickets(), loadStats()]);
      return true;
    } catch (err) {
      showToast?.(err.message, 'error');
      return false;
    }
  }, [loadTickets, loadStats, showToast]);

  const moveTicket = useCallback(async (id, newStatus) => {
    // Optimistic update
    const previousTickets = [...tickets];
    setTickets(prev =>
      prev.map(t => (t._id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTicketStatus(id, newStatus);
      showToast?.('Ticket status updated!', 'success');
      await loadStats();
    } catch (err) {
      // Rollback on error
      setTickets(previousTickets);
      showToast?.(err.message, 'error');
    }
  }, [tickets, loadStats, showToast]);

  const removeTicket = useCallback(async (id) => {
    try {
      await deleteTicket(id);
      showToast?.('Ticket deleted successfully!', 'success');
      await Promise.all([loadTickets(), loadStats()]);
    } catch (err) {
      showToast?.(err.message, 'error');
    }
  }, [loadTickets, loadStats, showToast]);

  const setFilters = useCallback((newFilters) => {
    setFiltersState(newFilters);
  }, []);

  // Load tickets and stats on mount and when filters change
  useEffect(() => {
    mountedRef.current = true;
    loadTickets(filters);
    loadStats();
    return () => {
      mountedRef.current = false;
    };
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadTickets(filters);
      loadStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    tickets,
    stats,
    loading,
    error,
    filters,
    setFilters,
    loadTickets,
    loadStats,
    addTicket,
    moveTicket,
    removeTicket
  };
}

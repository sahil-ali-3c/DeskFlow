import React, { useState } from 'react';
import Header from './components/Layout/Header';
import StatsBar from './components/Stats/StatsBar';
import FilterBar from './components/Filters/FilterBar';
import KanbanBoard from './components/Board/KanbanBoard';
import CreateTicketModal from './components/Ticket/CreateTicketModal';
import Toast from './components/common/Toast';
import Spinner from './components/common/Spinner';
import { useTickets } from './hooks/useTickets';
import { useToast } from './hooks/useToast';
import './App.css';

export default function App() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const {
    tickets,
    stats,
    loading,
    error,
    filters,
    setFilters,
    addTicket,
    moveTicket,
    removeTicket
  } = useTickets(showToast);

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
  };

  const handleCreateSubmit = async (formData) => {
    const success = await addTicket(formData);
    return success;
  };

  const handleMove = (id, newStatus) => {
    moveTicket(id, newStatus);
  };

  const handleDelete = (id) => {
    removeTicket(id);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleInvalidDrop = (message) => {
    showToast(message, 'warning');
  };

  return (
    <div className="app">
      <Header onCreateClick={handleCreateClick} />

      <main className="main-content">
        <StatsBar stats={stats} loading={loading && !tickets.length} />

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading && tickets.length === 0 ? (
          <div className="loading-overlay">
            <Spinner size="lg" />
          </div>
        ) : error && tickets.length === 0 ? (
          <div className="error-banner">
            <p>⚠ {error}</p>
            <p className="error-sub">Please make sure the backend server is running.</p>
          </div>
        ) : (
          <KanbanBoard
            tickets={tickets}
            onMove={handleMove}
            onDelete={handleDelete}
            onInvalidDrop={handleInvalidDrop}
          />
        )}
      </main>

      <CreateTicketModal
        isOpen={createModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateSubmit}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
}

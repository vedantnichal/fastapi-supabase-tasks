import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardList, PlusCircle, SearchX } from 'lucide-react';

export default function TaskList({
  tasks,
  isLoading,
  searchQuery,
  statusFilter,
  onToggleStatus,
  onEdit,
  onDelete,
  onOpenCreate,
  onResetFilters,
}) {
  if (isLoading) {
    return (
      <div className="loading-container" aria-live="polite">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Syncing with FastAPI & Supabase...
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    const isFiltered = searchQuery.trim().length > 0 || statusFilter !== 'all';

    return (
      <div className="empty-state">
        <div className="empty-icon-circle">
          {isFiltered ? <SearchX size={32} /> : <ClipboardList size={32} />}
        </div>
        <h3 className="empty-title">
          {isFiltered ? 'No matching tasks found' : 'Your workspace is clear'}
        </h3>
        <p className="empty-subtitle">
          {isFiltered
            ? `No tasks match "${searchQuery}" in ${statusFilter} view. Try adjusting your search query or filters.`
            : 'Get ahead of your schedule by creating your first task in Supabase.'}
        </p>

        {isFiltered ? (
          <button
            id="reset-filter-btn"
            className="btn btn-secondary"
            onClick={onResetFilters}
          >
            Clear Filters
          </button>
        ) : (
          <button
            id="empty-create-btn"
            className="btn btn-primary"
            onClick={onOpenCreate}
          >
            <PlusCircle size={16} />
            <span>Create Your First Task</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="tasks-container" role="list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';

export default function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  counts,
}) {
  return (
    <div className="controls-bar">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          id="task-search-input"
          type="text"
          className="search-input"
          placeholder="Search tasks by title or details..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            className="search-clear"
            onClick={() => onSearchChange('')}
            title="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="filter-group" role="tablist" aria-label="Task status filter">
        <button
          id="filter-all-tab"
          role="tab"
          aria-selected={statusFilter === 'all'}
          className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => onStatusChange('all')}
        >
          <span>All Tasks</span>
          <span className="filter-pill">{counts.all}</span>
        </button>

        <button
          id="filter-pending-tab"
          role="tab"
          aria-selected={statusFilter === 'pending'}
          className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => onStatusChange('pending')}
        >
          <span>Pending</span>
          <span className="filter-pill">{counts.pending}</span>
        </button>

        <button
          id="filter-completed-tab"
          role="tab"
          aria-selected={statusFilter === 'completed'}
          className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => onStatusChange('completed')}
        >
          <span>Completed</span>
          <span className="filter-pill">{counts.completed}</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <select
          id="task-sort-select"
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
        </select>
      </div>
    </div>
  );
}

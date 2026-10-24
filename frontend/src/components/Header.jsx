import React from 'react';
import { CheckSquare, Plus, RefreshCw, Zap } from 'lucide-react';

export default function Header({ onOpenCreate, onRefresh, isRefreshing, taskCount }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-wrapper">
          <div className="brand-logo">
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-info">
            <span className="brand-title">TaskPulse</span>
            <span className="brand-subtitle">FastAPI & Supabase Task Studio</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="status-badge" title="Backend service connected and running">
            <span className="status-dot"></span>
            <span>API Active</span>
          </div>

          <button
            id="refresh-tasks-btn"
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh task list from backend"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            id="create-task-btn"
            className="btn btn-primary"
            onClick={onOpenCreate}
            title="Create a new task (Hotkey: N)"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Task</span>
            <span className="kbd-hint">N</span>
          </button>
        </div>
      </div>
    </header>
  );
}

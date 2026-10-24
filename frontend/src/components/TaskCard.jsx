import React from 'react';
import { Check, Edit3, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';

function formatDate(isoString) {
  if (!isoString) return 'Recent';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = Boolean(task.completed);

  return (
    <article
      id={`task-item-${task.id}`}
      className={`task-card ${isCompleted ? 'is-completed' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      <button
        id={`toggle-task-${task.id}`}
        type="button"
        className="task-checkbox-btn"
        onClick={() => onToggleStatus(task)}
        title={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
        aria-pressed={isCompleted}
      >
        <Check size={16} strokeWidth={3} />
      </button>

      <div className="task-content">
        <div className="task-header-row">
          <span className="task-id-badge">#{task.id}</span>
          <h3 className="task-title">{task.title}</h3>
          {isCompleted ? (
            <span className="badge badge-done">Completed</span>
          ) : (
            <span className="badge badge-pending">In Progress</span>
          )}
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-footer">
          {task.created_at && (
            <div className="task-meta-item" title="Created date">
              <Calendar size={13} />
              <span>{formatDate(task.created_at)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          id={`edit-task-btn-${task.id}`}
          className="action-btn edit-btn"
          onClick={() => onEdit(task)}
          title="Edit task title and description"
          aria-label="Edit task"
        >
          <Edit3 size={15} />
        </button>

        <button
          id={`delete-task-btn-${task.id}`}
          className="action-btn delete-btn"
          onClick={() => onDelete(task)}
          title="Delete task permanently"
          aria-label="Delete task"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}

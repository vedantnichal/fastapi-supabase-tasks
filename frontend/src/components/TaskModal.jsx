import React, { useState, useEffect, useRef } from 'react';
import { X, Check, FileText, CheckCircle2 } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, task = null, isSaving }) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setCompleted(Boolean(task.completed));
      } else {
        setTitle('');
        setDescription('');
        setCompleted(false);
      }
      setError('');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen, task]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title is required.');
      return;
    }

    const maxLength = isEdit ? 200 : 1000;
    if (trimmedTitle.length > maxLength) {
      setError(`Title cannot exceed ${maxLength} characters.`);
      return;
    }

    onSave({
      title: trimmedTitle,
      description: description.trim() || null,
      completed,
    });
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon primary">
              <FileText size={18} />
            </div>
            <h2 id="modal-title" className="modal-title">
              {isEdit ? `Edit Task #${task.id}` : 'Create New Task'}
            </h2>
          </div>
          <button
            id="close-modal-btn"
            className="btn-ghost"
            onClick={onClose}
            title="Close dialog (Esc)"
            disabled={isSaving}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.825rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                <span>Title <span style={{ color: '#ef4444' }}>*</span></span>
                <span className="char-counter">
                  {title.length} / {isEdit ? '200' : '1000'}
                </span>
              </label>
              <input
                ref={inputRef}
                id="task-title-input"
                type="text"
                className="form-input"
                placeholder="What needs to be accomplished?"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                disabled={isSaving}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-desc-input" className="form-label">
                <span>Description (Optional)</span>
                <span className="char-counter">{description.length} chars</span>
              </label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                placeholder="Add contextual notes, links, or specific steps..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
              />
            </div>

            {isEdit && (
              <div
                className="form-checkbox-row"
                onClick={() => setCompleted(!completed)}
                role="checkbox"
                aria-checked={completed}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setCompleted(!completed);
                  }
                }}
              >
                <div className={`custom-checkbox ${completed ? 'checked' : ''}`}>
                  {completed && <Check size={14} strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Mark as Completed
                </span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              id="cancel-modal-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              id="submit-task-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isSaving || !title.trim()}
            >
              {isSaving ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

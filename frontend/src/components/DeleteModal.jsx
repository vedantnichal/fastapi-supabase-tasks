import React, { useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, task, isDeleting }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon danger">
              <AlertTriangle size={18} />
            </div>
            <h2 id="delete-modal-title" className="modal-title">
              Delete Task #{task.id}
            </h2>
          </div>
          <button
            id="close-delete-modal-btn"
            className="btn-ghost"
            onClick={onClose}
            title="Cancel"
            disabled={isDeleting}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6 }}>
            Are you sure you want to permanently delete{' '}
            <strong style={{ color: '#fff' }}>"{task.title}"</strong>? This will remove
            the record directly from your Supabase database and cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            id="cancel-delete-btn"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Keep Task
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={15} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <aside className="toast-container" aria-live="assertive">
      <div
        className={`toast ${
          isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'
        }`}
        role="alert"
      >
        {isSuccess && <CheckCircle2 size={18} />}
        {isError && <AlertCircle size={18} />}
        {!isSuccess && !isError && <Info size={18} />}
        <span style={{ flex: 1 }}>{toast.message}</span>
        <button
          className="btn-ghost"
          style={{ padding: '0.2rem', color: 'inherit' }}
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}

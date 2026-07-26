import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import './Toast.css';

// ── Icons ──────────────────────────────────────────────────────────────────
const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="8" cy="8" r="7" strokeOpacity="0.3" />
      <path d="M5 8l2.5 2.5L11 5.5" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="8" cy="8" r="7" strokeOpacity="0.3" />
      <path d="M10.5 5.5l-5 5M5.5 5.5l5 5" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M7.002 2.5a1 1 0 0 1 1.996 0l.09 6.5a1.09 1.09 0 0 1-2.176 0l.09-6.5Zm.996 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="7.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1"/>
      <path d="M8 7v5M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

// ── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((type, title, options = {}) => {
    const id = ++idCounter;
    const duration = options.duration ?? 4000;
    setToasts(prev => [...prev, { id, type, title, description: options.description, duration }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const toast = {
    success: (title, opts) => add('success', title, opts),
    error:   (title, opts) => add('error',   title, opts),
    warning: (title, opts) => add('warning', title, opts),
    info:    (title, opts) => add('info',    title, opts),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="ds-toast-container" aria-live="polite" aria-atomic="false">
          {toasts.map(t => (
            <div
              key={t.id}
              className={cn('ds-toast', `ds-toast--${t.type}`)}
              role="alert"
            >
              <span className="ds-toast__icon" aria-hidden="true">{icons[t.type]}</span>
              <div className="ds-toast__content">
                <p className="ds-toast__title">{t.title}</p>
                {t.description && <p className="ds-toast__desc">{t.description}</p>}
              </div>
              <button
                className="ds-toast__close"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M10.95 3.05a.5.5 0 0 0-.707 0L7 6.293 3.757 3.05a.5.5 0 1 0-.707.707L6.293 7 3.05 10.243a.5.5 0 0 0 .707.707L7 7.707l3.243 3.243a.5.5 0 0 0 .707-.707L7.707 7l3.243-3.243a.5.5 0 0 0 0-.707z"/>
                </svg>
              </button>
              {t.duration > 0 && (
                <div
                  className="ds-toast__progress"
                  style={{ animationDuration: `${t.duration}ms` }}
                />
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import './Modal.css';

/**
 * Modal — Accessible dialog with backdrop blur, animations, and keyboard support.
 */
export function Modal({
  open,
  onClose,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  children,
  className = '',
}) {
  const handleEsc = useCallback((e) => {
    if (closeOnEsc && e.key === 'Escape') onClose?.();
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, handleEsc]);

  if (!open) return null;

  return createPortal(
    <div
      className="ds-modal-backdrop"
      onClick={closeOnBackdrop ? (e) => { if (e.target === e.currentTarget) onClose?.(); } : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div className={cn('ds-modal', `ds-modal--${size}`, className)}>
        {children}
      </div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader({ children, title, subtitle, onClose, className = '' }) {
  if (title) {
    return (
      <div className={cn('ds-modal__header', className)}>
        <div>
          <h2 className="ds-modal__title">{title}</h2>
          {subtitle && <p className="ds-modal__subtitle">{subtitle}</p>}
        </div>
        {onClose && (
          <button className="ds-modal__close" onClick={onClose} aria-label="Close modal">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.854 3.146a.5.5 0 0 1 0 .708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293l4.146-4.147a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
        )}
      </div>
    );
  }
  return <div className={cn('ds-modal__header', className)}>{children}</div>;
};

Modal.Body = function ModalBody({ children, className = '' }) {
  return <div className={cn('ds-modal__body', className)}>{children}</div>;
};

Modal.Footer = function ModalFooter({ children, className = '' }) {
  return <div className={cn('ds-modal__footer', className)}>{children}</div>;
};

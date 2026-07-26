import React from 'react';
import { cn } from '../../utils/cn';
import './EmptyState.css';

/**
 * EmptyState — Zero-data placeholder with icon, title, and action.
 */
export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div className={cn('ds-empty', className)}>
      {icon && (
        <div className="ds-empty__icon-wrap" aria-hidden="true">
          {icon}
        </div>
      )}
      {title && <h3 className="ds-empty__title">{title}</h3>}
      {description && <p className="ds-empty__desc">{description}</p>}
      {action && <div className="ds-empty__action">{action}</div>}
    </div>
  );
}

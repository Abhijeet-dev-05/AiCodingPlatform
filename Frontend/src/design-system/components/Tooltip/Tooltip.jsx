import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import './Tooltip.css';

/**
 * Tooltip — Hover tooltip with position variants.
 */
export function Tooltip({
  children,
  content,
  position = 'top',
  disabled = false,
  className = '',
}) {
  const [visible, setVisible] = useState(false);

  if (!content || disabled) return <>{children}</>;

  return (
    <span
      className={cn('ds-tooltip-wrap', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className={cn('ds-tooltip-content', `ds-tooltip-content--${position}`)}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}

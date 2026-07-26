import React from 'react';
import { cn } from '../../utils/cn';
import './Badge.css';

/**
 * Badge — Pill-shaped label for status, difficulty, tags.
 *
 * @param {'default'|'brand'|'success'|'warning'|'error'|'info'|'easy'|'medium'|'hard'|'solved'|'tag'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} dot - show colored dot
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) {
  return (
    <span
      className={cn('ds-badge', `ds-badge--${variant}`, `ds-badge--${size}`, className)}
      {...props}
    >
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

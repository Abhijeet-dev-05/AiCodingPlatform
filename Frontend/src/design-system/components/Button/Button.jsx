import React from 'react';
import { cn } from '../../utils/cn';
import './Button.css';

/**
 * Button — Professional button with variants, sizes, loading, and icons.
 *
 * @param {'primary'|'secondary'|'ghost'|'outline'|'danger'|'success'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {boolean} fullWidth
 * @param {React.ReactNode} leftIcon
 * @param {React.ReactNode} rightIcon
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  as: Tag = 'button',
  ...props
}) {
  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      className={cn(
        'ds-btn',
        `ds-btn--${variant}`,
        `ds-btn--${size}`,
        loading && 'ds-btn--loading',
        (disabled || loading) && 'ds-btn--disabled',
        fullWidth && 'ds-btn--full-width',
        className
      )}
      onClick={onClick}
      disabled={Tag === 'button' ? (disabled || loading) : undefined}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="ds-btn__spinner" aria-hidden="true" />}
      {!loading && leftIcon && <span className="ds-btn__icon-left" aria-hidden="true">{leftIcon}</span>}
      <span className="ds-btn__text">{children}</span>
      {!loading && rightIcon && <span className="ds-btn__icon-right" aria-hidden="true">{rightIcon}</span>}
    </Tag>
  );
}

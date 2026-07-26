import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import './Input.css';

/**
 * Input — Professional form input with label, icon, error/success states.
 */
export const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    success = false,
    disabled = false,
    required = false,
    leftIcon,
    rightIcon,
    hint,
    className = '',
    id,
    textarea = false,
    rows = 4,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const Tag = textarea ? 'textarea' : 'input';

  return (
    <div className={cn('ds-input-wrapper', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('ds-input-label', required && 'ds-input-label--required')}
        >
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {label}
        </label>
      )}

      <div className="ds-input-field-wrap">
        {!label && leftIcon && (
          <span className="ds-input-icon-left" aria-hidden="true">{leftIcon}</span>
        )}
        {label && leftIcon && (
          <span className="ds-input-icon-left" style={{ top: textarea ? '16px' : undefined, transform: textarea ? 'none' : undefined }} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <Tag
          ref={ref}
          id={inputId}
          type={textarea ? undefined : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          rows={textarea ? rows : undefined}
          className={cn(
            'ds-input',
            textarea && 'ds-textarea',
            leftIcon && 'ds-input--has-left',
            rightIcon && 'ds-input--has-right',
            error && 'ds-input--error',
            success && !error && 'ds-input--success'
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {rightIcon && (
          <span className="ds-input-icon-right" aria-hidden="true">{rightIcon}</span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="ds-input-error-msg" role="alert">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" fill="none"/>
            <path d="M6 3.5v3M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="ds-input-hint">{hint}</p>
      )}
    </div>
  );
});

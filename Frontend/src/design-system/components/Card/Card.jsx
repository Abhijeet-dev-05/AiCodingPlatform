import React from 'react';
import { cn } from '../../utils/cn';
import './Card.css';

/**
 * Card — Surface container with optional hover, glass, and glow effects.
 */
export function Card({
  children,
  hoverable = false,
  clickable = false,
  glass = false,
  glow = false,
  padding = 'md',
  onClick,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'ds-card',
        `ds-card--pad-${padding}`,
        hoverable && 'ds-card--hoverable',
        clickable && 'ds-card--clickable',
        glass && 'ds-card--glass',
        glow && 'ds-card--glow',
        className
      )}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, title, subtitle, actions, className = '' }) {
  if (title || subtitle || actions) {
    return (
      <div className={cn('ds-card__header', className)}>
        <div>
          {title && <h3 className="ds-card__title">{title}</h3>}
          {subtitle && <p className="ds-card__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="ds-card__header-actions">{actions}</div>}
      </div>
    );
  }
  return <div className={cn('ds-card__header', className)}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={cn('ds-card__body', className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return <div className={cn('ds-card__footer', className)}>{children}</div>;
};

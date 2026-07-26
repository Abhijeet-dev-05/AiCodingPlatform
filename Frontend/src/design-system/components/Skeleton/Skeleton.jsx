import React from 'react';
import { cn } from '../../utils/cn';
import './Skeleton.css';

/**
 * Skeleton — Shimmer placeholder for loading states.
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  style = {},
  ...props
}) {
  return (
    <div
      className={cn('ds-skeleton', `ds-skeleton--${variant}`, className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

/** Skeleton for a stat card */
Skeleton.StatCard = function SkeletonStatCard() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px', background: 'var(--ds-bg-elevated)', borderRadius: 'var(--ds-radius-xl)', border: '1px solid var(--ds-border)' }}>
      <Skeleton variant="circle" width={44} height={44} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <Skeleton variant="heading" width="50%" />
        <Skeleton variant="text" width="70%" />
      </div>
    </div>
  );
};

/** Skeleton for a problem table row */
Skeleton.ProblemRow = function SkeletonProblemRow() {
  return (
    <div className="ds-skeleton-problem-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <Skeleton variant="text" width={24} height={14} />
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="rect" width={56} height={22} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton variant="rect" width={56} height={22} />
        <Skeleton variant="rect" width={70} height={22} />
      </div>
    </div>
  );
};

/** Multiple problem row skeletons */
Skeleton.ProblemList = function SkeletonProblemList({ count = 7 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton.ProblemRow key={i} />
      ))}
    </div>
  );
};

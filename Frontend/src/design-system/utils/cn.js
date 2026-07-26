/**
 * Utility to merge class names conditionally.
 * Usage: cn('base', isActive && 'active', disabled && 'disabled')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

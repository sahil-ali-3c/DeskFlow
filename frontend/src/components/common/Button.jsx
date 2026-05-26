import React from 'react';
import Spinner from './Spinner';

/**
 * Reusable button component
 * @param {{
 *   children: React.ReactNode,
 *   variant: 'primary' | 'danger' | 'ghost',
 *   size: 'sm' | 'md',
 *   loading: boolean,
 *   disabled: boolean,
 *   onClick: Function,
 *   type: string,
 *   className: string
 * }} props
 */
export default function Button({
  children,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}

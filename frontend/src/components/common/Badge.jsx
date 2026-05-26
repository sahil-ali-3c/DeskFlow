import React from 'react';

/**
 * Colored pill badge component
 * @param {{ label: string, color: string, variant: 'filled' | 'outline' }} props
 */
export default function Badge({ label, color, variant = 'filled' }) {
  const style =
    variant === 'filled'
      ? { backgroundColor: color, color: '#fff' }
      : { border: `1px solid ${color}`, color };

  return (
    <span className={`badge badge-${variant}`} style={style}>
      {label}
    </span>
  );
}

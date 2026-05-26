import React from 'react';

/**
 * Pure CSS spinner component
 * @param {{ size: 'sm' | 'md' | 'lg' }} props
 */
export default function Spinner({ size = 'md' }) {
  return <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />;
}

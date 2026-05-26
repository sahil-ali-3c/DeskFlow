import React, { useEffect } from 'react';

const TYPE_STYLES = {
  success: {
    bg: 'rgba(34, 197, 94, 0.15)',
    border: 'rgba(34, 197, 94, 0.4)',
    color: '#22c55e',
    icon: '✓'
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
    icon: '✕'
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    color: '#3b82f6',
    icon: 'ℹ'
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
    color: '#f59e0b',
    icon: '⚠'
  }
};

/**
 * Fixed position toast notification
 * @param {{
 *   message: string,
 *   type: 'success' | 'error' | 'info' | 'warning',
 *   visible: boolean,
 *   onClose: Function
 * }} props
 */
export default function Toast({ message, type = 'info', visible, onClose }) {
  const styles = TYPE_STYLES[type] || TYPE_STYLES.info;

  if (!visible) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 2000,
        animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '400px',
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          background: styles.bg,
          border: `1px solid ${styles.border}`,
          borderRadius: '10px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: styles.color,
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            flexShrink: 0
          }}
        >
          {styles.icon}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#f1f5f9',
            lineHeight: 1.4
          }}
        >
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: '#94a3b8',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            flexShrink: 0,
            transition: 'all 150ms ease'
          }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

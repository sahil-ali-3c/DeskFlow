import React from 'react';
import Button from '../common/Button';

/**
 * App header with logo and create ticket button
 * @param {{ onCreateClick: Function }} props
 */
export default function Header({ onCreateClick }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
              <path d="M9 11h14M9 16h10M9 21h7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="23" cy="21" r="3" fill="#fff" opacity="0.8" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="header-title">DeskFlow</h1>
            <p className="header-subtitle">Support Ticket Triage</p>
          </div>
        </div>
        <Button variant="primary" onClick={onCreateClick}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Create Ticket
        </Button>
      </div>
    </header>
  );
}

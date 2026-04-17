import React from 'react';

export function EmptyState({ icon = '📦', title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 32px', textAlign: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.5 }}>{icon}</div>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: 8, fontSize: '1.1rem' }}>{title}</h3>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 300, marginBottom: action ? 24 : 0 }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

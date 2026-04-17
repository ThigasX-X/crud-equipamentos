import React from 'react';

const config = {
  MONITOR: { label: 'Monitor', icon: '🖥️', color: '#818CF8', bg: 'rgba(129,140,248,0.12)' },
  CPU: { label: 'CPU', icon: '🖳', color: '#38BDF8', bg: 'rgba(56,189,248,0.12)' },
  KEYBOARD: { label: 'Teclado', icon: '⌨️', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
};

export function TypeBadge({ type }) {
  const { label, icon, color, bg } = config[type] || { label: type, icon: '📦', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '100px',
      background: bg, color, fontSize: '0.75rem', fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: '0.85rem' }}>{icon}</span>
      {label}
    </span>
  );
}

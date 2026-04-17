import React from 'react';

const config = {
  ACTIVE: { label: 'Ativo', color: '#10B981', bg: 'rgba(16,185,129,0.12)', dot: '#10B981' },
  MAINTENANCE: { label: 'Manutenção', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', dot: '#F59E0B' },
};

export function StatusBadge({ status }) {
  const { label, color, bg, dot } = config[status] || { label: status, color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', dot: '#94A3B8' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '3px 10px', borderRadius: '100px',
      background: bg, color, fontSize: '0.75rem', fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

import React, { useState, useRef, useEffect } from 'react';

export function ExportMenu({ onExportCsv, onExportJson }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handle = async (type, fn) => {
    setLoading(type);
    try { await fn(); } finally { setLoading(''); setOpen(false); }
  };

  const menuItemStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', cursor: 'pointer', fontSize: '0.875rem',
    color: 'var(--text-primary)', background: 'transparent', border: 'none',
    width: '100%', textAlign: 'left', transition: 'background var(--transition)',
    borderRadius: 'var(--radius-sm)',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 16px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)', background: 'var(--bg-elevated)',
        color: 'var(--text-primary)', cursor: 'pointer',
        fontSize: '0.875rem', fontWeight: 500, transition: 'var(--transition)',
      }}>
        <span>⬇</span> Exportar <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▼</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
          minWidth: 160, zIndex: 50, padding: '4px',
          animation: 'fadeIn 0.1s ease',
        }}>
          <button
            onClick={() => handle('csv', onExportCsv)}
            disabled={!!loading}
            style={menuItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span>📄</span> {loading === 'csv' ? 'Gerando...' : 'Exportar CSV'}
          </button>
          <button
            onClick={() => handle('json', onExportJson)}
            disabled={!!loading}
            style={menuItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span>🗂</span> {loading === 'json' ? 'Gerando...' : 'Exportar JSON'}
          </button>
        </div>
      )}
    </div>
  );
}

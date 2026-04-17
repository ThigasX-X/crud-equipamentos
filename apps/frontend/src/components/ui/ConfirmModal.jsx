import React from 'react';

export function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 32px',
        maxWidth: 400, width: '90%', boxShadow: 'var(--shadow-lg)',
        animation: 'fadeIn 0.15s ease',
      }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 8, fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: '0.875rem', transition: 'var(--transition)',
          }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            padding: '8px 20px', borderRadius: 'var(--radius-md)', border: 'none',
            background: 'var(--danger)', color: '#fff', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600, transition: 'var(--transition)',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Removendo...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

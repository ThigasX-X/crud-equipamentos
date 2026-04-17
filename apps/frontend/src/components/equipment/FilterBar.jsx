import React from 'react';

const inputStyle = {
  padding: '9px 14px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)', background: 'var(--bg-elevated)',
  color: 'var(--text-primary)', fontSize: '0.875rem',
  outline: 'none', transition: 'border-color var(--transition)',
};

export function FilterBar({ filters, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Buscar por nome..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{ ...inputStyle, minWidth: 200, flex: 1 }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />
      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        style={{ ...inputStyle, minWidth: 140 }}
      >
        <option value="">Todos os tipos</option>
        <option value="MONITOR">Monitor</option>
        <option value="CPU">CPU</option>
        <option value="KEYBOARD">Teclado</option>
      </select>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        style={{ ...inputStyle, minWidth: 160 }}
      >
        <option value="">Todos os status</option>
        <option value="ACTIVE">Ativo</option>
        <option value="MAINTENANCE">Manutenção</option>
      </select>
      {(filters.search || filters.type || filters.status) && (
        <button
          onClick={() => onChange({ search: '', type: '', status: '' })}
          style={{
            padding: '9px 14px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem',
            transition: 'var(--transition)', whiteSpace: 'nowrap',
          }}
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}

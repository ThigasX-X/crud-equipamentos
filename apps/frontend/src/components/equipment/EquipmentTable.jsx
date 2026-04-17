import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../ui/StatusBadge';
import { TypeBadge } from '../ui/TypeBadge';
import { EmptyState } from '../ui/EmptyState';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function EquipmentTable({ equipments, onDelete }) {
  const navigate = useNavigate();

  if (equipments.length === 0) {
    return (
      <EmptyState
        icon="🖥️"
        title="Nenhum equipamento encontrado"
        description="Adicione seu primeiro ativo ou ajuste os filtros aplicados."
        action={
          <button onClick={() => navigate('/equipment/new')} style={{
            padding: '10px 20px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent)', border: 'none', color: '#0F172A',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
          }}>
            + Novo Ativo
          </button>
        }
      />
    );
  }

  const thStyle = {
    padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem',
    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase',
    letterSpacing: '0.04em', whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--border)',
  };

  const tdStyle = {
    padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
        <thead style={{ background: 'var(--bg-elevated)' }}>
          <tr>
            <th style={thStyle}>Nome</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Aquisição</th>
            <th style={thStyle}>Status</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {equipments.map((eq, i) => (
            <tr key={eq.id}
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background var(--transition)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)')}
            >
              <td style={tdStyle}>
                <span style={{ fontWeight: 500 }}>{eq.name}</span>
              </td>
              <td style={tdStyle}><TypeBadge type={eq.type} /></td>
              <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{formatDate(eq.acquisitionDate)}</td>
              <td style={tdStyle}><StatusBadge status={eq.status} /></td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => navigate(`/equipment/${eq.id}/edit`)}
                    style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => { e.target.style.color = 'var(--accent)'; e.target.style.borderColor = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border)'; }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(eq)}
                    style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => { e.target.style.color = 'var(--danger)'; e.target.style.borderColor = 'var(--danger)'; }}
                    onMouseLeave={(e) => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)'; }}
                  >
                    Remover
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

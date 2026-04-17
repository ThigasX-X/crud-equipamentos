import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEquipments } from '../hooks/useEquipments';
import { FilterBar } from '../components/equipment/FilterBar';
import { EquipmentTable } from '../components/equipment/EquipmentTable';
import { ExportMenu } from '../components/equipment/ExportMenu';
import { ConfirmModal } from '../components/ui/ConfirmModal';

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-md)',
        background: color ? `${color}1a` : 'var(--accent-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem', flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { equipments, loading, error, filters, setFilters, stats, removeEquipment, exportCsv, exportJson } = useEquipments();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try { await removeEquipment(deleteTarget.id); } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div style={{ padding: '32px', height: '100%', animation: 'fadeIn 0.25s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            Ativos de TI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Gerencie o inventário de equipamentos da instituição
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <ExportMenu onExportCsv={exportCsv} onExportJson={exportJson} />
          <button onClick={() => navigate('/equipment/new')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 18px', borderRadius: 'var(--radius-md)',
            border: 'none', background: 'var(--accent)', color: '#0F172A',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
            transition: 'var(--transition)',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
          >
            + Novo Ativo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon="📦" label="Total de Ativos" value={stats.total} />
        <StatCard icon="✅" label="Ativos" value={stats.active} color="#10B981" />
        <StatCard icon="🔧" label="Em Manutenção" value={stats.maintenance} color="#F59E0B" />
        <StatCard icon="🖥️" label="Monitores" value={stats.monitors} color="#818CF8" />
        <StatCard icon="💻" label="CPUs" value={stats.cpus} color="#38BDF8" />
        <StatCard icon="⌨️" label="Teclados" value={stats.keyboards} color="#A78BFA" />
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 20,
      }}>
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Carregando equipamentos...</p>
          </div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
        ) : (
          <EquipmentTable equipments={equipments} onDelete={setDeleteTarget} />
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Remover Equipamento"
        message={`Tem certeza que deseja remover "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      {/* Mobile FAB */}
      <button onClick={() => navigate('/equipment/new')} style={{
        display: 'none', position: 'fixed', bottom: 24, right: 24,
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--accent)', border: 'none', color: '#0F172A',
        fontSize: '1.5rem', cursor: 'pointer', zIndex: 90,
        boxShadow: '0 4px 20px rgba(245,158,11,0.4)', alignItems: 'center', justifyContent: 'center',
      }} className="fab">
        +
      </button>

      <style>{`
        @media (max-width: 768px) {
          .fab { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

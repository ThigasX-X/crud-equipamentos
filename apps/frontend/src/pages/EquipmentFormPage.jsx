import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { equipmentService } from '../services/equipmentService';

const TYPES = [
  { value: 'MONITOR', label: 'Monitor' },
  { value: 'CPU', label: 'CPU' },
  { value: 'KEYBOARD', label: 'Teclado' },
];

const STATUSES = [
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'MAINTENANCE', label: 'Em Manutenção' },
];

const fieldStyle = {
  display: 'flex', flexDirection: 'column', gap: 6,
};

const labelStyle = {
  fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: '0.04em',
};

const inputStyle = (hasError) => ({
  padding: '11px 14px', borderRadius: 'var(--radius-md)',
  border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`,
  background: 'var(--bg-elevated)', color: 'var(--text-primary)',
  fontSize: '0.9rem', outline: 'none', transition: 'border-color var(--transition)',
  width: '100%',
});

function validate(form) {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Nome é obrigatório';
  if (!form.type) errors.type = 'Tipo é obrigatório';
  if (!form.acquisitionDate) errors.acquisitionDate = 'Data de aquisição é obrigatória';
  if (!form.status) errors.status = 'Status é obrigatório';
  return errors;
}

export function EquipmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [form, setForm] = useState({ name: '', type: '', acquisitionDate: '', status: 'ACTIVE' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    setFetchLoading(true);
    equipmentService.getById(id)
      .then((data) => setForm({
        name: data.name,
        type: data.type,
        acquisitionDate: data.acquisitionDate,
        status: data.status,
      }))
      .catch(() => { setApiError('Equipamento não encontrado'); })
      .finally(() => setFetchLoading(false));
  }, [id, isEditing]);

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (touched[key]) {
      const e = validate({ ...form, [key]: value });
      setErrors((p) => ({ ...p, [key]: e[key] }));
    }
  };

  const blur = (key) => {
    setTouched((p) => ({ ...p, [key]: true }));
    const e = validate(form);
    setErrors((p) => ({ ...p, [key]: e[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, type: true, acquisitionDate: true, status: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setApiError('');
    try {
      if (isEditing) { await equipmentService.update(id, form); }
      else { await equipmentService.create(form); }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message;
      setApiError(Array.isArray(msg) ? msg.join(', ') : msg || 'Erro ao salvar equipamento');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: 640, animation: 'fadeIn 0.25s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'transparent', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontSize: '0.875rem', marginBottom: 16, padding: 0,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Voltar ao dashboard
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {isEditing ? 'Editar Ativo' : 'Novo Ativo'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {isEditing ? 'Atualize as informações do equipamento' : 'Preencha os dados do novo equipamento'}
        </p>
      </div>

      {/* Form */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px',
      }}>
        {apiError && (
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--danger-subtle)', border: '1px solid var(--danger)',
            color: 'var(--danger)', fontSize: '0.875rem', marginBottom: 24,
          }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Nome */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome do Equipamento *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              onBlur={() => blur('name')}
              placeholder="Ex: Monitor Dell 24"
              style={inputStyle(touched.name && errors.name)}
              onFocus={(e) => { if (!errors.name || !touched.name) e.target.style.borderColor = 'var(--accent)'; }}
            />
            {touched.name && errors.name && (
              <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{errors.name}</span>
            )}
          </div>

          {/* Tipo e Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo *</label>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                onBlur={() => blur('type')}
                style={inputStyle(touched.type && errors.type)}
              >
                <option value="">Selecionar tipo</option>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {touched.type && errors.type && (
                <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{errors.type}</span>
              )}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Status *</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                onBlur={() => blur('status')}
                style={inputStyle(touched.status && errors.status)}
              >
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {touched.status && errors.status && (
                <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{errors.status}</span>
              )}
            </div>
          </div>

          {/* Data de Aquisição */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Data de Aquisição *</label>
            <input
              type="date"
              value={form.acquisitionDate}
              onChange={(e) => set('acquisitionDate', e.target.value)}
              onBlur={() => blur('acquisitionDate')}
              style={{ ...inputStyle(touched.acquisitionDate && errors.acquisitionDate), colorScheme: 'dark' }}
            />
            {touched.acquisitionDate && errors.acquisitionDate && (
              <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{errors.acquisitionDate}</span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={() => navigate('/dashboard')} style={{
              padding: '10px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem',
            }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{
              padding: '10px 28px', borderRadius: 'var(--radius-md)',
              border: 'none', background: 'var(--accent)', color: '#0F172A',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
              opacity: loading ? 0.7 : 1, transition: 'var(--transition)',
            }}>
              {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Equipamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

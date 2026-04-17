import { useState, useEffect, useCallback } from 'react';
import { equipmentService } from '../services/equipmentService';

export function useEquipments() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '', search: '' });

  const fetchEquipments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      const data = await equipmentService.getAll(params);
      setEquipments(data);
    } catch (err) {
      setError('Erro ao carregar equipamentos');
    } finally {
      setLoading(false);
    }
  }, [filters.type, filters.status]);

  useEffect(() => { fetchEquipments(); }, [fetchEquipments]);

  const filteredEquipments = equipments.filter((eq) => {
    if (!filters.search) return true;
    return eq.name.toLowerCase().includes(filters.search.toLowerCase());
  });

  const createEquipment = async (data) => {
    await equipmentService.create(data);
    await fetchEquipments();
  };

  const updateEquipment = async (id, data) => {
    await equipmentService.update(id, data);
    await fetchEquipments();
  };

  const removeEquipment = async (id) => {
    await equipmentService.remove(id);
    await fetchEquipments();
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = async () => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    const blob = await equipmentService.exportCsv(params);
    downloadFile(blob, 'equipamentos.csv');
  };

  const exportJson = async () => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.status) params.status = filters.status;
    const blob = await equipmentService.exportJson(params);
    downloadFile(blob, 'equipamentos.json');
  };

  const stats = {
    total: equipments.length,
    active: equipments.filter((e) => e.status === 'ACTIVE').length,
    maintenance: equipments.filter((e) => e.status === 'MAINTENANCE').length,
    monitors: equipments.filter((e) => e.type === 'MONITOR').length,
    cpus: equipments.filter((e) => e.type === 'CPU').length,
    keyboards: equipments.filter((e) => e.type === 'KEYBOARD').length,
  };

  return {
    equipments: filteredEquipments,
    loading, error, filters, setFilters, stats,
    createEquipment, updateEquipment, removeEquipment,
    exportCsv, exportJson, refetch: fetchEquipments,
  };
}

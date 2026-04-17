import api from './api';

export const equipmentService = {
  getAll: (filters = {}) => api.get('/equipments', { params: filters }).then((r) => r.data.data),
  getById: (id) => api.get(`/equipments/${id}`).then((r) => r.data),
  create: (data) => api.post('/equipments', data).then((r) => r.data),
  update: (id, data) => api.put(`/equipments/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/equipments/${id}`),
  exportCsv: (filters = {}) =>
    api.get('/equipments/export/csv', { params: filters, responseType: 'blob' }).then((r) => r.data),
  exportJson: (filters = {}) =>
    api.get('/equipments/export/json', { params: filters, responseType: 'blob' }).then((r) => r.data),
};

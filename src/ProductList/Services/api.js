import { axiosInstance } from '../../Authentication/api/axiosInstance';

export const inventoryApi = {
  getProducts: (params) => axiosInstance.get('/v1/inventory', { params }),
  getFilters: () => axiosInstance.get('/v1/inventory/filters'),
  deleteProduct: (id) => axiosInstance.delete(`/v1/inventory/${id}`),
  updateProduct: (id, data) => axiosInstance.put(`/v1/inventory/${id}`, data), // NEW
  exportCsv: () => axiosInstance.get('/v1/inventory/export', { responseType: 'blob' })
};
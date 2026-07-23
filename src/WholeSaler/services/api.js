import { axiosInstance } from '../../Authentication/api/axiosInstance';

export const productApi = {
  searchMasterProducts: (query) => 
    axiosInstance.get('/v1/products/master/search', { params: { q: query } }),
    
  saveBulkProducts: (productsData) => 
    axiosInstance.post('/v1/products/seller/bulk', productsData),
};
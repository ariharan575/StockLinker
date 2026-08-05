import { axiosInstance } from '../../Authentication/api/axiosInstance'; 

export const compareApi = {
  searchMasterProducts: (query) => 
    axiosInstance.get('/v1/products/master/search', { params: { q: query } }),

  getCompareData: (masterProductId, qty) => 
    axiosInstance.get(`/v1/compare/${masterProductId}`, { params: { qty } }),
    
  submitEnquiry: (data) => 
    axiosInstance.post('/v1/compare/enquiry', data)
};
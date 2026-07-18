import { axiosInstance } from '../api/axiosInstance';

export const authApi = {
  guestLogin: () => 
    axiosInstance.post('/auth/guest/login'),
  
  phoneLogin: (idToken) => 
    axiosInstance.post('/auth/phone/login', { idToken }),
  
  selectRole: (role) => 
    axiosInstance.post('/auth/role/select', { role }),
  
  refresh: () => 
    axiosInstance.post('/auth/refresh'),
  
  logout: () => 
    axiosInstance.post('/auth/logout'),
};

export const onboardingApi = {
  getCategories: () => 
    axiosInstance.get('/v1/onboarding/categories'),

  saveBusiness: (data) => 
    axiosInstance.post('/v1/onboarding/step1/business', data),
  
  saveAddress: (data) => 
    axiosInstance.post('/v1/onboarding/step2/address', data),
    
  saveMarketplace: (data) => 
    axiosInstance.post('/v1/onboarding/step3/marketplace', data),
};
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
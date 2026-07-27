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


// --- NEW SETTINGS PROFILE API ---
export const profileApi = {
  getProfile: () => axiosInstance.get('/v1/profile'),
  updateAccount: (data) => axiosInstance.put('/v1/profile/account', data),
  updateBusiness: (data) => axiosInstance.put('/v1/profile/business', data),
  updateDelivery: (data) => axiosInstance.put('/v1/profile/delivery', data),
};

export const networkApi = {
  getNearbySellers: (filters = {}) => axiosInstance.get('/v1/network/nearby', { params: filters }),
  getConnectedSuppliers: () => axiosInstance.get('/v1/network/connected'),
  getPendingRequests: () => axiosInstance.get('/v1/network/requests'),
  requestConnection: (partnerId) => axiosInstance.post(`/v1/network/connect/${partnerId}`),
  acceptConnection: (connectionId) => axiosInstance.post(`/v1/network/connect/accept/${connectionId}`),
  announceArrival: () => axiosInstance.post('/v1/network/announce') // Call this right after onboarding
};


export const storefrontApi = {
  getProfile: (businessProfileId) => 
    axiosInstance.get(`/v1/storefront/${businessProfileId}/profile`),
  getProducts: (businessProfileId, params) => 
    axiosInstance.get(`/v1/storefront/${businessProfileId}/products`, { params }),
  getFilters: (businessProfileId) => 
    axiosInstance.get(`/v1/storefront/${businessProfileId}/filters`)
};

export const orderApi = {
  placeOrder: (data) => axiosInstance.post('/v1/orders', data),

  getOrders: (status, role) => axiosInstance.get('/v1/orders', { 
    params: { status: status === 'all' ? null : status, role: role } 
  }),

  acceptAndSchedule: (orderId, deliveryDate) => 
    axiosInstance.post(`/v1/orders/${orderId}/accept`, { deliveryDate }),

  rejectOrder: (orderId, reason) => 
    axiosInstance.post(`/v1/orders/${orderId}/reject`, { reason }),

  getOrdersByDate: (date) => 
    axiosInstance.get('/v1/orders/by-date', { params: { date } }),

  updateRouteSequence: (deliveryDate, orderedOrderIds) => 
    axiosInstance.put('/v1/orders/route/sequence', { deliveryDate, orderedOrderIds }),

  startRouteForDate: (date) => 
    axiosInstance.post('/v1/orders/route/start', null, { params: { date } }),

  markDelivered: (orderId) => 
    axiosInstance.post(`/v1/orders/${orderId}/deliver`),

  getDeliveryRoute: (orderId) => 
    axiosInstance.get(`/v1/orders/${orderId}/route`)
};


export const compareApi = {
  getCompareData: (masterProductId, qty) => 
    axiosInstance.get(`/v1/compare/${masterProductId}`, { params: { qty } }),
    
  submitEnquiry: (data) => 
    axiosInstance.post('/v1/compare/enquiry', data)
};
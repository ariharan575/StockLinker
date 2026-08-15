import { axiosInstance } from '../../auth/api/axiosInstance';

export const productApi = {
  searchMasterProducts: (query) => 
    axiosInstance.get('/v1/products/master/search', { params: { q: query } }),
    
  saveBulkProducts: (productsData) => 
    axiosInstance.post('/v1/products/seller/bulk', productsData),
};

export const enquiryApi = {
  getRelevantEnquiries: async () => {
    try {
      const response = await axiosInstance.get('/v1/enquiries/relevant');
      return response.data;
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      throw error;
    }
  },
  
  // ✅ FIX: Added deliveryDate as a parameter and passed it in the request body
  acceptEnquiry: async (enquiryId, deliveryDate) => {
    try {
      const response = await axiosInstance.post(`/v1/enquiries/${enquiryId}/accept`, { 
        deliveryDate 
      });
      return response.data;
    } catch (error) {
      console.error("Error accepting enquiry:", error);
      throw error;
    }
  }
};

export const orderApi = {
  getReorderSummary: async () => {
    try {
      const response = await axiosInstance.get('/v1/orders/reorder-summary');
      return response.data;
    } catch (error) {
      console.error("Error fetching reorder summary:", error);
      throw error;
    }
  },
  // 🚀 NEW: Fetch Top 5 Orders for Wholesaler Dashboard
  getDashboardOrders: async () => {
    try {
      const response = await axiosInstance.get('/v1/orders/dashboard-orders');
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard orders:", error);
      throw error;
    }
  }
};


export const networkApi = {
  // Existing: Used for the full page
  getNearbySellers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axiosInstance.get(`/v1/network/nearby?${params.toString()}`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching nearby sellers:", error);
      throw error;
    }
  },

  // 🚀 NEW: Fetches exactly 10 buyers for the dashboard widget
  getDashboardNearbyBuyers: async () => {
    try {
      const response = await axiosInstance.get('/v1/network/nearby/dashboard');
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching dashboard nearby buyers:", error);
      throw error;
    }
  },

  getConnectedSuppliers: async () => {
    try {
      const response = await axiosInstance.get('/v1/network/connected');
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching connected suppliers:", error);
      throw error;
    }
  },

  sendConnectionRequest: async (partnerId) => {
    try {
      const response = await axiosInstance.post(`/v1/network/connect/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error("Error sending connection request:", error);
      throw error;
    }
  },

  acceptConnection: async (connectionId) => {
    try {
      const response = await axiosInstance.post(`/v1/network/connect/accept/${connectionId}`);
      return response.data;
    } catch (error) {
      console.error("Error accepting connection:", error);
      throw error;
    }
  }
};
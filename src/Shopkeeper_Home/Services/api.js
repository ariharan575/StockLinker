import { axiosInstance } from '../../Authentication/api/axiosInstance';

/**
 * Enterprise API Service for Category Management
 */
export const categoryApi = {
  /**
   * Fetches all active categories along with their subcategories and seller count.
   * @returns {Promise<Array>} List of CategoryDTO objects
   */
  getAllCategories: async () => {
    try {
      // Make sure this matches your Spring Boot endpoint
      const response = await axiosInstance.get('/v1/categories');
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
};

export const compareApi = {
  getFeaturedComparisons: async () => {
    try {
      const response = await axiosInstance.get('/v1/compare/featured');
      return response.data;
    } catch (error) {
      console.error("Error fetching featured comparisons:", error);
      throw error;
    }
  },
  
  // ADD THIS NEW METHOD
  getDashboardHighlight: async () => {
    try {
      const response = await axiosInstance.get('/v1/compare/dashboard-highlight');
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard highlight:", error);
      throw error;
    }
  }
};


export const networkApi = {
  // Fetch nearby suppliers filtered by user's district
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

  // Fetch accepted connected suppliers network
  getConnectedSuppliers: async () => {
    try {
      const response = await axiosInstance.get('/v1/network/connected');
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching connected suppliers:", error);
      throw error;
    }
  },

  // Send a connection request to a partner ID
  sendConnectionRequest: async (partnerId) => {
    try {
      const response = await axiosInstance.post(`/v1/network/connect/${partnerId}`);
      return response.data;
    } catch (error) {
      console.error("Error sending connection request:", error);
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
  }
};

export const dashboardApi = {
  getWelcomeInfo: async () => {
    try {
      const response = await axiosInstance.get('/v1/dashboard/welcome');
      return response.data;
    } catch (error) {
      console.error("Error fetching welcome info:", error);
      throw error;
    }
  },
  globalSearch: async (query) => {
    try {
      const response = await axiosInstance.get(`/v1/dashboard/search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error("Error performing global search:", error);
      throw error;
    }
  }
};

export const notificationApi = {
  getNotifications: () => axiosInstance.get('/v1/notifications'),
  markAsRead: (id) => axiosInstance.put(`/v1/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/v1/notifications/read-all')
};
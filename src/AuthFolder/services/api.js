import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
        }
        
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
// Auth API calls - make sure these endpoints exist
export const authApi = {
  phoneLogin: (idToken, deviceId) => 
    api.post('/auth/phone/login', { idToken }, {
      headers: { 'X-Device-Id': deviceId }
    }),
  
  guestLogin: (deviceId) => 
    api.post('/auth/guest/login', {}, {
      headers: { 'X-Device-Id': deviceId }
    }),
  
  refreshToken: () => 
    api.post('/auth/refresh', {}),
  
  logout: () => 
    api.post('/auth/logout', {}),
  
  logoutAll: () => 
    api.post('/auth/logout-all', {}),
  
  // ✅ Make sure this points to the correct endpoint
  selectRole: (role) => 
    api.post(`/user/role/select?role=${role}`, {}),
  
  getUserInfo: () => 
    api.get('/user/me'),
};

export default api;
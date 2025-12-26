import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  // Auth endpoints
  auth = {
    login: async (credentials) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    
    register: async (userData) => {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    },
    
    getCurrentUser: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },

    updateProfile: async (profileData) => {
      const response = await apiClient.put('/auth/profile', profileData);
      return response.data;
    },
    
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return Promise.resolve();
    },
  };
  
  // Issues endpoints
  issues = {
    getAll: async () => {
      const response = await apiClient.get('/issues');
      return response.data;
    },
    
    getById: async (id) => {
      const response = await apiClient.get(`/issues/${id}`);
      return response.data;
    },
    
    create: async (issueData) => {
      const response = await apiClient.post('/issues', issueData);
      return response.data;
    },
    
    update: async (id, issueData) => {
      const response = await apiClient.put(`/issues/${id}`, issueData);
      return response.data;
    },
    
    delete: async (id) => {
      const response = await apiClient.delete(`/issues/${id}`);
      return response.data;
    },
  };
  
  // Generic methods for custom requests
  get = (url, config = {}) => apiClient.get(url, config);
  post = (url, data, config = {}) => apiClient.post(url, data, config);
  put = (url, data, config = {}) => apiClient.put(url, data, config);
  delete = (url, config = {}) => apiClient.delete(url, config);
}

// Export singleton instance
const api = new ApiService();
export default api;

// Export axios instance for direct use if needed
export { apiClient };

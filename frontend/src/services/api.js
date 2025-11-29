import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Attendance API - UPDATED WITH ALL FEATURES
export const attendanceAPI = {
  // Basic punch in/out
  punchIn: (data) => api.post('/attendance/punch-in', data),
  punchOut: (data) => api.post('/attendance/punch-out', data),
  
  // Get attendance records
  getAttendance: (params) => api.get('/attendance', { params }),
  getAttendanceById: (id) => api.get(`/attendance/${id}`),
  
  // Edit/Delete functionality
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
  deleteAttendance: (id, data) => api.delete(`/attendance/${id}`, { data }),
  
  // Admin specific routes
  getAllAttendance: (params) => api.get('/attendance/admin/all', { params }),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Plants API
export const plantsAPI = {
  getPlants: (params) => api.get('/plants', { params }),
  getPlant: (id) => api.get(`/plants/${id}`),
  createPlant: (data) => api.post('/plants', data),
  updatePlant: (id, data) => api.put(`/plants/${id}`, data),
  deletePlant: (id) => api.delete(`/plants/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyResetToken: (token) => api.get(`/auth/verify-reset-token/${token}`),
};

export default api;
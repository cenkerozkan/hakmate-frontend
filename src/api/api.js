import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token'ı otomatik eklemek için interceptor:
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthAPI = {
  getMe: () => axiosInstance.get('/auth/me'),
  signIn: (data) => axiosInstance.post('/auth/signin', data),
  signUp: (data) => axiosInstance.post('/auth/signup', data),
  signOut: () => axiosInstance.post('/auth/signout'),
};

export const LawOfficesAPI = {
  // Supabase'den yakındaki hukuk bürolarını getir
  getNearbyOffices: (lat, lng, radius = 5) => 
    axiosInstance.get('/law-offices/nearby', {
      params: { lat, lng, radius }
    }),

  // Google'dan yakındaki hukuk bürolarını getir
  getNearbyOfficesFromGoogle: (lat, lng, radius = 5) => 
    axiosInstance.get('/law-offices/nearby-google', {
      params: { lat, lng, radius }
    }),

  // Tüm hukuk bürolarını getir
  getAllOffices: () => 
    axiosInstance.get('/law-offices'),
};

export default axiosInstance;
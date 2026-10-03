import axiosInstance from './axios';
import Cookies from 'js-cookie';

export const authApi = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email?token=${token}`),
  resendVerification: (email) => axiosInstance.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => axiosInstance.post('/auth/reset-password', { token, newPassword }),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),
  logout: () => {
    // Clear cookies on logout
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    return axiosInstance.post('/auth/logout');
  },
  getProfile: () => axiosInstance.get('/auth/profile'),
  
  // Helper functions for cookie management
  getToken: () => Cookies.get('access_token'),
  getUser: () => {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user) => {
    Cookies.set('user', JSON.stringify(user), { 
      secure: true, 
      sameSite: 'strict',
      expires: 7 
    });
  },
  isAuthenticated: () => !!Cookies.get('access_token'),
};

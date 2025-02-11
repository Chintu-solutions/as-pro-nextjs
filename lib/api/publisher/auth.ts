import axios from '@/lib/config/axios';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await axios.post<any>('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      localStorage.setItem('publisherToken', response.data.token);
      axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      localStorage.setItem('publisherUser', JSON.stringify(response.data.publisher));
    }
    return response.data;
  },

  register: async (credentials: { 
    name: string; 
    email: string; 
    password: string;
  }) => {
    const response = await axios.post<any>('/auth/signup', credentials);
    return response.data;
  },

  verifyEmail: async (data: { email: string; code: string }) => {
    const response = await axios.post<any>('/auth/verify-email', data);
    return response.data;
  },

  resendVerificationCode: async (email: string): Promise<any> => {
    const response = await axios.post<any>('/auth/resend-code', { email });
    return response.data;
  },
  
    // Verify Reset Password Code
    verifyPasswordCode: async (data: { email: string; code: string }) => {
      const response = await axios.post<Response>('/auth/verify-code', data);
      return response.data;
    },
  forgotPassword: async (email: string) => {
    const response = await axios.post<any>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: { email: string; code: string; newPassword: string }) => {
    const response = await axios.post<any>('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await axios.put<any>('/auth/password', data);
    return response.data;
  },

  verifyAuth: async () => {
    const response = await axios.get<any>('/auth/verify');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('publisherToken');
    localStorage.removeItem('publisherUser');
    delete axios.defaults.headers.common.Authorization;
  },

  getUser: (): any | null => {
    const user = localStorage.getItem('publisherUser');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem('publisherToken'),

  isAuthenticated: () => !!localStorage.getItem('publisherToken')
};
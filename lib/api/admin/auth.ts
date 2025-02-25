import axios from '@/lib/config/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface VerifyCodeData {
  email: string;
  code: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailData {
  newEmail: string;
  password: string;
}

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  [key: string]: any;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AdminUser;
}

export const authApi = {
  // Authentication Methods
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/login', credentials);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('adminToken', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user));
    }
    return response.data;
  },

  verifyCode: async (data: VerifyCodeData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/verify', data);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('adminToken', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user));
    }
    return response.data;
  },

  // Password Management Methods
  forgotPassword: async (email: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/forgot-password', { email });
    return response.data;
  },

  verifyPasswordCode: async (data: VerifyCodeData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/verify', data);
    return response.data;
  },

  resetPassword: async (data: { email: string; code: string; newPassword: string }): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/reset-password', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/change-password', data);
    return response.data;
  },

  // Email Management Methods
  requestEmailChange: async (data: ChangeEmailData): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/email/request-change', data);
    return response.data;
  },

  confirmEmailChange: async (data: { code: string }): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>('/admins/email/confirm-change', data);
    const { user } = response.data;
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user));
    }
    return response.data;
  },

  // Authentication Status Methods
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return false;

      const response = await axios.get<AuthResponse>('/admins/auth');
      return response.data.success;
    } catch (error) {
      return false;
    }
  },

  // Session Management Methods
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common.Authorization;
  },

  getUser: (): AdminUser | null => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('adminToken');
  },

  // Initialize auth state from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }
};
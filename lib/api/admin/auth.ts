// lib/api/auth.ts
import axios from '@/lib/config/axios';

export const authApi = {
 login: async (credentials: { email: string; password: string }) => {
   const response = await axios.post<any>('/admins/login', credentials);
   const { token, user } = response.data;
   localStorage.setItem('adminToken', token);
   axios.defaults.headers.common.Authorization = `Bearer ${token}`;
   localStorage.setItem('adminUser', JSON.stringify(user));
   return response.data;
 },

 verifyCode: async (data: { email: string; code: string }) => {
   const response = await axios.post<any>('/admins/verify-code', data);
   const { token, user } = response.data;
   localStorage.setItem('adminToken', token);
   axios.defaults.headers.common.Authorization = `Bearer ${token}`;
   localStorage.setItem('adminUser', JSON.stringify(user));
   return response.data;
 },

 getProfile: async () => {
   const response = await axios.get<any>('/admins/profile');
   localStorage.setItem('adminUser', JSON.stringify(response.data));
   return response.data;
 },

 updateProfile: async (data: Partial<any>) => {
   const response = await axios.put<any>('/admins/profile', data);
   localStorage.setItem('adminUser', JSON.stringify(response.data));
   return response.data;
 },

 logout: () => {
   localStorage.removeItem('adminToken');
   localStorage.removeItem('adminUser'); 
   delete axios.defaults.headers.common.Authorization;
 },

 getUser: (): any | null => {
   const user = localStorage.getItem('adminUser');
   return user ? JSON.parse(user) : null;
 },

 getToken: () => localStorage.getItem('adminToken'),

 isAuthenticated: () => !!localStorage.getItem('adminToken')
};
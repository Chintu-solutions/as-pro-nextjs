// lib/config/socket.ts
import { io } from 'socket.io-client';

export const initializeAdminSocket = (token: string) => {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    auth: {
      token: `Bearer ${token}`
    }
  });

  socket.on('connect', () => {
    console.log('Admin socket connected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};
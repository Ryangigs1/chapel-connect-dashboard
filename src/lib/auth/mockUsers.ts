
import { User } from './types';
import { encryptData } from '@/utils/encryption';

// Admin verification key - In a real app, this would be on the server
export const ADMIN_SECRET_KEY = "MTU_ADMIN_SECRET_2023";

// Mock users for demonstration
export const mockUsers = [
  {
    id: '1',
    name: 'Dr. Adebayo Oladele',
    email: 'admin@mtu.edu.ng',
    password: 'password',
    role: 'admin',
    avatarUrl: '/avatar1.png',
    adminToken: encryptData('admin_token_123') // Encrypted admin token
  },
  {
    id: '2',
    name: 'Chaplain Emmanuel',
    email: 'chaplain@mtu.edu.ng',
    password: 'password',
    role: 'chaplain',
    avatarUrl: '/avatar2.png'
  }
];


import { User } from './types';
import { encryptData } from '@/utils/encryption';

// Admin secret key for authentication
export const ADMIN_SECRET_KEY = 'MTU_ADMIN_2023';

// Mock users for demonstration
export const mockUsers = [
  {
    id: '2',
    name: 'Chaplain Emmanuel',
    email: 'chaplain@mtu.edu.ng',
    password: 'password',
    role: 'chaplain',
    avatarUrl: '/avatar2.png'
  }
];

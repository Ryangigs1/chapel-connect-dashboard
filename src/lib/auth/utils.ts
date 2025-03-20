
import { toast } from '@/components/ui/use-toast';
import { encryptData, decryptData } from '@/utils/encryption';
import { User } from './types';
import { ADMIN_SECRET_KEY } from './mockUsers';

export const storeUserInLocalStorage = (user: Omit<User, 'password'>): void => {
  const encryptedUser = encryptData(user);
  localStorage.setItem('mtu_user', encryptedUser);
};

export const getUserFromLocalStorage = (): User | null => {
  const storedUser = localStorage.getItem('mtu_user');
  if (!storedUser) return null;
  
  try {
    // Decrypt the stored user data
    const encryptedData = storedUser;
    const decryptedData = decryptData(encryptedData);
    
    if (decryptedData) {
      return decryptedData;
    } else {
      // Invalid stored user data, remove it
      localStorage.removeItem('mtu_user');
      return null;
    }
  } catch (error) {
    // Invalid stored user data, remove it
    localStorage.removeItem('mtu_user');
    return null;
  }
};

export const verifyAdminAccess = (user: User | null, token: string): boolean => {
  if (!user || user.role !== 'admin') return false;
  
  try {
    // In a real app, this would be a server-side verification
    return token === ADMIN_SECRET_KEY;
  } catch (error) {
    return false;
  }
};

export const showSuccessToast = (title: string, description: string) => {
  toast({
    title,
    description,
  });
};

export const showErrorToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive"
  });
};

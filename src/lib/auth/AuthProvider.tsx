import { createContext, useContext, useState, useEffect } from 'react';
import { initSecurity } from '@/utils/encryption';
import { AuthContextType, User } from './types';
import { mockUsers } from './mockUsers';
import { 
  storeUserInLocalStorage, 
  getUserFromLocalStorage, 
  showSuccessToast,
  showErrorToast
} from './utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      initSecurity();
    }
  }, []);

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      const lastVisit = localStorage.getItem('mtu_last_visit');
      const now = new Date().toISOString();
      
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const today = new Date();
        
        if (lastDate.toDateString() !== today.toDateString()) {
          setTimeout(() => {
            showSuccessToast("Welcome back!", `Good to see you again, ${storedUser.name}!`);
          }, 1000);
        }
      }
      
      localStorage.setItem('mtu_last_visit', now);
    }
    setLoading(false);
    
    setTimeout(() => {
      setInitialLoadComplete(true);
    }, 300);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser || foundUser.password !== password) {
      showErrorToast("Authentication failed", "Invalid email or password.");
      throw new Error('Invalid credentials');
    }
    
    const { password: _, ...userWithoutPassword } = foundUser;
    
    storeUserInLocalStorage(userWithoutPassword);
    
    setUser(userWithoutPassword);
    
    localStorage.setItem('mtu_last_visit', new Date().toISOString());
    
    showSuccessToast("Welcome back!", `Signed in as ${userWithoutPassword.name}`);
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockUsers.some(u => u.email === email)) {
      showErrorToast("Registration failed", "Email already in use.");
      throw new Error('Email already in use');
    }
    
    const newUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      password,
      role: 'user',
      avatarUrl: '/avatar-default.png',
    };
    
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    storeUserInLocalStorage(userWithoutPassword);
    
    setUser(userWithoutPassword);
    
    localStorage.setItem('mtu_last_visit', new Date().toISOString());
    
    showSuccessToast("Registration successful", `Welcome, ${name}!`);
  };

  const signOut = async (): Promise<void> => {
    localStorage.removeItem('mtu_user');
    setUser(null);
    showSuccessToast("Signed out", "You have been signed out successfully.");
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <div className={`transition-opacity duration-500 ${initialLoadComplete ? 'opacity-100' : 'opacity-0'}`}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </div>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

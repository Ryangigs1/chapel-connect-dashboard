
import { createContext, useContext, useState, useEffect } from 'react';
import { initSecurity } from '@/utils/encryption';
import { AuthContextType, User } from './types';
import { mockUsers, ADMIN_SECRET_KEY } from './mockUsers';
import { 
  storeUserInLocalStorage, 
  getUserFromLocalStorage, 
  verifyAdminAccess,
  showSuccessToast,
  showErrorToast
} from './utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initialize security measures
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      initSecurity();
    }
  }, []);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setUser(storedUser);
      // Show welcome back message
      const lastVisit = localStorage.getItem('mtu_last_visit');
      const now = new Date().toISOString();
      
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const today = new Date();
        
        // If last visit was not today
        if (lastDate.toDateString() !== today.toDateString()) {
          setTimeout(() => {
            showSuccessToast("Welcome back!", `Good to see you again, ${storedUser.name}!`);
          }, 1000);
        }
      }
      
      localStorage.setItem('mtu_last_visit', now);
    }
    setLoading(false);
    
    // Set a timeout to show we're done with initial load
    setTimeout(() => {
      setInitialLoadComplete(true);
    }, 300);
  }, []);
  
  // Sign in function - modified to support admin key
  const signIn = async (email: string, password: string, adminKey?: string): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser || foundUser.password !== password) {
      showErrorToast("Authentication failed", "Invalid email or password.");
      throw new Error('Invalid credentials');
    }
    
    // If user is admin and adminKey is provided, verify it
    if (foundUser.role === 'admin' && adminKey) {
      if (adminKey !== ADMIN_SECRET_KEY) {
        showErrorToast("Admin verification failed", "Invalid admin key provided.");
        throw new Error('Invalid admin key');
      }
    } else if (foundUser.role === 'admin' && !adminKey) {
      // If user is admin but no admin key provided
      showErrorToast("Admin verification failed", "Admin key required for administrator access.");
      throw new Error('Admin key required');
    }
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store user in localStorage
    storeUserInLocalStorage(userWithoutPassword);
    
    // Update state
    setUser(userWithoutPassword);
    
    // Store last visit time
    localStorage.setItem('mtu_last_visit', new Date().toISOString());
    
    showSuccessToast("Welcome back!", `Signed in as ${userWithoutPassword.name}`);
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      showErrorToast("Registration failed", "Email already in use.");
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      password,
      role: 'user',
      avatarUrl: '/avatar-default.png', // Adding default avatar URL
    };
    
    // Add to mock users (this is just for demo)
    mockUsers.push(newUser);
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Store user in localStorage
    storeUserInLocalStorage(userWithoutPassword);
    
    // Update state
    setUser(userWithoutPassword);
    
    // Store last visit time
    localStorage.setItem('mtu_last_visit', new Date().toISOString());
    
    showSuccessToast("Registration successful", `Welcome, ${name}!`);
  };
  
  // Sign out function
  const signOut = async (): Promise<void> => {
    // Remove user from localStorage
    localStorage.removeItem('mtu_user');
    
    // Update state
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
    verifyAdminAccess: (token: string) => verifyAdminAccess(user, token),
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

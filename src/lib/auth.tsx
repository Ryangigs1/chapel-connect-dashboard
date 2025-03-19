
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { encryptData, decryptData, initSecurity } from '@/utils/encryption';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  adminToken?: string; // Encrypted admin token
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, adminKey?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  verifyAdminAccess: (token: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin verification key - In a real app, this would be on the server
const ADMIN_SECRET_KEY = "MTU_ADMIN_SECRET_2023";

// Mock users for demonstration
const mockUsers = [
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize security measures
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      initSecurity();
    }
  }, []);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('mtu_user');
    if (storedUser) {
      try {
        // Decrypt the stored user data
        const encryptedData = storedUser;
        const decryptedData = decryptData(encryptedData);
        
        if (decryptedData) {
          setUser(decryptedData);
        } else {
          // Invalid stored user data, remove it
          localStorage.removeItem('mtu_user');
        }
      } catch (error) {
        // Invalid stored user data, remove it
        localStorage.removeItem('mtu_user');
      }
    }
    setLoading(false);
  }, []);
  
  // Verify admin access token
  const verifyAdminAccess = (token: string): boolean => {
    if (!user || user.role !== 'admin') return false;
    
    try {
      // In a real app, this would be a server-side verification
      return token === ADMIN_SECRET_KEY;
    } catch (error) {
      return false;
    }
  };
  
  // Sign in function - modified to support admin key
  const signIn = async (email: string, password: string, adminKey?: string): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (!foundUser || foundUser.password !== password) {
      toast({
        title: "Authentication failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
      throw new Error('Invalid credentials');
    }
    
    // Check admin key if user is an admin
    if (foundUser.role === 'admin' && adminKey) {
      if (adminKey !== ADMIN_SECRET_KEY) {
        toast({
          title: "Admin verification failed",
          description: "Invalid admin key provided.",
          variant: "destructive"
        });
        throw new Error('Invalid admin key');
      }
    }
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Encrypt and store user in localStorage
    const encryptedUser = encryptData(userWithoutPassword);
    localStorage.setItem('mtu_user', encryptedUser);
    
    // Update state
    setUser(userWithoutPassword);
    
    toast({
      title: "Welcome back!",
      description: `Signed in as ${userWithoutPassword.name}`,
    });
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use.",
        variant: "destructive"
      });
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
    
    // Encrypt and store user in localStorage
    const encryptedUser = encryptData(userWithoutPassword);
    localStorage.setItem('mtu_user', encryptedUser);
    
    // Update state
    setUser(userWithoutPassword);
    
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });
  };
  
  // Sign out function
  const signOut = async (): Promise<void> => {
    // Remove user from localStorage
    localStorage.removeItem('mtu_user');
    
    // Update state
    setUser(null);
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    verifyAdminAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

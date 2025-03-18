
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Mock user type - this would typically come from your API
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  role: 'student' | 'staff' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a mock auth implementation
// In a real app, this would be replaced with actual API calls
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    profileImage: null,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'staff',
    profileImage: null,
  },
];

const AUTH_STORAGE_KEY = 'chapel_connect_auth';

// Helper functions to handle local storage
const saveToLocalStorage = (user: User) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

const clearLocalStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const getFromLocalStorage = (): User | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    return null;
  }
};

// Create a mock auth service
export const auth = {
  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<User> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // In a real app, you would verify the password here
    // This is just a mock implementation
    
    // Save to local storage
    saveToLocalStorage(user);
    
    return user;
  },
  
  // Sign up a new user
  signUp: async (email: string, password: string, name: string): Promise<User> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email is already in use
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create a new user
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      name,
      email,
      role: 'student',
      profileImage: null,
    };
    
    // In a real app, you would store this in a database
    mockUsers.push(newUser);
    
    // Save to local storage
    saveToLocalStorage(newUser);
    
    return newUser;
  },
  
  // Sign out the current user
  signOut: async (): Promise<void> => {
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear from local storage
    clearLocalStorage();
  },
  
  // Get the current user
  getCurrentUser: (): User | null => {
    return getFromLocalStorage();
  },
};

// Create the auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const user = await auth.signIn(email, password);
      setUser(user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const user = await auth.signUp(email, password, name);
      setUser(user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "You've been signed out successfully",
      });
      navigate('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

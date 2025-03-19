
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Dr. Adebayo Oladele',
    email: 'admin@mtu.edu.ng',
    password: 'password',
    role: 'admin',
    avatarUrl: '/avatar1.png'
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

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('mtu_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // Invalid stored user data, remove it
        localStorage.removeItem('mtu_user');
      }
    }
    setLoading(false);
  }, []);
  
  // Sign in function - now returns void to match interface
  const signIn = async (email: string, password: string): Promise<void> => {
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
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Store user in localStorage
    localStorage.setItem('mtu_user', JSON.stringify(userWithoutPassword));
    
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
    };
    
    // Add to mock users (this is just for demo)
    mockUsers.push(newUser);
    
    // Create user object without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Store user in localStorage
    localStorage.setItem('mtu_user', JSON.stringify(userWithoutPassword));
    
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

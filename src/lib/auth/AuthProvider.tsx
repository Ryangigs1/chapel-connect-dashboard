
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthContextType, User } from './types';
import { 
  showSuccessToast,
  showErrorToast
} from './utils';
import { auth } from '../firebase';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  formatUser 
} from '../firebase/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(formatUser(firebaseUser));
        const lastVisit = localStorage.getItem('mtu_last_visit');
        const now = new Date().toISOString();
        
        if (lastVisit) {
          const lastDate = new Date(lastVisit);
          const today = new Date();
          
          if (lastDate.toDateString() !== today.toDateString()) {
            setTimeout(() => {
              showSuccessToast("Welcome back!", `Good to see you again, ${firebaseUser.displayName || 'User'}!`);
            }, 1000);
          }
        }
        
        localStorage.setItem('mtu_last_visit', now);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
      
      setTimeout(() => {
        setInitialLoadComplete(true);
      }, 300);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const user = await signInWithEmail(email, password);
      
      localStorage.setItem('mtu_last_visit', new Date().toISOString());
      
      showSuccessToast("Welcome back!", `Signed in as ${user.name}`);
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "Invalid email or password.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account exists with this email. Please sign up.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      showErrorToast("Authentication failed", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    try {
      setLoading(true);
      await signUpWithEmail(email, password, name);
      
      localStorage.setItem('mtu_last_visit', new Date().toISOString());
      
      showSuccessToast("Registration successful", `Welcome, ${name}!`);
    } catch (error: any) {
      console.error("Sign up error:", error);
      let errorMessage = "Email already in use or invalid.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please provide a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/password accounts are not enabled. Please contact support.";
      }
      
      showErrorToast("Registration failed", errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutUser();
      showSuccessToast("Signed out", "You have been signed out successfully.");
    } catch (error) {
      showErrorToast("Error signing out", "Please try again later.");
      console.error("Error signing out:", error);
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

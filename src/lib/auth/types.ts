
export interface User {
  id: string;  // Firebase UID
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  providerData?: string;
  department?: string;
  level?: string;
  matricNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, matricNumber?: string, department?: string, level?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; matricNumber?: string; department?: string; level?: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  adminToken?: string; // Encrypted admin token
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, adminKey?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  verifyAdminAccess: (token: string) => boolean;
}

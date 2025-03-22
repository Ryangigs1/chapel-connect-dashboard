
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  forgotPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ADMIN_SECRET_KEY } from '@/lib/auth/mockUsers';

const AdminSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // For development purposes - showing the admin credentials in console
  console.log("Admin credentials for testing:", {
    email: "admin@mtu.edu.ng",
    password: "password",
    adminKey: ADMIN_SECRET_KEY
  });

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !adminKey) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including the Admin Security Key",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      // Pass adminKey to signIn method for verification
      await signIn(email, password, adminKey);
      
      // Check if email contains admin to verify it's an admin account
      if (!email.includes('admin')) {
        toast({
          title: "Access Denied",
          description: "This is not an administrator account",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin panel",
      });
      
      // Navigate to the admin dashboard after successful sign-in
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error("Admin sign in error:", error);
      toast({
        title: "Authentication Failed",
        description: "Invalid credentials or admin key",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse-subtle [animation-delay:1s]"></div>
      </div>
      
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg border animate-fade-up">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl mb-4 animate-scale-in">
            A
          </div>
          <h1 className="text-2xl font-bold animate-fade-up [animation-delay:200ms]">Administrator Access</h1>
          <p className="text-muted-foreground mt-2 animate-fade-up [animation-delay:300ms]">
            Secure login for system administrators
          </p>
        </div>

        <form onSubmit={handleAdminSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative animate-fade-up [animation-delay:400ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Admin Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            <div className="relative animate-fade-up [animation-delay:500ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            
            <div className="relative animate-fade-up [animation-delay:600ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="adminKey"
                name="adminKey"
                type={showAdminKey ? "text" : "password"}
                placeholder="Admin Security Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowAdminKey(!showAdminKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showAdminKey ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full animate-fade-up [animation-delay:700ms]"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Access Admin Panel"}
            </Button>
            
            <div className="text-center text-sm">
              <Link to="/sign-in" className="text-primary hover:text-primary/80 transition-colors">
                Return to regular login
              </Link>
            </div>
          </div>
        </form>
      </div>
      
      {/* Faratech.inc watermark */}
      <div className="fixed bottom-4 right-4 text-sm text-muted-foreground/60 font-medium animate-fade-in [animation-delay:1s]">
        Faratech.inc
      </div>
    </div>
  );
};

export default AdminSignIn;

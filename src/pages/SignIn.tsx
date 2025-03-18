
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Get the intended destination from location state, or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      toast({
        title: "Success",
        description: "You've been signed in successfully",
      });
      // Navigate to the home page after successful sign-in
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description: "Please check your credentials and try again",
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
            C
          </div>
          <h1 className="text-2xl font-bold animate-fade-up [animation-delay:200ms]">Sign in to Chapel Connect</h1>
          <p className="text-muted-foreground mt-2 animate-fade-up [animation-delay:300ms]">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative animate-fade-up [animation-delay:400ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
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
          </div>

          <div className="flex items-center justify-between animate-fade-up [animation-delay:600ms]">
            <div className="text-sm">
              <Link to="/sign-up" className="text-primary hover:text-primary/80 transition-colors">
                Don't have an account? Sign up
              </Link>
            </div>
            <div className="text-sm">
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full animate-fade-up [animation-delay:700ms]"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
      
      {/* Faratech.inc watermark */}
      <div className="fixed bottom-4 right-4 text-sm text-muted-foreground/60 font-medium animate-fade-in [animation-delay:1s]">
        Faratech.inc
      </div>
    </div>
  );
};

export default SignIn;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, LockKeyhole, Mail, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name);
      toast({
        title: "Account created",
        description: "You've been signed up successfully",
      });
      navigate('/');
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Error creating account",
        description: "Please try again with a different email",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
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
          <h1 className="text-2xl font-bold animate-fade-up [animation-delay:200ms]">Create your account</h1>
          <p className="text-muted-foreground mt-2 animate-fade-up [animation-delay:300ms]">
            Sign up to access Chapel Connect
          </p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative animate-fade-up [animation-delay:400ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            <div className="relative animate-fade-up [animation-delay:500ms]">
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
            
            <div className="relative animate-fade-up [animation-delay:600ms]">
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
            
            <div className="relative animate-fade-up [animation-delay:700ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          <div className="text-sm animate-fade-up [animation-delay:800ms]">
            <Link to="/sign-in" className="text-primary hover:text-primary/80 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full animate-fade-up [animation-delay:900ms]"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </div>
      
      <div className="fixed bottom-4 right-4 text-sm text-muted-foreground/60 font-medium animate-fade-in [animation-delay:1s]">
        Faratech.inc
      </div>
    </div>
  );
};

export default SignUp;

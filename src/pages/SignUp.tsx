import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Eye, EyeOff, LockKeyhole, Mail, User, BookOpen, BookText, Backpack } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Separator } from "@/components/ui/separator";

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name, matricNumber, department, level);
      
      sonnerToast.success("Account created successfully", {
        description: "You can now sign in with your credentials",
        duration: 5000
      });
      
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setMatricNumber('');
      setDepartment('');
      setLevel('');
      
      // After successful signup, redirect to sign-in page
      navigate('/sign-in');
    } catch (error: unknown) {
      console.error("Sign up error:", error);

      // Display error message to the user
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle(); // Ensure this function is correctly implemented in your `useAuth` hook
      // Redirect will be handled by the useEffect
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Google sign in failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
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
            Sign up to access Mtu Chapel Connect
          </p>
        </div>

        {/* Google Sign-in Button */}
        
        
        <div className="relative animate-fade-up [animation-delay:400ms]">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative animate-fade-up [animation-delay:450ms]">
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
            
            <div className="relative animate-fade-up [animation-delay:550ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Backpack className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="matricNumber"
                name="matricNumber"
                type="text"
                placeholder="Matric Number (Optional)"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative animate-fade-up [animation-delay:575ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="department"
                name="department"
                type="text"
                placeholder="Department (Optional)"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative animate-fade-up [animation-delay:600ms]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookText className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="level"
                name="level"
                type="text"
                placeholder="Level e.g. 300L (Optional)"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative animate-fade-up [animation-delay:625ms]">
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
            
            <div className="relative animate-fade-up [animation-delay:650ms]">
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

          <div className="text-sm animate-fade-up [animation-delay:700ms]">
            <Link to="/sign-in" className="text-primary hover:text-primary/80 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full animate-fade-up [animation-delay:750ms]"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up with Email"}
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

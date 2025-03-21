
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Smartphone, Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function TwoFactorDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"app" | "email">("app");
  const [otp, setOtp] = useState("");
  const [setup, setSetup] = useState(false);
  const { toast } = useToast();
  
  const handleEnableSubmit = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStep(2);
    setLoading(false);
  };
  
  const handleVerifySubmit = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSetup(true);
    setStep(3);
    setLoading(false);
  };
  
  const handleFinish = () => {
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been enabled for your account.",
    });
    setOpen(false);
    setStep(1);
    setOtp("");
  };

  const handleDisable = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSetup(false);
    setLoading(false);
    setOpen(false);
    
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled for your account.",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Shield className="h-4 w-4 mr-2" />
          Two-Factor Authentication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {setup 
              ? "Manage your two-factor authentication settings"
              : "Add an extra layer of security to your account"
            }
          </DialogDescription>
        </DialogHeader>
        
        {setup ? (
          <div className="space-y-4 py-4">
            <Alert>
              <AlertDescription>
                Two-factor authentication is currently enabled for your account.
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleDisable} variant="destructive" className="w-full">
              {loading ? "Disabling..." : "Disable 2FA"}
            </Button>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="space-y-4 py-4">
                <Tabs defaultValue="app" onValueChange={(v) => setMethod(v as "app" | "email")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="app">Authenticator App</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="app" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app like Google Authenticator, Authy, or 1Password to get verification codes.
                      </p>
                    </div>
                    
                    <div className="flex justify-center py-4">
                      <div className="w-40 h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg">
                        <Smartphone className="h-20 w-20 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <Button onClick={handleEnableSubmit} disabled={loading} className="w-full">
                      {loading ? "Setting up..." : "Continue"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="email" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="" placeholder="Enter your email address" />
                      <p className="text-sm text-muted-foreground">
                        We'll send a verification code to this email when you sign in.
                      </p>
                    </div>
                    
                    <Button onClick={handleEnableSubmit} disabled={loading} className="w-full">
                      {loading ? "Setting up..." : "Continue"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Enter verification code</h3>
                  <p className="text-sm text-muted-foreground">
                    {method === "app" 
                      ? "Enter the 6-digit code from your authenticator app" 
                      : "Enter the 6-digit code sent to your email"
                    }
                  </p>
                </div>
                
                <div className="flex justify-center py-4">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)} 
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerifySubmit} 
                    disabled={loading || otp.length !== 6} 
                    className="flex-1"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">Setup Complete</h3>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication has been enabled for your account.
                  </p>
                </div>
                
                <Button onClick={handleFinish} className="w-full">
                  Done
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

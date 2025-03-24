import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Clock } from '@/components/Clock';
import { PasswordChangeDialog } from '@/components/PasswordChangeDialog';
import { TwoFactorDialog } from '@/components/TwoFactorDialog';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Lock,
  Save,
  XCircle,
  Download,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { encryptData, decryptData } from '@/utils/encryption';
import { exportUserDataToCsv } from '@/utils/exportUserData';
import { initEventNotifications } from '@/utils/eventNotification';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    level: '',
    matricNumber: '',
    address: '',
    emergencyContact: '',
    bio: ''
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    serviceReminders: true,
    absenceAlerts: true,
    showProfileInDirectory: true,
    allowChaplainContact: true
  });
  
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  
  // Initialize event notifications
  useEffect(() => {
    const cleanupNotifications = initEventNotifications();
    return () => cleanupNotifications();
  }, []);
  
  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setFetchError(false);
        
        const userDocRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Check if it's a Google user
          setIsGoogleUser(user.providerData === 'google.com');
          
          // Check if profile is complete for Google users
          if (user.providerData === 'google.com') {
            const isComplete = !!(data.matricNumber && data.department && data.level);
            setProfileComplete(isComplete);
            
            if (!isComplete) {
              toast({
                title: "Profile Incomplete",
                description: "Please complete your profile information, such as Matric Number, Department, and Level.",
                variant: "destructive"
              });
            }
          }
          
          // Set form data from Firestore
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: data.phone || '',
            department: user.department || data.department || '',
            level: user.level || data.level || '',
            matricNumber: user.matricNumber || data.matricNumber || '',
            address: data.address || '',
            emergencyContact: data.emergencyContact || '',
            bio: data.bio || 'I am a dedicated student with focus on academic excellence and spiritual growth.'
          });
          
          // Set settings if available
          if (data.settings) {
            setSettings(data.settings);
          }
        } else {
          // Use data from user object if no document exists
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: '',
            department: user.department || '',
            level: user.level || '',
            matricNumber: user.matricNumber || '',
            address: '',
            emergencyContact: '',
            bio: 'I am a dedicated student with focus on academic excellence and spiritual growth.'
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      // Update user profile in Firebase
      await updateProfile({
        name: formData.name,
        matricNumber: formData.matricNumber,
        department: formData.department,
        level: formData.level
      });
      
      // Save form data and settings
      const profileData = {
        ...formData,
        settings
      };
      
      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      // Update profile completion status for Google users
      if (isGoogleUser) {
        const isComplete = !!(formData.matricNumber && formData.department && formData.level);
        setProfileComplete(isComplete);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Could not save your profile data",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    setEditing(false);
    // Reset form data to stored values
    if (userData) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: userData.phone || '',
        department: userData.department || '',
        level: userData.level || '',
        matricNumber: userData.matricNumber || '',
        address: userData.address || '',
        emergencyContact: userData.emergencyContact || '',
        bio: userData.bio || 'I am a dedicated student with focus on academic excellence and spiritual growth.'
      });
      
      if (userData.settings) {
        setSettings(userData.settings);
      }
    }
    
    toast({
      title: "Edits cancelled",
      description: "Changes have been discarded"
    });
  };
  
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };
  
  const handleDownloadData = () => {
    // Prepare data for export
    const userDataForExport = {
      name: formData.name,
      email: formData.email,
      role: user?.role || 'student',
      department: formData.department,
      level: formData.level,
      matricNumber: formData.matricNumber,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      lastLogin: new Date().toISOString()
    };
    
    exportUserDataToCsv(userDataForExport);
    
    toast({
      title: "Data downloaded",
      description: "Your profile data has been exported to CSV"
    });
  };
  
  // Show different content based on user role
  const isStudent = user?.role === 'student' || user?.role === 'user';
  
  // Calculate attendance stats based on the user's data
  const totalServices = 24;
  const absences = userData?.absences || 0;
  const attended = totalServices - absences;
  const attendancePercentage = Math.round((attended / totalServices) * 100);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-2xl font-bold animate-fade-up text-foreground">
              My Profile
            </h1>
          </div>
          
          <Clock />
        </div>
        
        {isGoogleUser && !profileComplete && (
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300">
                  Your profile is incomplete
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Please update your profile with your Matric Number, Department, and Level information.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-card">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-1 text-foreground">{user?.name}</h2>
                  <p className="text-muted-foreground mb-4">
                    {formData.matricNumber || (isStudent ? 'No Matric Number' : user?.role)}
                  </p>
                  
                  <div className="w-full space-y-2">
                    {isGoogleUser && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Using Google profile picture
                      </p>
                    )}
                    
                    {!editing ? (
                      <Button 
                        variant="default" 
                        className="w-full" 
                        size="sm"
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          className="flex-1" 
                          size="sm"
                          onClick={handleCancel}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          className="flex-1" 
                          size="sm"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {isStudent && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Level</p>
                          <p className="font-medium text-foreground">{formData.level || 'Not set'}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    {isStudent && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium text-foreground">{formData.department || 'Not set'}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Account Type</p>
                        <p className="font-medium text-foreground capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center text-foreground">
                    <Lock className="h-4 w-4 mr-2 text-primary" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <PasswordChangeDialog />
                  <TwoFactorDialog />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="profile" className="text-foreground">Profile Info</TabsTrigger>
                  {isStudent && (
                    <TabsTrigger value="chapel" className="text-foreground">Chapel Record</TabsTrigger>
                  )}
                  <TabsTrigger value="settings" className="text-foreground">Account Settings</TabsTrigger>
                </TabsList>
                



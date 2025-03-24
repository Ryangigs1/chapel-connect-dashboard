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
import { mockStudents } from '@/utils/mockData';
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
                variant: "warning"
              });
            }
          }
          
          // Set form data from Firestore
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: data.phone || '',
            department: data.department || '',
            level: data.level || '',
            matricNumber: data.matricNumber || '',
            address: data.address || '',
            emergencyContact: data.emergencyContact || '',
            bio: data.bio || 'I am a dedicated student with focus on academic excellence and spiritual growth.'
          });
          
          // Set settings if available
          if (data.settings) {
            setSettings(data.settings);
          }
        } else {
          // Use default values if no document exists
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: '',
            department: user.department || '',
            level: user.level || '',
            matricNumber: '',
            address: '',
            emergencyContact: '',
            bio: 'I am a dedicated student with focus on academic excellence and spiritual growth.'
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Could not load your profile data",
          variant: "destructive"
        });
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
              
              <TabsContent value="profile" className="space-y-6 mt-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="text-foreground"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          disabled={true}
                          className="text-foreground"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="text-foreground"
                        />
                      </div>
                      
                      {isStudent && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="level" className="text-foreground">Level</Label>
                            <Input 
                              id="level" 
                              name="level" 
                              value={formData.level} 
                              onChange={handleInputChange}
                              disabled={!editing}
                              className="text-foreground"
                              placeholder="e.g. 300L"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="department" className="text-foreground">Department</Label>
                            <Input 
                              id="department" 
                              name="department" 
                              value={formData.department} 
                              onChange={handleInputChange}
                              disabled={!editing}
                              className="text-foreground"
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="matricNumber" className="text-foreground">Matric Number</Label>
                            <Input 
                              id="matricNumber" 
                              name="matricNumber" 
                              value={formData.matricNumber} 
                              onChange={handleInputChange}
                              disabled={!editing}
                              className="text-foreground"
                              placeholder="e.g. MTU/2020/0001"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    
                    {isStudent && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-foreground">Hostel Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleInputChange}
                            disabled={!editing}
                            className="text-foreground"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact" className="text-foreground">Emergency Contact</Label>
                          <Input 
                            id="emergencyContact" 
                            name="emergencyContact" 
                            value={formData.emergencyContact} 
                            onChange={handleInputChange}
                            disabled={!editing}
                            className="text-foreground"
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-foreground">Bio</Label>
                      <Input 
                        id="bio" 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="text-foreground"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    {editing && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={handleCancel}
                          className="text-foreground"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {isStudent && (
                <TabsContent value="chapel" className="space-y-6 mt-6">
                  <Card className="bg-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">Chapel Attendance Record</CardTitle>
                      <CardDescription>
                        Your chapel attendance summary
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card className="bg-card shadow-sm">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground mb-1">Total Services</div>
                              <div className="text-2xl font-bold text-foreground">24</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card shadow-sm">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground mb-1">Attended</div>
                              <div className="text-2xl font-bold text-foreground">
                                {24 - (mockUser?.absences || 0)}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card shadow-sm">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground mb-1">Absences</div>
                              <div className="text-2xl font-bold text-red-500">
                                {mockUser?.absences || 0}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-card shadow-sm">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground mb-1">Percentage</div>
                              <div className="text-2xl font-bold text-foreground">
                                {Math.round(((24 - (mockUser?.absences || 0)) / 24) * 100)}%
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <Card className="bg-card shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-foreground">Recent Attendance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...Array(5)].map((_, i) => {
                                const date = new Date();
                                date.setDate(date.getDate() - i * 3);
                                const attended = i !== 1;
                                
                                return (
                                  <div key={i} className="flex justify-between items-center py-2 border-b">
                                    <div>
                                      <p className="font-medium text-foreground">
                                        {i === 0 ? 'Sunday Service' : 
                                         i === 1 ? 'Morning Prayer' : 
                                         i === 2 ? 'Evening Service' : 
                                         i === 3 ? 'Bible Study' : 'Sunday Service'}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {date.toLocaleDateString()} • {
                                          i === 0 ? '9:00 AM' : 
                                          i === 1 ? '6:00 AM' : 
                                          i === 2 ? '6:30 PM' : 
                                          i === 3 ? '4:00 PM' : '9:00 AM'
                                        }
                                      </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-sm ${
                                      attended ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                      {attended ? 'Present' : 'Absent'}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="settings" className="space-y-6 mt-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Theme & Appearance</h3>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div>
                          <p className="text-sm font-medium text-foreground">Theme</p>
                          <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">Email Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="text-sm font-medium text-foreground">Chapel Announcements</p>
                            <p className="text-xs text-muted-foreground">Get notified about upcoming events and news</p>
                          </div>
                          <Switch 
                            checked={settings.emailNotifications} 
                            onCheckedChange={() => handleSettingToggle('emailNotifications')}
                            disabled={!editing}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="text-sm font-medium text-foreground">Service Reminders</p>
                            <p className="text-xs text-muted-foreground">Receive reminders before chapel services</p>
                          </div>
                          <Switch 
                            checked={settings.serviceReminders} 
                            onCheckedChange={() => handleSettingToggle('serviceReminders')}
                            disabled={!editing}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="text-sm font-medium text-foreground">Absence Alerts</p>
                            <p className="text-xs text-muted-foreground">Get notified when you're marked absent</p>
                          </div>
                          <Switch 
                            checked={settings.absenceAlerts} 
                            onCheckedChange={() => handleSettingToggle('absenceAlerts')}
                            disabled={!editing}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">Privacy Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="text-sm font-medium text-foreground">Show profile in student directory</p>
                            <p className="text-xs text-muted-foreground">Make your profile visible to other students</p>
                          </div>
                          <Switch 
                            checked={settings.showProfileInDirectory} 
                            onCheckedChange={() => handleSettingToggle('showProfileInDirectory')}
                            disabled={!editing}
                          />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="text-sm font-medium text-foreground">Allow chaplain to contact me</p>
                            <p className="text-xs text-muted-foreground">Allow chapel staff to contact you directly</p>
                          </div>
                          <Switch 
                            checked={settings.allowChaplainContact} 
                            onCheckedChange={() => handleSettingToggle('allowChaplainContact')}
                            disabled={!editing}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">Account Actions</h3>
                      <Button 
                        variant="outline" 
                        className="w-full text-foreground" 
                        size="sm"
                        onClick={handleDownloadData}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download My Data
                      </Button>
                      <Button variant="destructive" className="w-full" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                  {editing && (
                    <CardFooter>
                      <Button 
                        variant="default" 
                        onClick={handleSave}
                        disabled={saving}
                        className="ml-auto"
                      >
                        {saving ? 'Saving Settings...' : 'Save Settings'}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;

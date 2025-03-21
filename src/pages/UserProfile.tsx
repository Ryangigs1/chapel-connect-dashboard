
import { useState, useRef } from 'react';
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
  Upload,
  Camera
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { mockStudents } from '@/utils/mockData';
import { encryptData, decryptData } from '@/utils/encryption';

const UserProfile = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Find user in mock data
  const mockUser = mockStudents.find(s => s.matricNumber === (user?.id || ''));
  
  // Try to get user data from localStorage first
  const getUserFromStorage = () => {
    try {
      const storedData = localStorage.getItem('mtu_user_profile');
      if (!storedData) return null;
      
      const decryptedData = decryptData(storedData);
      return decryptedData;
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return null;
    }
  };
  
  const storedUserData = getUserFromStorage();
  
  const [formData, setFormData] = useState({
    name: storedUserData?.name || user?.name || '',
    email: storedUserData?.email || user?.email || '',
    phone: storedUserData?.phone || '08012345678',
    department: storedUserData?.department || 'Computer Science',
    level: storedUserData?.level || mockUser?.grade || '300L',
    address: storedUserData?.address || 'Student Hostel, Block A Room 205',
    emergencyContact: storedUserData?.emergencyContact || 'Mrs. Johnson - 08023456789',
    bio: storedUserData?.bio || 'I am a dedicated student with focus on academic excellence and spiritual growth.',
    avatarUrl: storedUserData?.avatarUrl || user?.avatarUrl || ''
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: storedUserData?.settings?.emailNotifications || true,
    serviceReminders: storedUserData?.settings?.serviceReminders || true,
    absenceAlerts: storedUserData?.settings?.absenceAlerts || true,
    showProfileInDirectory: storedUserData?.settings?.showProfileInDirectory || true,
    allowChaplainContact: storedUserData?.settings?.allowChaplainContact || true
  });
  
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSettingToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };
  
  const saveToLocalStorage = (data: any) => {
    try {
      const encryptedData = encryptData(data);
      localStorage.setItem('mtu_user_profile', encryptedData);
    } catch (error) {
      console.error('Error saving profile data:', error);
      toast({
        title: "Save error",
        description: "Could not save your profile data",
        variant: "destructive"
      });
    }
  };
  
  const handleSave = () => {
    setSaving(true);
    
    // Save form data and settings
    const profileData = {
      ...formData,
      settings
    };
    
    saveToLocalStorage(profileData);
    
    // Simulate API save delay
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    }, 1000);
  };
  
  const handleCancel = () => {
    setEditing(false);
    // Reset form data to stored values or defaults
    const storedData = getUserFromStorage();
    if (storedData) {
      setFormData({
        name: storedData.name || user?.name || '',
        email: storedData.email || user?.email || '',
        phone: storedData.phone || '08012345678',
        department: storedData.department || 'Computer Science',
        level: storedData.level || mockUser?.grade || '300L',
        address: storedData.address || 'Student Hostel, Block A Room 205',
        emergencyContact: storedData.emergencyContact || 'Mrs. Johnson - 08023456789',
        bio: storedData.bio || 'I am a dedicated student with focus on academic excellence and spiritual growth.',
        avatarUrl: storedData.avatarUrl || user?.avatarUrl || ''
      });
      setSettings(storedData.settings || {
        emailNotifications: true,
        serviceReminders: true,
        absenceAlerts: true,
        showProfileInDirectory: true,
        allowChaplainContact: true
      });
    } else {
      // Reset to defaults
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '08012345678',
        department: 'Computer Science',
        level: mockUser?.grade || '300L',
        address: 'Student Hostel, Block A Room 205',
        emergencyContact: 'Mrs. Johnson - 08023456789',
        bio: 'I am a dedicated student with focus on academic excellence and spiritual growth.',
        avatarUrl: user?.avatarUrl || ''
      });
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
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Size validation (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    setUploadingAvatar(true);
    
    // Read file as base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      
      // Update form data with new avatar URL
      setFormData(prev => ({ ...prev, avatarUrl: base64Image }));
      
      // Update user data in local storage
      const storedData = getUserFromStorage() || {};
      const updatedData = {
        ...storedData,
        avatarUrl: base64Image
      };
      saveToLocalStorage(updatedData);
      
      setUploadingAvatar(false);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated"
      });
    };
    
    reader.onerror = () => {
      setUploadingAvatar(false);
      toast({
        title: "Upload failed",
        description: "Failed to read the image file",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
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
          
          <h1 className="text-2xl font-bold animate-fade-up">
            My Profile
          </h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-card">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 mb-4 group-hover:opacity-80 transition-opacity">
                    <AvatarImage src={formData.avatarUrl} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="bg-black/50 rounded-full h-8 w-8 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
                <p className="text-muted-foreground mb-4">{mockUser?.matricNumber}</p>
                
                <div className="w-full space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? (
                      <>
                        <span className="loading-dots"></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        Change Profile Picture
                      </>
                    )}
                  </Button>
                  
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
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="font-medium">{mockUser?.grade}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">Computer Science</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Account Type</p>
                      <p className="font-medium capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-primary" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="profile">Profile Info</TabsTrigger>
                <TabsTrigger value="chapel">Chapel Record</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-6 mt-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          disabled={!editing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          disabled={!editing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          disabled={!editing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Input 
                          id="level" 
                          name="level" 
                          value={formData.level} 
                          onChange={handleInputChange}
                          disabled={true}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          name="department" 
                          value={formData.department} 
                          onChange={handleInputChange}
                          disabled={true}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="matricNumber">Matric Number</Label>
                        <Input 
                          id="matricNumber" 
                          name="matricNumber" 
                          value={mockUser?.matricNumber || ''} 
                          disabled={true}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Hostel Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input 
                        id="emergencyContact" 
                        name="emergencyContact" 
                        value={formData.emergencyContact} 
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input 
                        id="bio" 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    {editing && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={handleCancel}
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
              
              <TabsContent value="chapel" className="space-y-6 mt-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Chapel Attendance Record</CardTitle>
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
                            <div className="text-2xl font-bold">24</div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-card shadow-sm">
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground mb-1">Attended</div>
                            <div className="text-2xl font-bold">
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
                            <div className="text-2xl font-bold">
                              {Math.round(((24 - (mockUser?.absences || 0)) / 24) * 100)}%
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card className="bg-card shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Recent Attendance</CardTitle>
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
                                    <p className="font-medium">
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
              
              <TabsContent value="settings" className="space-y-6 mt-6">
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Theme & Appearance</h3>
                      <div className="flex items-center justify-between py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">Theme</p>
                          <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Email Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="text-sm font-medium">Chapel Announcements</p>
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
                            <p className="text-sm font-medium">Service Reminders</p>
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
                            <p className="text-sm font-medium">Absence Alerts</p>
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
                      <h3 className="font-medium">Privacy Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="text-sm font-medium">Show profile in student directory</p>
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
                            <p className="text-sm font-medium">Allow chaplain to contact me</p>
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
                      <h3 className="font-medium">Account Actions</h3>
                      <Button variant="outline" className="w-full" size="sm">
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

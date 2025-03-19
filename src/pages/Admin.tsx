
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  FileSpreadsheet, 
  Users, 
  Calendar, 
  Settings, 
  ChevronLeft,
  UploadCloud,
  Database,
  AlertCircle,
  History
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import CsvUpload from '@/components/admin/CsvUpload';
import AttendanceHistory from '@/components/admin/AttendanceHistory';
import { mockStudents } from '@/utils/mockData';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState(mockStudents);
  const [activeTab, setActiveTab] = useState("upload");
  
  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate('/')}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  // Handle data updates from CSV upload
  const handleDataUploaded = (data: any[]) => {
    // Update the students data
    setStudentsData(prevData => {
      const combinedData = [...prevData];
      
      // Add or update student records
      data.forEach(newStudent => {
        const existingIndex = combinedData.findIndex(
          s => s.matricNumber === newStudent.matricNumber || s.name === newStudent.name
        );
        
        if (existingIndex >= 0) {
          // Update existing student
          combinedData[existingIndex] = {
            ...combinedData[existingIndex],
            ...newStudent
          };
        } else {
          // Add new student
          combinedData.push(newStudent);
        }
      });
      
      return combinedData;
    });
    
    toast.success(`Student data updated successfully`);
    
    // Switch to history tab to show the uploaded data
    setActiveTab("history");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold animate-fade-up">Admin Dashboard</h1>
          <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
            Manage chapel attendance data and system settings
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1 animate-fade-up [animation-delay:150ms]">
            Mountain Top University - Prayer City, Ibafo, Ogun State
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card className="shadow-sm bg-white/80 backdrop-blur-sm animate-fade-up [animation-delay:200ms]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  Admin Controls
                </CardTitle>
                <CardDescription>
                  System management tools
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 w-full mb-4">
                    <TabsTrigger value="upload" className="text-xs">
                      <UploadCloud className="h-3 w-3 mr-1" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="history" className="text-xs">
                      <History className="h-3 w-3 mr-1" />
                      History
                    </TabsTrigger>
                    <TabsTrigger value="students" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      Students
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("upload")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Upload CSV Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab("history")}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View Upload History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/students')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View All Students
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => {
                      toast.info("Calendar feature coming soon");
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Chapel Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => {
                      toast.info("Database management coming soon");
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Database Management
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm bg-white/80 backdrop-blur-sm animate-fade-up [animation-delay:300ms]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">System Stats</CardTitle>
                <CardDescription>
                  Current database status
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Students:</span>
                  <span className="font-medium">{studentsData.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">With Absences:</span>
                  <span className="font-medium">
                    {studentsData.filter(s => s.absences > 0).length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Good Standing:</span>
                  <span className="font-medium">
                    {studentsData.filter(s => s.absences === 0).length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <TabsContent value="upload" className="mt-0 animate-fade-up [animation-delay:200ms]">
              <CsvUpload onDataUploaded={handleDataUploaded} />
              
              <Card className="shadow-sm bg-white/80 backdrop-blur-sm mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">CSV Upload Guide</CardTitle>
                  <CardDescription>
                    How to prepare your data file
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-4">
                    <p className="text-sm">
                      Your CSV file should include the following columns:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Required columns:</h3>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Name
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Matric Number
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Level (e.g., 100L, 200L)
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Optional columns:</h3>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            Absences (number)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            Last Attendance (date)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                            Punishment Served (true/false)
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted rounded-md">
                      <h3 className="text-sm font-medium mb-2">Example CSV format:</h3>
                      <pre className="text-xs overflow-x-auto">
                        Name,Matric Number,Level,Absences,Last Attendance,Punishment Served<br/>
                        Oluwaseun Adegoke,MTU/2019/0123,300L,3,2023-04-10,true<br/>
                        Chidinma Okafor,MTU/2020/0045,200L,1,2023-04-15,false<br/>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0 animate-fade-up [animation-delay:200ms]">
              <AttendanceHistory />
            </TabsContent>
            
            <TabsContent value="students" className="mt-0 animate-fade-up [animation-delay:200ms]">
              <Card>
                <CardHeader>
                  <CardTitle>Student Database</CardTitle>
                  <CardDescription>
                    Direct database access coming soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Feature in development</AlertTitle>
                    <AlertDescription>
                      Database management interface will be available in an upcoming update.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0 animate-fade-up [animation-delay:200ms]">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Feature in development</AlertTitle>
                    <AlertDescription>
                      Settings management will be available in an upcoming update.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;

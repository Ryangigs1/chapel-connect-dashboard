
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  Filter, 
  Download, 
  Save, 
  PieChart, 
  BarChart, 
  Calendar,
  Search
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getAttendanceDataById, StoredAttendanceData } from '@/utils/githubStorage';
import AttendanceDataViz from '@/components/admin/AttendanceDataViz';

const AttendanceDetails = () => {
  const { attendanceId } = useParams<{ attendanceId: string }>();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<StoredAttendanceData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!attendanceId) return;
      
      try {
        setLoading(true);
        const data = await getAttendanceDataById(attendanceId);
        
        if (data) {
          setAttendanceData(data);
          console.log('Loaded attendance data:', data);
        } else {
          toast.error('Failed to retrieve attendance data');
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Error loading attendance data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [attendanceId]);
  
  const filteredStudents = attendanceData?.data?.students?.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.level.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const absentCount = filteredStudents.filter(student => student.absences > 0).length;
  const goodStandingCount = filteredStudents.filter(student => student.absences === 0).length;
  const notPunishedCount = filteredStudents.filter(student => student.absences > 0 && !student.punishmentServed).length;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Admin
          </Button>
          
          <h1 className="text-2xl font-bold animate-fade-up">
            Attendance Record {attendanceData?.filename}
          </h1>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : attendanceData ? (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Record Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium">{attendanceData.filename}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded by:</span>
                      <span className="font-medium">{attendanceData.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {new Date(attendanceData.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Students:</span>
                      <span className="font-medium">{filteredStudents.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Attendance Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Present:</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">
                        {goodStandingCount} students
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Absent:</span>
                      <Badge variant="outline" className="bg-red-500/10 text-red-600">
                        {absentCount} students
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending Punishment:</span>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                        {notPunishedCount} students
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attendance Rate:</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                        {filteredStudents.length ? 
                          `${Math.round((goodStandingCount / filteredStudents.length) * 100)}%` : 
                          '0%'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      <PieChart className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Follow-up
                    </Button>
                    <Button className="w-full" variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="students">
              <TabsList>
                <TabsTrigger value="students">
                  Student Records
                </TabsTrigger>
                <TabsTrigger value="visualization">
                  Data Visualization
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="students" className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search students..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              
                <Card className="bg-white/80 backdrop-blur-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matric No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Absences</TableHead>
                        <TableHead>Last Attendance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.matricNumber}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.level}</TableCell>
                          <TableCell>{student.absences}</TableCell>
                          <TableCell>{student.lastAttendance}</TableCell>
                          <TableCell>
                            {student.absences === 0 ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                                Good Standing
                              </Badge>
                            ) : student.punishmentServed ? (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                                Punishment Served
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                                Punishment Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
              
              <TabsContent value="visualization">
                <AttendanceDataViz data={filteredStudents} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Record Not Found</h3>
                <p className="text-muted-foreground mb-4">
                  The attendance record you're looking for could not be found.
                </p>
                <Button
                  onClick={() => navigate('/admin')}
                >
                  Return to Admin Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AttendanceDetails;

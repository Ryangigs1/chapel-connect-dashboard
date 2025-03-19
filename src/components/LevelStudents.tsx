
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  AlertCircle,
  Calendar,
  Search,
  User,
  BookOpen,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import { mockStudents } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface LevelStudentsProps {
  level: string;
}

const LevelStudents = ({ level }: LevelStudentsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFrame, setTimeFrame] = useState('weekly');

  // Filter students by level
  const levelStudents = mockStudents
    .filter(student => student.grade === level)
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.matricNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Generate sample attendance data
  const weeklyData = [
    { name: 'Week 1', present: 90, absent: 10 },
    { name: 'Week 2', present: 85, absent: 15 },
    { name: 'Week 3', present: 88, absent: 12 },
    { name: 'Week 4', present: 92, absent: 8 },
  ];
  
  const monthlyData = [
    { name: 'Jan', present: 92, absent: 8 },
    { name: 'Feb', present: 88, absent: 12 },
    { name: 'Mar', present: 90, absent: 10 },
    { name: 'Apr', present: 85, absent: 15 },
    { name: 'May', present: 93, absent: 7 },
  ];
  
  const specialEventsData = [
    { name: 'MTU Prays', present: 95, absent: 5 },
    { name: 'PMCH', present: 88, absent: 12 },
    { name: 'Convocation', present: 98, absent: 2 },
    { name: 'Orientation', present: 85, absent: 15 },
  ];
  
  const pieData = [
    { name: 'Present', value: 85, color: '#10b981' },
    { name: 'Absent', value: 15, color: '#ef4444' },
  ];

  // Calculate total students and stats
  const totalStudents = levelStudents.length;
  const totalAbsences = levelStudents.reduce((sum, student) => sum + student.absences, 0);
  const attendanceRate = totalStudents > 0 
    ? Math.round(((totalStudents * 12 - totalAbsences) / (totalStudents * 12)) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <h3 className="text-3xl font-bold mt-1">{totalStudents}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <h3 className="text-3xl font-bold mt-1">{attendanceRate}%</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Absences</p>
                <h3 className="text-3xl font-bold mt-1">{totalAbsences}</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Special Events</p>
                <h3 className="text-3xl font-bold mt-1">4</h3>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Attendance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-none">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Attendance Overview</CardTitle>
              <Tabs value={timeFrame} onValueChange={setTimeFrame} className="w-[250px]">
                <TabsList className="grid grid-cols-3 h-8">
                  <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                  <TabsTrigger value="special" className="text-xs">Special Events</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    timeFrame === 'weekly' ? weeklyData : 
                    timeFrame === 'monthly' ? monthlyData :
                    specialEventsData
                  }
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-none">
          <CardHeader>
            <CardTitle className="text-lg">Attendance Distribution</CardTitle>
            <CardDescription>
              Overall attendance trend for {level} students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Student List */}
      <Card className="bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-none overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {level} Students
              </CardTitle>
              <CardDescription>
                Complete student list with attendance details
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or matric number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full sm:w-[250px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">S/N</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Matric Number</TableHead>
                  <TableHead className="text-center">Absences</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Last Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levelStudents.length > 0 ? (
                  levelStudents.map((student, index) => (
                    <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <Link to={`/students/${student.id}`} className="font-medium hover:text-primary transition-colors">
                            {student.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {student.matricNumber || `MTU/${level.replace('L', '')}/${Math.floor(Math.random() * 900) + 100}`}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {student.absences === 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">None</Badge>
                        ) : student.absences <= 2 ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">{student.absences}</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{student.absences}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.absences === 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Good Standing</Badge>
                        ) : student.absences > 0 && student.punishmentServed ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Completed</Badge>
                        ) : student.absences > 3 ? (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Action Required</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Warning</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{student.lastAttendance}</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p>No {level} students match your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <span>Showing {levelStudents.length} students</span>
            <span>* Click on student name to view detailed profile</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LevelStudents;

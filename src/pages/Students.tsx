
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileWarning, 
  Info, 
  User, 
  XCircle 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StudentList from '@/components/StudentList';
import { 
  getStudentById, 
  getPunishmentsByStudentId, 
  getAttendanceRecordsByStudentId 
} from '@/utils/mockData';
import { PunishmentRecord, AttendanceRecord } from '@/types';
import { cn } from '@/lib/utils';

const Students = () => {
  const { studentId } = useParams();
  const student = studentId ? getStudentById(studentId) : null;
  
  if (student) {
    return <StudentDetail student={student} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold animate-fade-up">Students</h1>
          <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
            Manage and track student chapel attendance
          </p>
        </div>
        
        <StudentList className="animate-fade-up [animation-delay:200ms]" />
      </main>
    </div>
  );
};

const StudentDetail = ({ student }: { student: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const punishments = getPunishmentsByStudentId(student.id);
  const attendanceRecords = getAttendanceRecordsByStudentId(student.id);
  
  const attendanceRate = attendanceRecords.length > 0 
    ? Math.round((attendanceRecords.filter(record => record.present).length / attendanceRecords.length) * 100)
    : 100;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/students">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold animate-fade-up">Student Profile</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 animate-fade-up [animation-delay:100ms]">
            <CardHeader className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-2">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-xl">{student.name}</CardTitle>
              <CardDescription>{student.grade} Grade Student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Attendance Rate</div>
                <div className="text-2xl font-bold">{attendanceRate}%</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      attendanceRate > 90 ? "bg-green-500" : 
                      attendanceRate > 75 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Status</div>
                <div>
                  {student.absences === 0 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Good Standing
                    </Badge>
                  ) : student.absences > 0 && student.punishmentServed ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      Completed Punishment
                    </Badge>
                  ) : student.absences > 3 ? (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      Requires Attention
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                      Warning
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="pt-4 grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-4xl font-bold">{student.absences}</div>
                  <div className="text-sm text-muted-foreground">Absences</div>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold">
                    {punishments.filter(p => p.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Actions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 animate-fade-up [animation-delay:200ms]">
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Detailed record of chapel attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="records">Records</TabsTrigger>
                  <TabsTrigger value="punishments">Punishments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatsCard 
                      title="Recent Attendance" 
                      value={student.lastAttendance} 
                      icon={<Calendar className="h-4 w-4 text-blue-500" />} 
                      description="Last chapel attendance" 
                    />
                    <StatsCard 
                      title="Total Absences" 
                      value={student.absences} 
                      icon={<XCircle className="h-4 w-4 text-red-500" />} 
                      description="Missed chapel services" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Recent Activity</h3>
                    {attendanceRecords.slice(0, 5).map((record: AttendanceRecord) => (
                      <div key={record.id} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-2">
                          {record.present ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>
                            {record.present ? 'Attended' : 'Missed'} chapel on {record.date}
                          </span>
                        </div>
                        {!record.present && record.excuse && (
                          <Badge variant="outline">Excused: {record.excuse}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="records">
                  <div className="rounded-md border">
                    <table className="min-w-full">
                      <thead className="bg-muted/30">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                          <th className="px-4 py-2 text-left text-sm font-medium">Excuse</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {attendanceRecords.map((record: AttendanceRecord) => (
                          <tr key={record.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 text-sm">{record.date}</td>
                            <td className="px-4 py-3 text-sm">
                              {record.present ? (
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  Present
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                  Absent
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {record.excuse || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="punishments">
                  {punishments.length > 0 ? (
                    <div className="space-y-4">
                      {punishments.map((punishment: PunishmentRecord) => (
                        <Card key={punishment.id}>
                          <CardHeader className="py-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{punishment.type}</CardTitle>
                                <CardDescription>Issued on {punishment.date}</CardDescription>
                              </div>
                              <StatusBadge status={punishment.status} />
                            </div>
                          </CardHeader>
                          <CardContent className="py-3">
                            <div className="flex items-start gap-2">
                              <FileWarning className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div className="text-sm">{punishment.reason}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Info className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">No punishment records found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ title, value, icon, description }: { title: string; value: string | number; icon: React.ReactNode; description: string }) => {
  return (
    <div className="p-4 border rounded-lg space-y-1">
      <div className="flex items-center justify-between">
        <div className="font-medium">{title}</div>
        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'completed') {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    );
  }
  
  if (status === 'excused') {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
        <Info className="h-3 w-3 mr-1" />
        Excused
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
      <Clock className="h-3 w-3 mr-1" />
      Pending
    </Badge>
  );
};

export default Students;

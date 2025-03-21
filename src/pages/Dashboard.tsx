
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  CalendarDays,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  ChevronRight,
  Users,
  Bell,
  BookOpen,
  User,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AttendanceStats from '@/components/AttendanceStats';
import { useAuth } from '@/lib/auth';
import { mockStudents } from '@/utils/mockData';

// Mock chapel schedule data based on chapelapp.vercel.app
const chapelSchedule = [
  {
    id: '1',
    title: 'Morning Prayer',
    time: '6:00 AM - 7:00 AM',
    days: ['Monday', 'Wednesday', 'Friday'],
    location: 'University Chapel',
    mandatory: true
  },
  {
    id: '2',
    title: 'Evening Service',
    time: '6:30 PM - 8:00 PM',
    days: ['Tuesday', 'Thursday'],
    location: 'University Chapel',
    mandatory: true
  },
  {
    id: '3',
    title: 'Sunday Worship',
    time: '9:00 AM - 11:30 AM',
    days: ['Sunday'],
    location: 'Main Auditorium',
    mandatory: true
  },
  {
    id: '4',
    title: 'Bible Study',
    time: '4:00 PM - 5:30 PM',
    days: ['Friday'],
    location: 'Faculty Building Room 302',
    mandatory: false
  }
];

// Mock announcements data
const announcements = [
  {
    id: '1',
    title: 'Special Prayer Week',
    date: '2023-11-20',
    content: 'Join us for a special week of prayer and fasting starting Monday. All services are mandatory during this period.',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Chapel Choir Auditions',
    date: '2023-11-15',
    content: 'Chapel choir auditions will be held this weekend. All interested students should register at the chaplaincy office.',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Online Prayer Platform',
    date: '2023-11-10',
    content: 'We\'ve launched an online prayer request platform. Visit the chapel website to submit your prayer requests.',
    priority: 'medium'
  }
];

// Upcoming events data
const upcomingEvents = [
  {
    id: '1',
    title: 'Youth Revival Conference',
    date: '2023-11-25',
    time: '10:00 AM - 4:00 PM',
    location: 'University Auditorium',
    description: 'Annual youth revival conference with guest speakers from around the country.'
  },
  {
    id: '2',
    title: 'Christmas Carol Service',
    date: '2023-12-15',
    time: '6:00 PM - 9:00 PM',
    location: 'University Chapel',
    description: 'Annual Christmas carol service featuring university choir and orchestra.'
  },
  {
    id: '3',
    title: 'Faith and Science Symposium',
    date: '2024-01-10',
    time: '9:00 AM - 3:00 PM',
    location: 'Faculty of Science Auditorium',
    description: 'Exploring the relationship between faith and scientific inquiry with distinguished speakers.'
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get today's day name
  const today = new Date().toLocaleString('en-us', { weekday: 'long' });
  
  // Find today's services
  const todayServices = chapelSchedule.filter(service => 
    service.days.includes(today)
  );
  
  // Get user absences (using mock data)
  const userRecord = mockStudents.find(student => student.name === user?.name);
  const absences = userRecord?.absences || 0;
  const attendanceStatus = absences === 0 
    ? { status: 'Good Standing', color: 'bg-green-500/10 text-green-600' }
    : absences < 3
    ? { status: 'Warning', color: 'bg-yellow-500/10 text-yellow-600' }
    : { status: 'Critical', color: 'bg-red-500/10 text-red-600' };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold animate-fade-up">
            Welcome, {user?.name || 'Student'}
          </h1>
          <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
            Mountain Top University Chapel Connect Dashboard
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="animate-fade-up [animation-delay:200ms]">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="schedule" className="text-xs sm:text-sm">
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="announcements" className="text-xs sm:text-sm">
                  Announcements
                </TabsTrigger>
                <TabsTrigger value="events" className="text-xs sm:text-sm">
                  Events
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-5 w-5 text-primary mr-2" />
                        Your Chapel Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Current Status:</span>
                          <Badge variant="outline" className={attendanceStatus.color}>
                            {attendanceStatus.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Absences:</span>
                          <span className="font-medium">{absences}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Allowed Absences:</span>
                          <span className="font-medium">3 per semester</span>
                        </div>
                        <Separator />
                        <div className="pt-2">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="sm"
                            onClick={() => navigate('/profile')}
                          >
                            View Full Record
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <CalendarDays className="h-5 w-5 text-primary mr-2" />
                        Today's Chapel Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {todayServices.length > 0 ? (
                        <div className="space-y-4">
                          {todayServices.map(service => (
                            <div key={service.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">{service.title}</h3>
                                {service.mandatory && (
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                                    Mandatory
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {service.time}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {service.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-muted-foreground">
                          <CalendarIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                          <p>No chapel services scheduled for today</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BarChart className="h-5 w-5 text-primary mr-2" />
                      Attendance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AttendanceStats />
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-lg flex items-center">
                      <Bell className="h-5 w-5 text-primary mr-2" />
                      Recent Announcements
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('announcements')}>
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {announcements.slice(0, 2).map(announcement => (
                        <div key={announcement.id} className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{announcement.title}</h3>
                            <Badge 
                              variant="outline" 
                              className={announcement.priority === 'high' 
                                ? 'bg-red-500/10 text-red-600' 
                                : 'bg-blue-500/10 text-blue-600'
                              }
                            >
                              {announcement.priority === 'high' ? 'Important' : 'Announcement'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground/70">
                            Posted on {new Date(announcement.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Weekly Chapel Schedule</CardTitle>
                    <CardDescription>
                      All mandatory services require attendance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                        const dayServices = chapelSchedule.filter(service => 
                          service.days.includes(day)
                        );
                        
                        return (
                          <div key={day} className="space-y-3">
                            <h3 className={`font-medium ${day === today ? 'text-primary' : ''}`}>
                              {day} {day === today && '(Today)'}
                            </h3>
                            
                            {dayServices.length > 0 ? (
                              <div className="space-y-3 pl-4 border-l-2 border-muted">
                                {dayServices.map(service => (
                                  <div key={service.id} className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-medium">{service.title}</h4>
                                      {service.mandatory && (
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                                          Mandatory
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center">
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      {service.time}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center">
                                      <MapPin className="h-3.5 w-3.5 mr-1" />
                                      {service.location}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                                No chapel services scheduled
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="announcements" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Chapel Announcements</CardTitle>
                    <CardDescription>
                      Important notices and updates from the chaplaincy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {announcements.map(announcement => (
                        <Card key={announcement.id} className="border border-muted">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">{announcement.title}</CardTitle>
                              <Badge 
                                variant="outline" 
                                className={announcement.priority === 'high' 
                                  ? 'bg-red-500/10 text-red-600' 
                                  : 'bg-blue-500/10 text-blue-600'
                                }
                              >
                                {announcement.priority === 'high' ? 'Important' : 'Announcement'}
                              </Badge>
                            </div>
                            <CardDescription>
                              Posted on {new Date(announcement.date).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{announcement.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Upcoming Chapel Events</CardTitle>
                    <CardDescription>
                      Special services and events organized by the chaplaincy
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {upcomingEvents.map(event => (
                        <Card key={event.id} className="border border-muted">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <CardDescription>
                              {new Date(event.date).toLocaleDateString()} • {event.time}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-2">
                              <div className="flex items-start text-sm">
                                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                              <p className="text-sm">{event.description}</p>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">
                              Add to Calendar
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm animate-fade-up [animation-delay:300ms]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-5 w-5 text-primary mr-2" />
                  Spiritual Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Daily Devotional</h3>
                    <p className="text-sm text-muted-foreground">
                      "Trust in the LORD with all your heart and lean not on your own understanding." - Proverbs 3:5
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Prayer Focus</h3>
                    <p className="text-sm text-muted-foreground">
                      This week we are praying for success in the upcoming examinations.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Bible Study Materials
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm animate-fade-up [animation-delay:400ms]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  Chapel Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Choir Ministry</h3>
                    <p className="text-sm text-muted-foreground">
                      Rehearsals every Saturday at 4PM
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Prayer Warriors</h3>
                    <p className="text-sm text-muted-foreground">
                      Meets every weekday morning at 5AM
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Ushering Team</h3>
                    <p className="text-sm text-muted-foreground">
                      Meeting this Friday at 5PM
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" size="sm">
                    Join a Chapel Team
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm animate-fade-up [animation-delay:500ms]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Submit Prayer Request
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Chapel Rules &amp; Guidelines
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Meet the Chaplains
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Register for Special Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

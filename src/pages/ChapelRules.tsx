
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Clock, 
  CalendarDays, 
  CheckCircle, 
  XCircle, 
  Users,
  AlertTriangle,
  Download,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import RealTimeClock from '@/components/RealTimeClock';

const ChapelRules = () => {
  const handleDownload = () => {
    toast.success('Chapel rules PDF downloaded');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold animate-fade-up">
              Chapel Rules & Guidelines
            </h1>
            <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
              Important information for all students regarding chapel attendance
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <RealTimeClock className="text-sm text-muted-foreground" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  General Chapel Attendance Rules
                </CardTitle>
                <CardDescription>
                  All students must adhere to these guidelines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">1. Attendance Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Chapel attendance is mandatory for all students enrolled at Mountain Top University. 
                    Students are expected to attend all chapel services scheduled during the academic 
                    semester. Each student must achieve at least 80% attendance to be in good standing.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">2. Chapel Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    Regular chapel services are held three times per week:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>- Monday: 10:00 AM - 11:30 AM</li>
                    <li>- Wednesday: 10:00 AM - 11:30 AM</li>
                    <li>- Friday: 10:00 AM - 11:30 AM</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Special chapel services may be scheduled throughout the semester and will be 
                    announced in advance.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">3. Attendance Recording</h3>
                  <p className="text-sm text-muted-foreground">
                    Attendance is recorded through the chapel attendance app. Students must log in 
                    with their university credentials and check in at the beginning of each service.
                    Check-in opens 15 minutes before the service begins and closes 15 minutes after 
                    the service starts. Late arrivals beyond this window will be marked as absent.
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">4. Absence Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    Students are permitted to miss up to 20% of chapel services without penalty. 
                    Absences beyond this threshold will result in disciplinary measures, including:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>- First violation: Written warning</li>
                    <li>- Second violation: Mandatory meeting with chaplain</li>
                    <li>- Third violation: Community service requirement</li>
                    <li>- Continued violations: Academic hold on registration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Expected Conduct
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">1. Dress Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Students are expected to dress in a manner that reflects dignity and respect for the 
                        chapel service. Business casual attire is recommended. University uniforms are required 
                        for Monday services.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">2. Electronic Devices</h3>
                      <p className="text-sm text-muted-foreground">
                        Mobile phones and other electronic devices should be silenced or turned off during 
                        chapel services. Use of devices should be limited to accessing electronic Bibles 
                        or taking notes related to the service.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">3. Respectful Behavior</h3>
                      <p className="text-sm text-muted-foreground">
                        Students are expected to be attentive and respectful during chapel services. Talking, 
                        sleeping, studying, or engaging in other disruptive behaviors is not permitted and may 
                        result in being marked absent.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">4. Participation</h3>
                      <p className="text-sm text-muted-foreground">
                        Active participation in worship, prayer, and other aspects of the service is encouraged. 
                        Students should bring their Bibles (electronic or physical) and participate in scripture 
                        readings when appropriate.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">5. Early Departures</h3>
                      <p className="text-sm text-muted-foreground">
                        Students are expected to remain for the entire chapel service. Early departures without 
                        prior approval from the chaplain's office may result in being marked absent for the service.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Important Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/70 p-3 rounded-md">
                  <h3 className="font-medium flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    Attendance Violations
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Students with attendance below 80% will face registration holds for the next semester 
                    and may be required to complete additional spiritual formation activities.
                  </p>
                </div>
                
                <div className="bg-muted/70 p-3 rounded-md">
                  <h3 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Small Group Alternative
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Students may substitute up to 6 chapel services per semester with approved small group 
                    participation. Small group registration must be completed within the first two weeks 
                    of the semester.
                  </p>
                </div>
                
                <div className="bg-muted/70 p-3 rounded-md">
                  <h3 className="font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-green-500" />
                    Special Services
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Special chapel services such as Spiritual Emphasis Week, Revival Services, and 
                    Holiday Celebrations may have different attendance requirements and will be 
                    announced in advance.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Complete Chapel Handbook
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/events', '_self')}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  View Chapel Calendar
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/chaplains', '_self')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Contact Chaplain's Office
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('/prayer-request', '_self')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Excused Absence Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapelRules;

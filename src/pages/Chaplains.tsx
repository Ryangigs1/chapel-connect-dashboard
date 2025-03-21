
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare,
  UserRound,
  Users,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import RealTimeClock from '@/components/RealTimeClock';

interface Chaplain {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  office: string;
  officeHours: string;
  bio: string;
  imageUrl: string;
  specialties: string[];
}

const chaplains: Chaplain[] = [
  {
    id: '1',
    name: 'Rev. Dr. Michael Adebayo',
    title: 'University Chaplain',
    email: 'chaplain@mtu.edu.ng',
    phone: '+234 803 123 4567',
    office: 'Chaplaincy Building, Room 101',
    officeHours: 'Monday-Friday, 9:00 AM - 4:00 PM',
    bio: 'Rev. Dr. Michael Adebayo has served as University Chaplain for 8 years. He holds a PhD in Theology from Covenant University and a Master of Divinity from Redeemer\'s University. He specializes in pastoral counseling and spiritual formation for young adults.',
    imageUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=800&auto=format&fit=crop',
    specialties: ['Spiritual Counseling', 'Biblical Studies', 'Youth Ministry']
  },
  {
    id: '2',
    name: 'Pastor Grace Okonkwo',
    title: 'Associate Chaplain',
    email: 'grace.okonkwo@mtu.edu.ng',
    phone: '+234 805 987 6543',
    office: 'Chaplaincy Building, Room 105',
    officeHours: 'Monday-Thursday, 10:00 AM - 3:00 PM',
    bio: 'Pastor Grace oversees women\'s ministry initiatives and coordinates spiritual mentorship programs. She holds a Master\'s degree in Christian Counseling and has extensive experience in campus ministry.',
    imageUrl: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=800&auto=format&fit=crop',
    specialties: ['Women\'s Ministry', 'Prayer & Intercession', 'Mentorship']
  },
  {
    id: '3',
    name: 'Pastor Emmanuel Johnson',
    title: 'Assistant Chaplain',
    email: 'emmanuel.johnson@mtu.edu.ng',
    phone: '+234 802 876 5432',
    office: 'Chaplaincy Building, Room 103',
    officeHours: 'Tuesday-Friday, 9:00 AM - 5:00 PM',
    bio: 'Pastor Emmanuel specializes in worship ministry and coordinates the university choir and praise team. He holds a Bachelor\'s degree in Music and a Master\'s in Theology.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    specialties: ['Worship Ministry', 'Music & Arts', 'Youth Development']
  }
];

const Chaplains = () => {
  const [activeChaplain, setActiveChaplain] = useState<Chaplain | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Message sent to ${activeChaplain?.name}`);
    setShowContactDialog(false);
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold animate-fade-up">
              Meet the Chaplains
            </h1>
            <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
              Get to know our spiritual leadership team
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <RealTimeClock className="text-sm text-muted-foreground" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {chaplains.map(chaplain => (
            <Card 
              key={chaplain.id} 
              className="overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-slate-900/80"
            >
              <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
                <img 
                  src={chaplain.imageUrl} 
                  alt={chaplain.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{chaplain.name}</CardTitle>
                <CardDescription>{chaplain.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{chaplain.email}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{chaplain.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{chaplain.office}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{chaplain.officeHours}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Specialties:</h3>
                  <div className="flex flex-wrap gap-2">
                    {chaplain.specialties.map((specialty, index) => (
                      <div key={index} className="bg-muted text-xs px-2 py-1 rounded-md">
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button 
                  className="w-1/2"
                  onClick={() => {
                    setActiveChaplain(chaplain);
                    setShowContactDialog(true);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button 
                  variant="outline" 
                  className="w-1/2"
                  onClick={() => setActiveChaplain(chaplain)}
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Chaplaincy Office
              </CardTitle>
              <CardDescription>
                General information and hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Location</h3>
                <p className="text-sm text-muted-foreground">
                  The Chaplaincy Office is located in the University Chapel Building, adjacent to the 
                  Administration Block. The office is on the first floor, rooms 101-110.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Office Hours</h3>
                <p className="text-sm text-muted-foreground">
                  The Chaplaincy Office is open during the following hours:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>- Monday - Friday: 8:00 AM - 5:00 PM</li>
                  <li>- Saturday: 9:00 AM - 1:00 PM</li>
                  <li>- Sunday: 7:00 AM - 2:00 PM (Service hours)</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">Contact Information</h3>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">+234 805 123 4567</p>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">chaplaincy@mtu.edu.ng</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>
                Regular chaplaincy activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="services">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="services">Chapel Services</TabsTrigger>
                  <TabsTrigger value="meetings">Fellowship Groups</TabsTrigger>
                  <TabsTrigger value="counseling">Counseling</TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Monday Chapel Service</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 10:00 AM - 11:30 AM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      General chapel service for all students and staff
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Wednesday Chapel Service</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 10:00 AM - 11:30 AM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Bible study and teaching service
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Friday Chapel Service</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 10:00 AM - 11:30 AM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Praise and worship service
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Sunday Service</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 8:00 AM - 10:00 AM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Sunday worship service
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="meetings" className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Prayer Warriors</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Tuesday, 6:00 PM - 7:30 PM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Intercessory prayer group meeting in Prayer Room 1
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Bible Study Fellowship</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Thursday, 5:00 PM - 6:30 PM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      In-depth scripture study in Lecture Hall B
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Choir Practice</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Saturday, 2:00 PM - 4:00 PM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Chapel choir rehearsal in the Music Room
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="counseling" className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Spiritual Counseling</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Monday - Friday, 2:00 PM - 4:00 PM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      One-on-one counseling with chaplains, by appointment
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Prayer & Support Group</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Wednesday, 4:00 PM - 5:00 PM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Group counseling and support in Chaplaincy Room 106
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-md">
                    <div className="font-medium">Career & Life Guidance</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Tuesday & Thursday, 10:00 AM - 12:00 PM
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Guidance on career and life decisions from a biblical perspective
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact {activeChaplain?.name}</DialogTitle>
            <DialogDescription>
              Send a message to {activeChaplain?.title}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContactSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleContactChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                className="min-h-[120px]"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowContactDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Chaplain Profile Dialog */}
      <Dialog open={!!activeChaplain && !showContactDialog} onOpenChange={() => setActiveChaplain(null)}>
        {activeChaplain && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{activeChaplain.name}</DialogTitle>
              <DialogDescription>{activeChaplain.title}</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="aspect-square overflow-hidden rounded-md">
                <img 
                  src={activeChaplain.imageUrl} 
                  alt={activeChaplain.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Biography
                  </h3>
                  <p className="text-sm">{activeChaplain.bio}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm">{activeChaplain.email}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm">{activeChaplain.phone}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm">{activeChaplain.office}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <p className="text-sm">{activeChaplain.officeHours}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Areas of Expertise:</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeChaplain.specialties.map((specialty, index) => (
                      <div 
                        key={index} 
                        className="bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setActiveChaplain(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => setShowContactDialog(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Chaplains;

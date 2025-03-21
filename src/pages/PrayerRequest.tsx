
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, ThumbsUp, Clock, Heart } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import RealTimeClock from '@/components/RealTimeClock';

interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  createdAt: Date;
  prayerCount: number;
}

const PrayerRequest = () => {
  const { user } = useAuth();
  const [requestTitle, setRequestTitle] = useState('');
  const [requestContent, setRequestContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Chaplain Emmanuel',
      title: 'Prayer for Final Exams',
      content: 'Please pray for all students as they prepare for final examinations.',
      isAnonymous: false,
      createdAt: new Date('2023-10-15T10:30:00'),
      prayerCount: 24
    },
    {
      id: '2',
      userId: '3',
      userName: 'Anonymous Student',
      title: 'Family Health Concerns',
      content: 'My family member is facing health challenges. Please pray for healing and strength.',
      isAnonymous: true,
      createdAt: new Date('2023-10-10T14:15:00'),
      prayerCount: 18
    }
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestTitle.trim() || !requestContent.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newRequest: PrayerRequest = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      userName: isAnonymous ? 'Anonymous' : (user?.name || 'Guest'),
      title: requestTitle,
      content: requestContent,
      isAnonymous,
      createdAt: new Date(),
      prayerCount: 0
    };
    
    setPrayerRequests([newRequest, ...prayerRequests]);
    setRequestTitle('');
    setRequestContent('');
    setIsAnonymous(false);
    
    toast.success('Prayer request submitted');
  };
  
  const prayForRequest = (requestId: string) => {
    setPrayerRequests(
      prayerRequests.map(req => 
        req.id === requestId 
          ? { ...req, prayerCount: req.prayerCount + 1 } 
          : req
      )
    );
    
    toast.success('Thank you for praying for this request');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold animate-fade-up">
              Prayer Requests
            </h1>
            <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
              Submit and share prayer needs with the community
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-muted/50 p-2 rounded-md">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <RealTimeClock className="text-sm text-muted-foreground" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle>Community Prayer Wall</CardTitle>
              <CardDescription>
                Pray for and support other members of the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent">
                <TabsList className="mb-4">
                  <TabsTrigger value="recent">Recent Requests</TabsTrigger>
                  <TabsTrigger value="most-prayed">Most Prayed For</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="space-y-4">
                  {prayerRequests.map(request => (
                    <Card key={request.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{request.title}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <CardDescription>
                          From: {request.userName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{request.content}</p>
                      </CardContent>
                      <div className="px-6 pb-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Heart className="h-3 w-3 mr-1 text-rose-500" />
                          <span>{request.prayerCount} prayers</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => prayForRequest(request.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          I Prayed For This
                        </Button>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="most-prayed" className="space-y-4">
                  {prayerRequests
                    .sort((a, b) => b.prayerCount - a.prayerCount)
                    .map(request => (
                      <Card key={request.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{request.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <CardDescription>
                            From: {request.userName}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm">{request.content}</p>
                        </CardContent>
                        <div className="px-6 pb-4 flex justify-between items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Heart className="h-3 w-3 mr-1 text-rose-500" />
                            <span>{request.prayerCount} prayers</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => prayForRequest(request.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            I Prayed For This
                          </Button>
                        </div>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle>Submit a Prayer Request</CardTitle>
              <CardDescription>
                Share your prayer needs with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Prayer request title"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Request Details</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe your prayer need..."
                    className="min-h-[100px]"
                    value={requestContent}
                    onChange={(e) => setRequestContent(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Submit anonymously
                  </Label>
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Prayer Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PrayerRequest;


import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  CalendarDays,
  Plus
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

// Mock events data
const chapelEvents = [
  {
    id: '1',
    title: 'Youth Revival Conference',
    date: '2023-11-25',
    time: '10:00 AM - 4:00 PM',
    location: 'University Auditorium',
    description: 'Annual youth revival conference with guest speakers from around the country.',
    category: 'conference',
    speakers: ['Pastor Michael Johnson', 'Dr. Elizabeth Grey'],
    capacity: 500,
    registered: 342,
    image: 'https://images.unsplash.com/photo-1609234516883-b92e82ee60a7?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Christmas Carol Service',
    date: '2023-12-15',
    time: '6:00 PM - 9:00 PM',
    location: 'University Chapel',
    description: 'Annual Christmas carol service featuring university choir and orchestra.',
    category: 'worship',
    speakers: ['University Choir', 'Faculty of Arts'],
    capacity: 300,
    registered: 210,
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Faith and Science Symposium',
    date: '2024-01-10',
    time: '9:00 AM - 3:00 PM',
    location: 'Faculty of Science Auditorium',
    description: 'Exploring the relationship between faith and scientific inquiry with distinguished speakers.',
    category: 'academic',
    speakers: ['Prof. James Rodriguez', 'Dr. Sarah Thompson'],
    capacity: 200,
    registered: 85,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Easter Sunday Service',
    date: '2024-03-31',
    time: '9:00 AM - 12:00 PM',
    location: 'University Auditorium',
    description: 'Special Easter service celebrating the resurrection with choir performances and special activities.',
    category: 'worship',
    speakers: ['Vice Chancellor', 'University Chaplain'],
    capacity: 600,
    registered: 125,
    image: 'https://images.unsplash.com/photo-1519892038869-581260100389?w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'Prayer Retreat',
    date: '2024-02-15',
    time: '8:00 AM - 4:00 PM',
    location: 'Prayer Mountain',
    description: 'A day of prayer, reflection and spiritual rejuvenation at the Prayer Mountain retreat center.',
    category: 'retreat',
    speakers: ['Chaplain Team'],
    capacity: 100,
    registered: 63,
    image: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Leadership Workshop',
    date: '2024-02-05',
    time: '1:00 PM - 5:00 PM',
    location: 'Faculty of Social Sciences',
    description: 'Workshop on Christian leadership principles for student leaders and prefects.',
    category: 'workshop',
    speakers: ['Dr. Emmanuel Okonkwo', 'Mrs. Rebecca Johnson'],
    capacity: 80,
    registered: 42,
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format&fit=crop'
  }
];

// Categories for filtering
const categories = [
  { value: 'all', label: 'All Events' },
  { value: 'conference', label: 'Conferences' },
  { value: 'worship', label: 'Worship Services' },
  { value: 'academic', label: 'Academic Events' },
  { value: 'retreat', label: 'Retreats' },
  { value: 'workshop', label: 'Workshops' }
];

const ChapelEvents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Filter events based on search query, category and date
  const filteredEvents = chapelEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    const matchesDate = !selectedDate || 
                       format(new Date(event.date), 'yyyy-MM-dd') === 
                       format(selectedDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesCategory && matchesDate;
  });
  
  const handleRegister = (eventId: string) => {
    toast.success('Successfully registered for the event');
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDate(undefined);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold animate-fade-up">
            Chapel Events
          </h1>
          <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
            Explore upcoming services, conferences, and special events
          </p>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative col-span-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div>
                  <select 
                    className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={clearFilters}
                    disabled={!searchQuery && selectedCategory === 'all' && !selectedDate}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredEvents.length} of {chapelEvents.length} events
              </div>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <Card key={event.id} className="overflow-hidden h-full flex flex-col">
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="object-cover w-full h-full transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge variant="outline" className="capitalize">
                            {event.category}
                          </Badge>
                        </div>
                        <CardDescription>
                          {format(new Date(event.date), 'MMMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-3">
                          <div className="flex items-start text-sm">
                            <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-start text-sm">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-start text-sm">
                            <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                            <span>
                              {event.registered}/{event.capacity} registered
                            </span>
                          </div>
                          <p className="text-sm mt-2">{event.description}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full" 
                          onClick={() => handleRegister(event.id)}
                        >
                          Register for Event
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 py-12 text-center text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                    <h3 className="text-lg font-medium mb-1">No events found</h3>
                    <p className="text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Event Calendar</CardTitle>
                  <CardDescription>
                    View all upcoming chapel events by date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                    <h3 className="text-lg font-medium mb-1">Calendar View Coming Soon</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We're working on a calendar view to make planning easier.
                    </p>
                    <Button onClick={() => toast.info('Calendar view coming soon!')}>
                      Switch to Grid View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ChapelEvents;

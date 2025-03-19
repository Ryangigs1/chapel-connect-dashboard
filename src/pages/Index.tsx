
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, LayoutDashboard, MessageSquare, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import StudentList from '@/components/StudentList';
import Calendar from '@/components/Calendar';
import ChatBox from '@/components/ChatBox';
import { useAuth } from '@/lib/auth';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-background transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6 relative">
        {/* Watermark */}
        <div className="fixed bottom-4 right-4 text-sm text-muted-foreground/60 font-medium z-10">
          Faratech.inc
        </div>
        
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold animate-fade-up">
            MTU Chapel Connect Dashboard
          </h1>
          <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
            Welcome, {user?.name || 'User'}! Monitor attendance, manage events, and communicate with the chaplain
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1 animate-fade-up [animation-delay:150ms]">
            Mountain Top University - Prayer City, Ibafo, Ogun State
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="animate-fade-up [animation-delay:200ms]">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 transition-all duration-300">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2 transition-all duration-300">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 transition-all duration-300">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 animate-scale-in">
            <Dashboard />
            
            <div className="grid gap-6 md:grid-cols-2">
              <StudentList 
                filterAbsentees={true} 
                limit={5} 
                className="animate-fade-up [animation-delay:450ms]" 
              />
              
              <ChatBox className="animate-fade-up [animation-delay:550ms]" />
            </div>
          </TabsContent>
          
          <TabsContent value="students" className="animate-scale-in">
            <StudentList />
          </TabsContent>
          
          <TabsContent value="calendar" className="animate-scale-in">
            <Calendar />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

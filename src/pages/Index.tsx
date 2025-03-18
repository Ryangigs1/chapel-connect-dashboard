
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, LayoutDashboard, MessageSquare, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import StudentList from '@/components/StudentList';
import Calendar from '@/components/Calendar';
import ChatBox from '@/components/ChatBox';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold animate-fade-up">Chapel Connect Dashboard</h1>
          <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
            Monitor attendance, manage events, and communicate with the chaplain
          </p>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="animate-fade-up [animation-delay:200ms]">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
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
          
          <TabsContent value="students">
            <StudentList />
          </TabsContent>
          
          <TabsContent value="calendar">
            <Calendar />
          </TabsContent>
          
          <TabsContent value="messages">
            <div className="mx-auto max-w-2xl">
              <ChatBox />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

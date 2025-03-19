
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizontal, Bot, User, XCircle, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  className?: string;
}

// Knowledge base for the AI
const knowledgeBase = {
  faqs: [
    {
      question: ["what is this website", "what does this app do", "purpose of this app"],
      answer: "This is the Mountain Top University (MTU) Chapel Attendance System. It helps track student attendance at chapel services, manage absentees, and administer punishments for non-compliance."
    },
    {
      question: ["who built this", "developer", "creator"],
      answer: "This website was developed by Faratech Inc. for Mountain Top University."
    },
    {
      question: ["what is mtu", "mountain top university"],
      answer: "Mountain Top University (MTU) is a private Christian university in Nigeria, founded by Dr. D. K. Olukoya of the Mountain of Fire and Miracles Ministries. It's located in Prayer City, Ogun State, Nigeria."
    },
    {
      question: ["chapel attendance policy", "attendance rules", "absentee policy"],
      answer: "MTU requires all students to attend chapel services. Students with excessive absences may face disciplinary actions including counseling, community service, or other punishments."
    },
    {
      question: ["how to upload csv", "upload attendance", "import data"],
      answer: "Administrators can upload CSV files with attendance data by navigating to the Admin section and using the CSV Upload tool. The file should contain columns for names, matric numbers, levels, and absence counts."
    },
    {
      question: ["how many absences are allowed", "maximum absences", "absence limit"],
      answer: "While specific limits vary, generally students should maintain at least 90% attendance. More than 3 absences typically results in warning status, and more than 5 may require disciplinary action."
    },
    {
      question: ["what happens if i miss chapel", "consequences of absence", "missing service"],
      answer: "Students who miss chapel services without excuse may face disciplinary measures like community service, detention, or required counseling sessions. Repeated absences affect your standing with the university."
    },
    {
      question: ["how to contact chaplain", "speak to chaplain", "chaplain message"],
      answer: "You can contact the chaplain through the message system available on the dashboard. Simply type your message and the chaplain will respond soon."
    },
    {
      question: ["what is pmch", "what is mtu prays"],
      answer: "PMCH (Prayer Meeting/Chapel Hour) and MTU Prays are special prayer services held at Mountain Top University. These are mandatory services with separate attendance tracking."
    }
  ]
};

const AIChat = ({ className }: AIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Hello! I'm the MTU Chapel Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = generateResponse(input.trim());
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    
    // Check knowledge base
    for (const faq of knowledgeBase.faqs) {
      for (const q of faq.question) {
        if (lowercaseQuery.includes(q)) {
          return faq.answer;
        }
      }
    }
    
    // Default responses when no match found
    const defaultResponses = [
      "I'm not sure about that. Could you ask something about MTU's chapel attendance system?",
      "That's beyond my current knowledge. I can help with questions about chapel attendance, punishments, or the university.",
      "I don't have specific information on that. Try asking about attendance policies, the chaplain services, or using the system.",
      "I'm specialized in MTU chapel attendance information. Could you try a different question about that topic?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMinimize = () => {
    setMinimized(prev => !prev);
  };

  return (
    <Card className={cn("fixed bottom-20 right-6 w-80 md:w-96 z-40 shadow-lg border-primary/10", 
      minimized ? "h-14" : "h-96",
      className
    )}>
      <CardHeader className="p-3 flex flex-row items-center justify-between border-b">
        <div className="flex items-center">
          <Avatar className="h-7 w-7 mr-2">
            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            <AvatarImage src="/bot-avatar.png" />
          </Avatar>
          <div>
            <CardTitle className="text-sm">MTU Chapel Assistant</CardTitle>
            {!minimized && (
              <CardDescription className="text-xs">Ask me anything about the system</CardDescription>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={toggleMinimize}
        >
          {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {!minimized && (
        <>
          <CardContent className="p-3 overflow-y-auto flex-grow h-[calc(100%-7rem)]">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 max-w-[80%]",
                    message.sender === 'user' ? "ml-auto" : ""
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="h-7 w-7 mt-0.5">
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      <AvatarImage src="/bot-avatar.png" />
                    </Avatar>
                  )}
                  <div className={cn(
                    "rounded-lg p-2",
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-7 w-7 mt-0.5">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
              
              {loading && (
                <div className="flex gap-2">
                  <Avatar className="h-7 w-7 mt-0.5">
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0ms]"></div>
                      <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:150ms]"></div>
                      <div className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:300ms]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <div className="relative w-full flex items-center">
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
                disabled={loading}
              />
              <Button
                size="icon"
                className="absolute right-0 h-8 w-8 rounded-full"
                onClick={handleSend}
                disabled={!input.trim() || loading}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default AIChat;

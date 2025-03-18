import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizontal, User } from 'lucide-react';
import { mockMessages } from '@/utils/mockData';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ChatBoxProps {
  className?: string;
}

const ChatBox = ({ className }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    // Simulate sending a message
    setTimeout(() => {
      const message: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'You',
        content: newMessage.trim(),
        timestamp: new Date(),
        read: true,
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setSending(false);
      
      // Simulate chaplain response after a delay
      if (Math.random() > 0.3) { // 70% chance of getting a response
        setTimeout(() => {
          const responses = [
            "Thank you for your message. I'll respond in more detail soon.",
            "I've received your message and will get back to you shortly.",
            "Thanks for reaching out! I'll address this at our next meeting.",
            "I appreciate your message. Let's discuss this further at chapel tomorrow.",
          ];
          
          const response: Message = {
            id: Math.random().toString(36).substring(2, 9),
            sender: 'Chaplain',
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            read: false,
          };
          
          setMessages(prev => [...prev, response]);
          toast.success('New message from Chaplain');
        }, 3000 + Math.random() * 5000); // Random delay between 3-8 seconds
      }
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If it's today, just show the time
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'h:mm a');
    }
    
    // If it's yesterday, show "Yesterday" with time
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(messageDate, 'h:mm a')}`;
    }
    
    // Otherwise show full date
    return format(messageDate, 'MMM d, h:mm a');
  };

  return (
    <Card className={cn("flex flex-col h-[500px]", className)}>
      <CardHeader>
        <CardTitle>Chaplain Messages</CardTitle>
        <CardDescription>
          Direct messaging with the school chaplain
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.sender === 'You' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className={cn(
                "h-8 w-8",
                message.sender === 'You' ? "bg-primary" : "bg-secondary"
              )}>
                <AvatarFallback>
                  {message.sender === 'You' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    'C'
                  )}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                "rounded-lg p-3",
                message.sender === 'You' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {message.sender}
                  </span>
                  <span className="text-xs opacity-70">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-3">
        <div className="relative w-full flex items-center">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-12"
            disabled={sending}
          />
          <Button
            size="icon"
            className="absolute right-1 h-8 w-8"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatBox;

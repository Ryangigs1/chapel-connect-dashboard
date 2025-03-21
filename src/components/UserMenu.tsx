
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  LogOut, 
  User, 
  HelpCircle, 
  Moon, 
  Sun, 
  LifeBuoy, 
  Bookmark, 
  Image, 
  Calendar, 
  BookOpen, 
  Users, 
  Bell
} from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { ThemeToggle } from './ThemeToggle';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Function to get user initials for the avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border hover:ring-2 hover:ring-primary/10 transition-all">
            <AvatarImage src={user?.avatarUrl || ''} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('/dashboard')}>
          <Bookmark className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('/events')}>
          <Calendar className="mr-2 h-4 w-4" />
          <span>Events</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('/gallery')}>
          <Image className="mr-2 h-4 w-4" />
          <span>Gallery</span>
        </DropdownMenuItem>
        
        {user?.role === 'admin' && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('/admin')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigateTo('/index')}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Attendance</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <span className="mr-2">Theme</span>
              <ThemeToggle />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateTo('/profile')}>
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateTo('/profile')}>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => window.open('https://chapelapp.vercel.app/help', '_blank')}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

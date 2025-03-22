
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
  LogIn,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import UserMenu from './UserMenu';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link 
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
        isActive 
          ? 'bg-primary/10 text-primary font-medium'
          : 'hover:bg-secondary'
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const isPathActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Make sure we only show links to valid routes that exist in App.tsx
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/students', icon: Users, label: 'Students' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={isAuthenticated ? "/dashboard" : "/sign-in"} className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300" />
              C
            </div>
            <span className="font-semibold text-lg">Chapel Connect</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <NavItem
                  key={item.label}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={isPathActive(item.to)}
                />
              ))}
              <UserMenu />
            </>
          ) : (
            <Link to="/sign-in">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <NavItem
                    key={item.label}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={isPathActive(item.to)}
                    onClick={() => setMobileMenuOpen(false)}
                  />
                ))}
                <div className="py-2">
                  <UserMenu />
                </div>
              </>
            ) : (
              <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

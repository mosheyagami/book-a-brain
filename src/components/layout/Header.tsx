import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Zeerust Tutors</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/tutors" className="text-sm font-medium hover:text-primary">
            Find Tutors
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary">
            How it Works
          </Link>
          {user && (
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
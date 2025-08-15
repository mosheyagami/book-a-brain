import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SEO } from '@/components/common/SEO';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, MessageSquare, Star, BookOpen, Users, Settings, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    bookings: 0,
    messages: 0,
    earnings: 0,
    rating: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchStats();
    }
  }, [profile]);

  const fetchStats = async () => {
    if (!profile) return;
    
    try {
      // Fetch booking stats
      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .or(`tutor_id.eq.${profile.id},learner_id.eq.${profile.id}`);

      // Fetch message stats  
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', profile.id);

      setStats(prev => ({
        ...prev,
        bookings: bookingCount || 0,
        messages: messageCount || 0
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" message="Loading dashboard..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const isLearner = profile?.user_type === 'learner';
  const isTutor = profile?.user_type === 'tutor';

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Dashboard"
        description={`Welcome to your ${isLearner ? 'learning' : 'teaching'} dashboard. Manage bookings, messages, and profile.`}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            {isLearner && "Ready to learn something new today?"}
            {isTutor && "Ready to share your knowledge?"}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.bookings}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Messages Sent</p>
                  <p className="text-2xl font-bold">{stats.messages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          {isTutor && (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">R{stats.earnings}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rating</p>
                      <p className="text-2xl font-bold">{stats.rating || 'N/A'}</p>
                    </div>
                    <Star className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLearner && (
                <>
                  <Button variant="premium" asChild className="w-full">
                    <Link to="/tutors">Find Tutors</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/bookings">My Bookings</Link>
                  </Button>
                </>
              )}
              {isTutor && (
                <>
                  <Button variant="premium" asChild className="w-full">
                    <Link to="/profile">Update Profile</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/bookings">Manage Bookings</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                {isLearner ? "Your recent bookings" : "Recent booking requests"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No recent activity
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription>Recent conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                No new messages
              </div>
            </CardContent>
          </Card>

          {/* Profile Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Profile Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile completion:</span>
                  <span className="font-medium">
                    {profile?.bio ? '80%' : '60%'}
                  </span>
                </div>
                {!profile?.bio && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/profile">Complete Profile</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {isLearner ? "Reviews you've given" : "Your tutor ratings"}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/settings">Manage Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
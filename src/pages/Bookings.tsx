import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, MessageSquare, User, DollarSign, Check, X } from 'lucide-react';
import { format } from 'date-fns';

const Bookings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      fetchBookings();
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tutor:profiles!bookings_tutor_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url,
            phone,
            location
          ),
          learner:profiles!bookings_learner_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url,
            phone,
            location
          ),
          skill:skills!bookings_skill_id_fkey (
            name,
            category
          )
        `)
        .or(`tutor_id.eq.${profile.id},learner_id.eq.${profile.id}`)
        .order('lesson_date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const isTutor = profile?.user_type === 'tutor';

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || 
    b.status === 'cancelled' || 
    new Date(b.lesson_date) < new Date()
  );

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const BookingCard = ({ booking }: { booking: any }) => {
    const otherParty = isTutor ? booking.learner : booking.tutor;
    const initials = `${otherParty.first_name?.[0] || ''}${otherParty.last_name?.[0] || ''}`;
    
    return (
      <Card key={booking.id}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherParty.avatar_url} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {otherParty.first_name} {otherParty.last_name}
                </CardTitle>
                <CardDescription>
                  {isTutor ? 'Student' : 'Tutor'}
                </CardDescription>
              </div>
            </div>
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{booking.skill.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">R{booking.total_amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{format(new Date(booking.lesson_date), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {booking.start_time} - {booking.end_time} ({booking.duration_hours}h)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {booking.lesson_type === 'online' ? 'Online' : booking.location || 'Location TBD'}
              </span>
            </div>

            {booking.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-3">
              {booking.status === 'pending' && isTutor && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </>
              )}
              
              {(booking.status === 'confirmed' || booking.status === 'pending') && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to="/messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Link>
                </Button>
              )}

              {booking.status === 'confirmed' && new Date(booking.lesson_date) < new Date() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateBookingStatus(booking.id, 'completed')}
                  className="flex-1"
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your {isTutor ? 'teaching' : 'learning'} sessions
            </p>
          </div>

          <Tabs defaultValue="confirmed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {pendingBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed
                {confirmedBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {confirmedBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              <div className="space-y-4">
                {pendingBookings.length > 0 ? (
                  pendingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No pending bookings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isTutor 
                          ? 'New booking requests will appear here'
                          : 'Your booking requests will appear here while waiting for confirmation'
                        }
                      </p>
                      {!isTutor && (
                        <Button asChild>
                          <Link to="/tutors">Find Tutors</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-6">
              <div className="space-y-4">
                {confirmedBookings.length > 0 ? (
                  confirmedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No confirmed bookings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Confirmed lessons will appear here
                      </p>
                      {!isTutor && (
                        <Button asChild>
                          <Link to="/tutors">Book a Lesson</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              <div className="space-y-4">
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No past bookings</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed and cancelled lessons will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Bookings;
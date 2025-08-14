import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, MapPin, Phone, Mail, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { BookingDialog } from '@/components/bookings/BookingDialog';

const TutorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tutor, setTutor] = useState<any>(null);
  const [tutorSkills, setTutorSkills] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTutorProfile();
    }
  }, [id]);

  const fetchTutorProfile = async () => {
    try {
      // Fetch tutor profile
      const { data: tutorData, error: tutorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('user_type', 'tutor')
        .single();

      if (tutorError) throw tutorError;

      // Fetch tutor skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('tutor_skills')
        .select(`
          *,
          skills (
            id,
            name,
            category
          )
        `)
        .eq('tutor_id', id);

      if (skillsError) throw skillsError;

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('reviewee_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      setTutor(tutorData);
      setTutorSkills(skillsData || []);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching tutor profile:', error);
      toast({
        title: "Error",
        description: "Failed to load tutor profile",
        variant: "destructive",
      });
      navigate('/tutors');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Navigate to messages or open chat
    toast({
      title: "Feature Coming Soon",
      description: "Direct messaging will be available soon!",
    });
  };

  const handleBookLesson = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setShowBookingDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading tutor profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Tutor Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The tutor you're looking for doesn't exist or is no longer available.
            </p>
            <Button onClick={() => navigate('/tutors')}>
              Browse Other Tutors
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initials = `${tutor.first_name?.[0] || ''}${tutor.last_name?.[0] || ''}`;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const minRate = tutorSkills.length > 0 ? Math.min(...tutorSkills.map(s => s.hourly_rate)) : 0;
  const maxRate = tutorSkills.length > 0 ? Math.max(...tutorSkills.map(s => s.hourly_rate)) : 0;
  const rateDisplay = minRate === maxRate ? `R${minRate}` : `R${minRate}-${maxRate}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={tutor.avatar_url} alt={`${tutor.first_name} ${tutor.last_name}`} />
                    <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">
                      {tutor.first_name} {tutor.last_name}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{tutor.location || 'Location not specified'}</span>
                    </div>
                    {reviews.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">
                          ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">
                      {tutor.bio || 'This tutor hasn\'t added a bio yet.'}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="font-medium">{rateDisplay}/hour</span>
                    </div>
                    {tutor.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{tutor.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <span>{tutor.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button onClick={handleBookLesson} className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book a Lesson
                    </Button>
                    <Button variant="outline" onClick={handleSendMessage} className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Skills & Subjects */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Teaching Subjects</CardTitle>
                  <CardDescription>
                    Subjects this tutor teaches and their expertise levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tutorSkills.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {tutorSkills.map((tutorSkill) => (
                        <div key={tutorSkill.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="mb-2">
                              {tutorSkill.skills.name}
                            </Badge>
                            <span className="font-bold text-lg">
                              R{tutorSkill.hourly_rate}/hr
                            </span>
                          </div>
                          {tutorSkill.description && (
                            <p className="text-sm text-muted-foreground">
                              {tutorSkill.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      This tutor hasn't added any teaching subjects yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>
                    What students say about {tutor.first_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id}>
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.reviewer.avatar_url} />
                              <AvatarFallback>
                                {review.reviewer.first_name?.[0]}{review.reviewer.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">
                                  {review.reviewer.first_name} {review.reviewer.last_name}
                                </span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-muted-foreground">{review.comment}</p>
                              )}
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to book a lesson and leave a review!
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Sidebar */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleBookLesson} className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Lesson
                  </Button>
                  <Button variant="outline" onClick={handleSendMessage} className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  
                  <Separator />
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response rate:</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response time:</span>
                      <span className="font-medium">Within 1 hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons taught:</span>
                      <span className="font-medium">50+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {showBookingDialog && (
        <BookingDialog
          tutor={tutor}
          tutorSkills={tutorSkills}
          isOpen={showBookingDialog}
          onClose={() => setShowBookingDialog(false)}
        />
      )}
    </div>
  );
};

export default TutorProfile;
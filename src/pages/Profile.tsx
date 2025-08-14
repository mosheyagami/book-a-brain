import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Phone, Mail, Plus, X } from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [tutorSkills, setTutorSkills] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    phone: '',
    avatar_url: ''
  });

  const [newSkill, setNewSkill] = useState({
    skill_id: '',
    hourly_rate: '',
    description: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSkills();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        bio: data.bio || '',
        location: data.location || '',
        phone: data.phone || '',
        avatar_url: data.avatar_url || ''
      });

      if (data.user_type === 'tutor') {
        fetchTutorSkills(data.id);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchTutorSkills = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('tutor_skills')
        .select(`
          *,
          skills (
            id,
            name,
            category
          )
        `)
        .eq('tutor_id', profileId);

      if (error) throw error;
      setTutorSkills(data || []);
    } catch (error) {
      console.error('Error fetching tutor skills:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setProfile({ ...profile, ...formData });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!profile || !newSkill.skill_id || !newSkill.hourly_rate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tutor_skills')
        .insert([{
          tutor_id: profile.id,
          skill_id: newSkill.skill_id,
          hourly_rate: parseFloat(newSkill.hourly_rate),
          description: newSkill.description
        }])
        .select(`
          *,
          skills (
            id,
            name,
            category
          )
        `)
        .single();

      if (error) throw error;

      setTutorSkills([...tutorSkills, data]);
      setNewSkill({ skill_id: '', hourly_rate: '', description: '' });
      
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('tutor_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      setTutorSkills(tutorSkills.filter(s => s.id !== skillId));
      
      toast({
        title: "Success",
        description: "Skill removed successfully",
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const initials = `${formData.first_name?.[0] || ''}${formData.last_name?.[0] || ''}`;
  const isTutor = profile.user_type === 'tutor';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile information and {isTutor ? 'teaching skills' : 'learning preferences'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Image & Basic Info */}
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={formData.avatar_url} alt="Profile" />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {profile.user_type === 'tutor' ? 'Tutor Profile' : 'Learner Profile'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="avatar_url">Profile Picture URL</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder={isTutor ? "Tell students about your teaching experience and approach..." : "Tell tutors about your learning goals and preferences..."}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Zeerust, Online"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input value={profile.email} disabled />
                </div>

                <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Tutor Skills Section */}
            {isTutor && (
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Teaching Skills</CardTitle>
                  <CardDescription>
                    Manage the subjects you teach and your hourly rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Current Skills */}
                  {tutorSkills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Current Skills</h3>
                      <div className="space-y-3">
                        {tutorSkills.map((tutorSkill) => (
                          <div
                            key={tutorSkill.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary">
                                  {tutorSkill.skills.name}
                                </Badge>
                                <span className="font-medium text-lg">
                                  R{tutorSkill.hourly_rate}/hour
                                </span>
                              </div>
                              {tutorSkill.description && (
                                <p className="text-sm text-muted-foreground">
                                  {tutorSkill.description}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSkill(tutorSkill.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Skill */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-medium">Add New Skill</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="skill">Subject</Label>
                        <Select 
                          value={newSkill.skill_id} 
                          onValueChange={(value) => setNewSkill({ ...newSkill, skill_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a skill" />
                          </SelectTrigger>
                          <SelectContent>
                            {skills
                              .filter(skill => !tutorSkills.some(ts => ts.skill_id === skill.id))
                              .map((skill) => (
                                <SelectItem key={skill.id} value={skill.id}>
                                  {skill.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="hourly_rate">Hourly Rate (R)</Label>
                        <Input
                          id="hourly_rate"
                          type="number"
                          value={newSkill.hourly_rate}
                          onChange={(e) => setNewSkill({ ...newSkill, hourly_rate: e.target.value })}
                          placeholder="50"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="skill_description">Description (Optional)</Label>
                        <Input
                          id="skill_description"
                          value={newSkill.description}
                          onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                          placeholder="Teaching experience..."
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddSkill}
                      disabled={!newSkill.skill_id || !newSkill.hourly_rate}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
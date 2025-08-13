import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { TutorCard } from '@/components/tutors/TutorCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, MapPin } from 'lucide-react';

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    fetchTutors();
    fetchSkills();
  }, []);

  const fetchTutors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          tutor_skills (
            id,
            hourly_rate,
            description,
            skills (
              id,
              name,
              category
            )
          )
        `)
        .eq('user_type', 'tutor');

      if (error) throw error;

      // Transform the data to flatten skills
      const transformedTutors = data?.map(tutor => ({
        ...tutor,
        skills: tutor.tutor_skills?.map(ts => ({
          id: ts.skills.id,
          name: ts.skills.name,
          category: ts.skills.category,
          hourly_rate: ts.hourly_rate,
          description: ts.description
        })) || []
      })) || [];

      setTutors(transformedTutors);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    } finally {
      setLoading(false);
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

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSkill = selectedSkill === 'all' || 
      tutor.skills.some(skill => skill.id === selectedSkill);

    const matchesLocation = selectedLocation === 'all' || 
      tutor.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesPrice = priceRange === 'all' || (() => {
      const rates = tutor.skills.map(s => s.hourly_rate);
      const minRate = Math.min(...rates);
      
      switch (priceRange) {
        case 'under-50': return minRate < 50;
        case '50-100': return minRate >= 50 && minRate <= 100;
        case '100-200': return minRate >= 100 && minRate <= 200;
        case 'over-200': return minRate > 200;
        default: return true;
      }
    })();

    return matchesSearch && matchesSkill && matchesLocation && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading tutors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Tutor</h1>
          <p className="text-muted-foreground">
            Discover skilled tutors in your area or online
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutors or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="zeerust">Zeerust</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="gauteng">Gauteng</SelectItem>
                  <SelectItem value="north-west">North West</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-50">Under R50/hr</SelectItem>
                  <SelectItem value="50-100">R50-100/hr</SelectItem>
                  <SelectItem value="100-200">R100-200/hr</SelectItem>
                  <SelectItem value="over-200">Over R200/hr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {selectedSkill !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Subject: {skills.find(s => s.id === selectedSkill)?.name}
                  <button onClick={() => setSelectedSkill('all')} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {selectedLocation !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Location: {selectedLocation}
                  <button onClick={() => setSelectedLocation('all')} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Price: {priceRange}
                  <button onClick={() => setPriceRange('all')} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {filteredTutors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No tutors found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkill('all');
                  setSelectedLocation('all');
                  setPriceRange('all');
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Tutors;
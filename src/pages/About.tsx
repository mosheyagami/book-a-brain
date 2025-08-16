import { Header } from '@/components/layout/Header';
import { SEO } from '@/components/common/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Award, Heart, Star, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { icon: Users, label: 'Active Tutors', value: '500+' },
    { icon: BookOpen, label: 'Subjects Covered', value: '25+' },
    { icon: Star, label: 'Average Rating', value: '4.9' },
    { icon: Clock, label: 'Hours Taught', value: '10,000+' }
  ];

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards by carefully vetting all our tutors and ensuring quality education.'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building strong connections between learners and educators to foster meaningful educational relationships.'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Creating a safe, secure, and reliable platform where education can flourish with confidence.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Us"
        description="Learn about Zeerust Tutors - connecting passionate educators with eager learners in our community. Discover our mission, values, and commitment to quality education."
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Zeerust Tutors
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connecting passionate educators with eager learners to build a stronger, more educated community in Zeerust and beyond.
            </p>
            <div className="flex justify-center">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  To democratize quality education by creating accessible, personalized learning experiences 
                  that empower individuals to reach their full potential.
                </p>
              </div>
              
              <div className="prose prose-lg mx-auto text-center">
                <p>
                  We believe that everyone deserves access to quality education, regardless of their 
                  background or circumstances. Our platform bridges the gap between talented educators 
                  and motivated learners, creating opportunities for growth, discovery, and success.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg mx-auto">
                  <p>
                    Founded in the heart of Zeerust, our platform was born from a simple observation: 
                    talented educators and motivated learners often struggle to find each other. 
                    We saw an opportunity to create something meaningful - a space where knowledge 
                    could be shared freely and learning could happen naturally.
                  </p>
                  
                  <p>
                    What started as a local initiative has grown into a thriving community of educators 
                    and learners from diverse backgrounds. Our tutors bring expertise in subjects ranging 
                    from mathematics and science to music and creative arts, ensuring that every learner 
                    can find the guidance they need.
                  </p>
                  
                  <p>
                    Today, we're proud to be part of countless success stories - students who've 
                    overcome academic challenges, professionals who've acquired new skills, and 
                    educators who've found fulfilling ways to share their knowledge. This is just 
                    the beginning of our journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Find Your Tutor</h3>
              <p className="text-muted-foreground">
                Browse our extensive network of qualified tutors across various subjects and skill levels.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Your Session</h3>
              <p className="text-muted-foreground">
                Schedule flexible learning sessions that fit your schedule, whether online or in-person.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Learning</h3>
              <p className="text-muted-foreground">
                Engage in personalized learning experiences designed to help you achieve your goals.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join our community of learners and educators today. Whether you're looking to 
                learn something new or share your expertise, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/tutors">Find a Tutor</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">Join as Educator</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default About;
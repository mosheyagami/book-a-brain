import { SEO } from '@/components/common/SEO';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Contact Us - Zeerust Tutors"
        description="Get in touch with Zeerust Tutors. Contact us for questions about our tutoring services, technical support, or general inquiries."
        keywords={["contact", "Zeerust tutors", "support", "help", "tutoring inquiries"]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help. Get in touch with our team for any questions or support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <p className="font-medium">support@zeerrusttutors.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Call us during business hours for immediate assistance.
                </p>
                <p className="font-medium">+27 18 642 1234</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Office Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Visit us at our main office in Zeerust.
                </p>
                <p className="font-medium">
                  123 Education Street<br />
                  Zeerust, North West Province<br />
                  South Africa, 2865
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our support team is available during these hours.
                </p>
                <div className="space-y-1">
                  <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Before contacting us, you might find your answer in our{' '}
              <a href="#" className="text-primary hover:underline">FAQ section</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
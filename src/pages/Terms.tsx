import { SEO } from '@/components/common/SEO';
import { Header } from '@/components/layout/Header';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Terms of Service - Zeerust Tutors"
        description="Read the terms and conditions for using Zeerust Tutors platform. Understand your rights and responsibilities as a user."
        keywords={["terms of service", "terms and conditions", "Zeerust tutors", "user agreement"]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Zeerust Tutors platform, you accept and agree to be bound 
              by the terms and provision of this agreement. If you do not agree to abide by 
              the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p>
              Zeerust Tutors is an online platform that connects students with qualified tutors 
              for educational purposes. We facilitate the arrangement of tutoring sessions but 
              are not directly responsible for the content or quality of individual tutoring sessions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p>As a user of our platform, you agree to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the platform in a lawful and respectful manner</li>
              <li>Pay for services as agreed upon</li>
              <li>Respect the intellectual property rights of others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Tutor Requirements</h2>
            <p>Tutors using our platform must:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Have appropriate qualifications for subjects they teach</li>
              <li>Conduct themselves professionally during all interactions</li>
              <li>Provide quality educational services</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain student confidentiality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payment and Refunds</h2>
            <p>
              Payment terms are established between students and tutors. Our platform facilitates 
              secure payments but does not guarantee the outcome of tutoring sessions. Refund 
              policies are subject to individual tutor terms and our dispute resolution process.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>
              Zeerust Tutors shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of the platform 
              or services provided by tutors through our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend accounts that violate these terms 
              or engage in behavior that we deem harmful to our community.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the platform 
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@zeerrusttutors.com" className="text-primary hover:underline">
                legal@zeerrusttutors.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
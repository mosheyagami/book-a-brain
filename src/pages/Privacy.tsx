import { SEO } from '@/components/common/SEO';
import { Header } from '@/components/layout/Header';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy - Zeerust Tutors"
        description="Learn how Zeerust Tutors protects your privacy and handles your personal information. Read our comprehensive privacy policy."
        keywords={["privacy policy", "data protection", "Zeerust tutors", "personal information"]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              book a tutoring session, or contact us for support. This may include:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Name and contact information</li>
              <li>Educational background and subject preferences</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Provide and improve our tutoring services</li>
              <li>Match students with appropriate tutors</li>
              <li>Process payments and send notifications</li>
              <li>Communicate with you about your account and services</li>
              <li>Ensure the safety and security of our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share information:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>With tutors to facilitate matched sessions</li>
              <li>With service providers who help us operate our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transaction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@zeerrusttutors.com" className="text-primary hover:underline">
                privacy@zeerrusttutors.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  schema?: Record<string, any>;
}

export const SEO = ({
  title = 'Zeerust Tutors',
  description = 'Connect with qualified tutors in Zeerust and online. Find personalized learning solutions for all subjects and skill levels.',
  keywords = ['tutoring', 'education', 'Zeerust', 'online learning', 'tutors', 'South Africa'],
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  schema
}: SEOProps) => {
  const fullTitle = title === 'Zeerust Tutors' ? title : `${title} | Zeerust Tutors`;
  
  const structuredData = schema || {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Zeerust Tutors',
    description,
    url: window.location.origin,
    logo: `${window.location.origin}/logo.png`,
    areaServed: 'Zeerust, South Africa',
    serviceType: 'Online and In-Person Tutoring',
    knowsAbout: keywords.join(', ')
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Zeerust Tutors" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Zeerust Tutors" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
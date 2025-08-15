interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  user_id?: string;
}

class Analytics {
  private isProduction = process.env.NODE_ENV === 'production';
  
  track(event: string, properties?: Record<string, any>, userId?: string) {
    if (!this.isProduction) {
      console.log('Analytics Event:', { event, properties, userId });
      return;
    }
    
    // In production, you would send to your analytics service
    // Example: posthog, mixpanel, google analytics, etc.
    this.sendEvent({ event, properties, user_id: userId });
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.isProduction) {
      console.log('Analytics Identify:', { userId, traits });
      return;
    }
    
    // Send user identification to analytics service
  }

  page(name: string, properties?: Record<string, any>) {
    if (!this.isProduction) {
      console.log('Analytics Page:', { name, properties });
      return;
    }
    
    // Track page views
  }

  private sendEvent(event: AnalyticsEvent) {
    // Implement your analytics service integration here
    // For example, using fetch to send to your analytics endpoint
    
    if (typeof window !== 'undefined' && 'navigator' in window && 'sendBeacon' in navigator) {
      try {
        navigator.sendBeacon('/api/analytics', JSON.stringify(event));
      } catch (error) {
        console.warn('Failed to send analytics event:', error);
      }
    }
  }
}

export const analytics = new Analytics();
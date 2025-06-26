
import { useEffect } from 'react';

// Component to set security headers via meta tags
export const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy
    const csp = document.createElement('meta');
    csp.httpEquiv = 'Content-Security-Policy';
    csp.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://dtleadcbggplbegdzuqd.supabase.co;";
    document.head.appendChild(csp);

    // Set X-Frame-Options
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'DENY';
    document.head.appendChild(frameOptions);

    // Set X-Content-Type-Options
    const contentType = document.createElement('meta');
    contentType.httpEquiv = 'X-Content-Type-Options';
    contentType.content = 'nosniff';
    document.head.appendChild(contentType);

    // Set Referrer Policy
    const referrer = document.createElement('meta');
    referrer.name = 'referrer';
    referrer.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrer);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(csp);
      document.head.removeChild(frameOptions);
      document.head.removeChild(contentType);
      document.head.removeChild(referrer);
    };
  }, []);

  return null;
};

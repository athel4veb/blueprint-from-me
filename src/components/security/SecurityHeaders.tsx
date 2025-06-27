
import { useEffect } from 'react';

// Component to set security headers via meta tags
export const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy - more permissive for development
    const csp = document.createElement('meta');
    csp.httpEquiv = 'Content-Security-Policy';
    csp.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; style-src 'self' 'unsafe-inline' https: http:; img-src 'self' data: https: http:; connect-src 'self' https: http: wss: ws:; font-src 'self' https: http: data:; media-src 'self' https: http:; object-src 'none'; frame-src 'self' https:;";
    document.head.appendChild(csp);

    // Set X-Frame-Options - allow same origin
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'SAMEORIGIN';
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
      try {
        if (csp.parentNode) document.head.removeChild(csp);
        if (frameOptions.parentNode) document.head.removeChild(frameOptions);
        if (contentType.parentNode) document.head.removeChild(contentType);
        if (referrer.parentNode) document.head.removeChild(referrer);
      } catch (error) {
        // Ignore cleanup errors
        console.log('Security headers cleanup completed');
      }
    };
  }, []);

  return null;
};

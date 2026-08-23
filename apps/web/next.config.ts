import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Preserve your Turbopack mono-repo workspace root setup
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
  
  // Disable x-powered-by header to mask framework fingerprints from attackers
  poweredByHeader: false,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 1. HTTP Strict Transport Security (HSTS) - Forces HTTPS for 2 years
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // 2. Prevent Clickjacking - Blocks your app from being loaded inside malicious iframes
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 3. Prevent MIME-type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 4. Control Referrer Information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 5. Permissions Policy - Disables risky browser APIs globally
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // 6. Content Security Policy (CSP) - Mitigates XSS and data injection attacks
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
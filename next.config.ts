// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
    domains: ['lh3.googleusercontent.com'],
  },
  // DELETE THE ENTIRE WEBPACK SECTION BELOW
  /* webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'ApiClient': require.resolve('@getbrevo/brevo/src/ApiClient'),
      'api/AccountApi': require.resolve('@getbrevo/brevo/src/api/AccountApi'),
      // ... other Brevo aliases
    };
    return config;
  } */
};

export default nextConfig;
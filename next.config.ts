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
  webpack: (config) => {
    // Add aliases to fix @getbrevo/brevo imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'ApiClient': require.resolve('@getbrevo/brevo/src/ApiClient'),
      'api/AccountApi': require.resolve('@getbrevo/brevo/src/api/AccountApi'),
      'api/CompaniesApi': require.resolve('@getbrevo/brevo/src/api/CompaniesApi'),
      'api/ContactsApi': require.resolve('@getbrevo/brevo/src/api/ContactsApi'),
      'api/ConversationsApi': require.resolve('@getbrevo/brevo/src/api/ConversationsApi')
    };
    return config;
  }
};

export default nextConfig;
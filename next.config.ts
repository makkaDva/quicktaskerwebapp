import type { NextConfig } from "next";
import path from "path";

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
    // Add Brevo's src directory to module resolution paths
    config.resolve.modules.push(
      path.resolve(__dirname, 'node_modules/@getbrevo/brevo/src')
    );

    // Add specific aliases for critical modules if needed
    config.resolve.alias = {
      ...config.resolve.alias,
      'model/ErrorModel': path.resolve(__dirname, 'node_modules/@getbrevo/brevo/src/model/ErrorModel.js'),
      'model/GetAccount': path.resolve(__dirname, 'node_modules/@getbrevo/brevo/src/model/GetAccount.js'),
      'model/GetAccountActivity': path.resolve(__dirname, 'node_modules/@getbrevo/brevo/src/model/GetAccountActivity.js'),
    };

    return config;
  },
  // Transpile Brevo package if needed
  transpilePackages: ['@getbrevo/brevo'],
};

export default nextConfig;
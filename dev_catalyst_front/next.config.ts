import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // External packages configuration
  serverExternalPackages: [],

  // Silence monorepo lockfile root inference warning
  outputFileTracingRoot: path.join(__dirname, '..'),

  // API rewrites for development
  async rewrites() {
    return [
      {
        source: '/api/rails/:path*',
        destination: `${process.env.RAILS_API_URL || 'http://localhost:3000'}/:path*`,
      },
      {
        source: '/api/ai/:path*',
        destination: `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },

  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_RAILS_API_URL: process.env.NEXT_PUBLIC_RAILS_API_URL,
    NEXT_PUBLIC_AI_SERVICE_URL: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
  },
};

export default nextConfig;

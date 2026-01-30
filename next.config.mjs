/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for better global access
  poweredByHeader: false,
  
  // Improve caching for better reliability
  compress: true,
  
  // Better handling of edge cases
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Headers for better security and compatibility
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;


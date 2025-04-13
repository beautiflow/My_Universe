/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/satellites/:path*',
        destination: 'https://api.n2yo.com/rest/v1/satellite/:path*',
      },
    ];
  },
}

module.exports = nextConfig
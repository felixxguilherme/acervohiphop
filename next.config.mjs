/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
      domains: ['images.unsplash.com', 'external-content.duckduckgo.com', 'base.acervodistritohiphop.com.br'],
      unoptimized: true,
      minimumCacheTTL: 60,
    },
    experimental: {
      scrollRestoration: true,
    },
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
};

export default nextConfig;

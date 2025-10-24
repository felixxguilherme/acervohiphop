/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
    domains: ['images.unsplash.com', 'external-content.duckduckgo.com'],
    // Ou para permitir qualquer domínio (não recomendado para produção):
    unoptimized: true,
  },
};

export default nextConfig;

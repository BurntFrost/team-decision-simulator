// @ts-check

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'export',
  assetPrefix: "",
  // Add output tracing for optimized static exports
  trailingSlash: true, // Better for GitHub Pages path handling
  // Enable compression for smaller bundle sizes
  compress: true,
  // Disable telemetry for faster builds
  // telemetry has been moved inside the appropriate config structure
  // swcMinify is now enabled by default in Next.js 13+
  reactStrictMode: true,
  poweredByHeader: false,
  // Optimize build performance
  experimental: {
    // Updated turbo config with rules instead of loaders
    turbo: {
      rules: {
        // Add any custom rules if needed
        // Example: "*.mdx": ["mdx-loader"]
      },
    },
    // memoryOptimizer was removed as it's not a recognized option
  },
  images: {
    unoptimized: true, // Use unoptimized images for static SVGs
    domains: [],
  },
  // Add performance measurement
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = process.env.ANALYZE === 'true' 
  ? withBundleAnalyzer(nextConfig)
  : nextConfig; 
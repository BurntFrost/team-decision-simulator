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
  telemetry: { 
    disabled: true 
  },
  // Optimize build performance
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Enable Turbopack for builds
  experimental: {
    turbo: {
      // Enable Turbopack for builds
      loaders: {
        // Add any custom loaders if needed
      },
    },
    // Optimize memory usage during builds
    memoryOptimizer: {
      enabled: true,
    },
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
// @ts-check

/** @type {import('next').NextConfig} */
module.exports = {
  /* config options here */
  assetPrefix: "",
  // Add output tracing for optimized static exports
  output: "export",
  trailingSlash: true, // Better for GitHub Pages path handling
  // Enable compression for smaller bundle sizes
  compress: true,
  // Enable Turbopack for builds
  experimental: {
    turbo: {
      // Enable Turbopack for builds
      loaders: {
        // Add any custom loaders if needed
      },
    },
  },
  images: {
    unoptimized: true, // Use unoptimized images for static SVGs
    domains: [],
  },
}; 
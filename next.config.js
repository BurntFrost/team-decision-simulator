// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  assetPrefix: '',
  images: {
    unoptimized: true,  // Use unoptimized images for static SVGs
    domains: [],
  }
};

export default nextConfig; 
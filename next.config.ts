import type { NextConfig } from "next";

// Import the bundle analyzer plugin
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    // Enable image optimization with modern formats
    formats: ['image/webp', 'image/avif'],
    // Allow optimization of local images
    unoptimized: false,
    // Configure device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Configure image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// Wrap the Next.js config with the bundle analyzer
export default withBundleAnalyzer(nextConfig);

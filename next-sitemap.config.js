/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  exclude: ['/404', '/500'],
  // Add any additional paths to exclude
}; 
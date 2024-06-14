/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITEMAP_URL || 'https://www.thankly.co',
  generateRobotsTxt: true, // (optional)
  generateIndexSitemap: false,
  sitemapSize: 100,
  exclude: ['/payload', '/admin', '/login', '/logout'],
  // ...other options
}

/** @type {import('next-sitemap').IConfig} */
const siteUrl =
  process.env.NEXT_PUBLIC_HOST ??
  process.env.FLY_APP_NAME ??
  "https://localhost:3000";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    "/blog*",
    "/test*",
    "/sitemap-dynamic.xml",
    // which covers...
    "/services/*",
  ],
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/sitemap-dynamic.xml`],
  },
};

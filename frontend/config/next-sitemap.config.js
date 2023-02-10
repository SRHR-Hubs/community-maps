/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_HOST || process.env.FLY_APP_NAME || 'https://localhost:3000', // TODO
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: [
        '/blog*',
    ]
}
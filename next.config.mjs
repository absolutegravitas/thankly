import { withPayload } from '@payloadcms/next/withPayload'
/** @type {import('next').NextConfig} */

import policies from './csp.js'
// import redirects from './redirects.js'

const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  eslint: { ignoreDuringBuilds: true },
  // redirects,

  images: {
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: policies, //"default-src 'self'; script-src 'none'; sandbox; ",
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: `${process.env.NEXT_PUBLIC_SERVER_URL}` },
      { protocol: 'http', hostname: `localhost` },
      { protocol: 'https', hostname: '**thankly.co**' },
      { protocol: 'https', hostname: '**thankly.com.au**' },
      { protocol: 'https', hostname: '**thankly.vercel.app**' },
      { protocol: 'https', hostname: '**tailwindui.com**' },
      { protocol: 'https', hostname: '**gravatar.com**' },
      { protocol: 'https', hostname: '**google.com.au**' },
      { protocol: 'https', hostname: '**api.radar.io**' },
      { protocol: 'https', hostname: '**placehold.co**' },
      { protocol: 'https', hostname: '**authjs.dev**' }, // for auth providers
      { protocol: 'https', hostname: '**lh3.googleusercontent.com**' }, // for user avatars - google
      { protocol: 'https', hostname: '**media.licdn.com**' }, // for user avatars - linkedin
      { protocol: 'https', hostname: '**platform-lookaside.fbsbx.com**' }, // for user avatars - facebook
    ],
    domains: ['lh3.googleusercontent.com'],
  },
  async headers() {
    const headers = []

    // Prevent search engines from indexing the site if it is not live
    // This is useful for staging environments before they are ready to go live
    // To allow robots to crawl the site, use the `NEXT_PUBLIC_IS_LIVE` env variable
    // You may want to also use this variable to conditionally render any tracking scripts
    if (!process.env.NEXT_PUBLIC_IS_LIVE) {
      headers.push({
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
        source: '/:path*',
      })
    }

    // Set the `Content-Security-Policy` header as a security measure to prevent XSS attacks
    // It works by explicitly whitelisting trusted sources of content for your website
    // This will block all inline scripts and styles except for those that are allowed
    headers.push({
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: policies,
        },
      ],
    })

    return headers
  },
}

export default withPayload(nextConfig)

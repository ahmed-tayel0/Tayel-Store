import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ecommerce.routemisr.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Note: Tailwind v4 uses PostCSS plugin (postcss.config.js)
  // Turbopack plugin config is handled automatically by @tailwindcss/turbopack
};

export default withNextIntl(nextConfig);
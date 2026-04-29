import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {

  // Optimize JavaScript for modern browsers - NO TRANSPILE for ES6+
  // This eliminates unnecessary polyfills and transforms
  transpilePackages: [],

  // Optimize JavaScript for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'espiritudelcafe.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '**.hostingersite.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'wh1255202.ispot.cc',
        pathname: '/**'
      }
    ]
  },

  // Experimental features for performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

// Sentry configuration
export default withSentryConfig(nextConfig, {
  // Para más opciones de configuración: https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Solo subir source maps en producción
  silent: !process.env.CI,

  // Suprimir logs durante el build
  widenClientFileUpload: true,

  // Ocultar source maps de ser públicamente accesibles
  hideSourceMaps: true,

  // Automáticamente anotar errores con información adicional
  webpack: {
    autoInstrumentServerFunctions: true,
    autoInstrumentMiddleware: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

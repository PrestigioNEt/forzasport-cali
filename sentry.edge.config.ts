import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ajustar el sample rate según necesidad (0.0 a 1.0)
  tracesSampleRate: 0.1,

  // Solo habilitar en producción
  enabled: process.env.NODE_ENV === 'production',
});

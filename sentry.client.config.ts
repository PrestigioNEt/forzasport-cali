import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ajustar el sample rate según necesidad (0.0 a 1.0)
  // 1.0 = captura 100% de los eventos
  tracesSampleRate: 0.1,

  // Solo habilitar en producción
  enabled: process.env.NODE_ENV === 'production',

  // Configuración de sesión de replay
  replaysSessionSampleRate: 0.1, // 10% de sesiones
  replaysOnErrorSampleRate: 1.0, // 100% cuando hay error

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filtrar información sensible
  beforeSend(event) {
    // No enviar información de variables de entorno sensibles
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});

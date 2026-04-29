import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ajustar el sample rate según necesidad (0.0 a 1.0)
  tracesSampleRate: 0.1,

  // Solo habilitar en producción
  enabled: process.env.NODE_ENV === 'production',

  // Filtrar información sensible
  beforeSend(event) {
    // Remover tokens y secretos de los eventos
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['Cookie'];
    }
    return event;
  },
});

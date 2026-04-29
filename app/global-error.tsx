'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log critical errors to Sentry
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'global',
        critical: true,
        digest: error.digest,
      },
      level: 'fatal',
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold">Error Global</h2>
            <p className="mb-6 text-gray-600">
              Ha ocurrido un error crítico. Por favor, recarga la página.
            </p>
            <button
              onClick={reset}
              className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              Recargar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

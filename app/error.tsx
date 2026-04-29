'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry monitoring service
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'app',
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold">Algo salió mal</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>
  );
}

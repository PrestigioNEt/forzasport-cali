'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      // console.log('[Web Vitals]', metric); // Deshabilitado para limpiar la consola
    }

    // Send to analytics in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true
      });
    }

    // Send to dataLayer for GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'web-vitals',
        metric_name: metric.name,
        metric_value: metric.value,
        metric_id: metric.id,
        metric_rating: metric.rating
      });
    }
  });

  return null;
}

// Declaraciones globales para TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

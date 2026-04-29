import { useCallback } from 'react';

export interface SearchAnalyticsEvent {
  query: string;
  timestamp: number;
  resultsCount: number;
  clickedResult?: {
    type: 'product' | 'collection';
    id: string;
    title: string;
  };
}

export function useSearchAnalytics() {
  const trackSearch = useCallback((query: string, resultsCount: number) => {
    const event: SearchAnalyticsEvent = {
      query,
      timestamp: Date.now(),
      resultsCount
    };

    // Aquí puedes integrar con tu servicio de analytics preferido
    // Por ejemplo: Google Analytics, Mixpanel, Segment, etc.

    // Para desarrollo, solo logueamos en consola
    if (process.env.NODE_ENV === 'development') {
      console.log('[Search Analytics] Search:', event);
    }

    // Ejemplo de integración con Google Analytics (si está disponible)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        results_count: resultsCount
      });
    }

    // Ejemplo de integración con dataLayer (Google Tag Manager)
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'search',
        search_term: query,
        results_count: resultsCount
      });
    }
  }, []);

  const trackClick = useCallback(
    (query: string, resultType: 'product' | 'collection', resultId: string, resultTitle: string) => {
      const event = {
        query,
        timestamp: Date.now(),
        clickedResult: {
          type: resultType,
          id: resultId,
          title: resultTitle
        }
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('[Search Analytics] Click:', event);
      }

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'select_content', {
          content_type: resultType,
          content_id: resultId,
          search_term: query
        });
      }

      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'search_result_click',
          search_term: query,
          result_type: resultType,
          result_id: resultId,
          result_title: resultTitle
        });
      }
    },
    []
  );

  const trackNoResults = useCallback((query: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Search Analytics] No results for:', query);
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search_no_results', {
        search_term: query
      });
    }

    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'search_no_results',
        search_term: query
      });
    }
  }, []);

  return {
    trackSearch,
    trackClick,
    trackNoResults
  };
}

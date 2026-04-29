import { PredictiveSearchResult } from 'lib/shopify/types';
import { useCallback, useRef } from 'react';

interface CacheEntry {
  data: PredictiveSearchResult;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const MAX_CACHE_SIZE = 50; // Máximo 50 búsquedas en caché

export function useSearchCache() {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const get = useCallback((query: string): PredictiveSearchResult | null => {
    const entry = cacheRef.current.get(query);

    if (!entry) {
      return null;
    }

    // Verificar si el caché expiró
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      cacheRef.current.delete(query);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback((query: string, data: PredictiveSearchResult) => {
    // Implementar LRU simple: si excedemos el tamaño, eliminar la entrada más antigua
    if (cacheRef.current.size >= MAX_CACHE_SIZE) {
      const firstKey = cacheRef.current.keys().next().value;
      if (firstKey) {
        cacheRef.current.delete(firstKey);
      }
    }

    cacheRef.current.set(query, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { get, set, clear };
}

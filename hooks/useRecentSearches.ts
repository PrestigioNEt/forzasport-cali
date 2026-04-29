import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'recent-searches';
const MAX_RECENT_SEARCHES = 5;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Cargar búsquedas recientes del localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentSearches(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  const addSearch = useCallback((query: string) => {
    if (!query || query.trim().length < 2) return;

    setRecentSearches((prev) => {
      // Remover duplicados y agregar al inicio
      const filtered = prev.filter((s) => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      // Guardar en localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error saving recent searches:', error);
        }
      }

      return updated;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== query);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error removing search:', error);
        }
      }

      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error clearing searches:', error);
      }
    }
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll
  };
}

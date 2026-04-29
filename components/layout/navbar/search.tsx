'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebounce } from 'hooks/useDebounce';
import { useRecentSearches } from 'hooks/useRecentSearches';
import { useSearchAnalytics } from 'hooks/useSearchAnalytics';
import { useSearchCache } from 'hooks/useSearchCache';
import { searchPredictive } from 'lib/actions/search';
import { PredictiveSearchResult } from 'lib/shopify/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { SearchDropdown } from './search-dropdown';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [results, setResults] = useState<PredictiveSearchResult>({
    queries: [],
    products: [],
    collections: []
  });
  const [isPending, startTransition] = useTransition();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cache = useSearchCache();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();
  const { trackSearch } = useSearchAnalytics();

  // Calcular total de items para navegación
  const totalItems = useMemo(() => {
    if (!searchQuery && recentSearches.length > 0) {
      return recentSearches.length;
    }
    return results.products.length + results.collections.length + (results.products.length > 0 || results.collections.length > 0 ? 1 : 0); // +1 para "Ver todos"
  }, [results, searchQuery, recentSearches]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ejecutar búsqueda predictiva cuando cambia el query debounced
  useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      // Verificar si existe en caché
      const cachedResults = cache.get(debouncedSearchQuery);

      if (cachedResults) {
        setResults(cachedResults);
        setIsOpen(true);
        trackSearch(debouncedSearchQuery, cachedResults.products.length + cachedResults.collections.length);
      } else {
        // Si no está en caché, hacer la búsqueda
        startTransition(async () => {
          const searchResults = await searchPredictive(debouncedSearchQuery);
          setResults(searchResults);
          cache.set(debouncedSearchQuery, searchResults);
          setIsOpen(true);
          trackSearch(debouncedSearchQuery, searchResults.products.length + searchResults.collections.length);
        });
      }
      setSelectedIndex(-1);
    } else {
      setResults({ queries: [], products: [], collections: [] });
      if (!searchQuery && recentSearches.length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      setSelectedIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, searchQuery, recentSearches.length]);

  // Manejar navegación con teclado
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' && (recentSearches.length > 0 || searchQuery.length >= 2)) {
          setIsOpen(true);
          setSelectedIndex(0);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            // El comportamiento de Enter se maneja en el dropdown
            // aquí solo prevenimos el submit del formulario
          } else {
            // Si no hay selección, submit normal del formulario
            if (searchQuery) {
              addSearch(searchQuery);
            }
          }
          break;
      }
    },
    [isOpen, selectedIndex, totalItems, recentSearches.length, searchQuery, addSearch]
  );

  const handleRecentSearchClick = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    },
    [router]
  );

  const handleSubmit = useCallback(() => {
    if (searchQuery) {
      addSearch(searchQuery);
    }
  }, [searchQuery, addSearch]);

  return (
    <div ref={searchRef} className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <form action="/search" onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          name="q"
          placeholder="Buscar productos..."
          autoComplete="off"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (debouncedSearchQuery.length >= 2 || recentSearches.length > 0) {
              setIsOpen(true);
            }
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `search-item-${selectedIndex}` : undefined}
          className="text-md w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
        />
        <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
          <MagnifyingGlassIcon className="h-4" />
        </div>
      </form>

      {isOpen && (
        <SearchDropdown
          results={results}
          isLoading={isPending}
          onClose={() => {
            setIsOpen(false);
            setSelectedIndex(-1);
          }}
          searchQuery={debouncedSearchQuery}
          selectedIndex={selectedIndex}
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
          onRemoveRecentSearch={removeSearch}
        />
      )}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Buscar productos..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}

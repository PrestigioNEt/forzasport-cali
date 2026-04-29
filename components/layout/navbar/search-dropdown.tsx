'use client';

import Image from 'next/image';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSearchAnalytics } from 'hooks/useSearchAnalytics';
import { highlightText } from 'lib/utils/highlight';
import { PredictiveSearchResult } from 'lib/shopify/types';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';

interface SearchDropdownProps {
  results: PredictiveSearchResult;
  isLoading: boolean;
  onClose: () => void;
  searchQuery: string;
  selectedIndex: number;
  recentSearches: string[];
  onRecentSearchClick: (query: string) => void;
  onRemoveRecentSearch: (query: string) => void;
}

interface SearchItem {
  type: 'product' | 'collection' | 'viewAll' | 'recent';
  id: string;
  title: string;
  url: string;
  image?: string;
  imageAlt?: string;
  price?: string;
}

export function SearchDropdown({
  results,
  isLoading,
  onClose,
  searchQuery,
  selectedIndex,
  recentSearches,
  onRecentSearchClick,
  onRemoveRecentSearch
}: SearchDropdownProps) {
  const { trackClick, trackNoResults } = useSearchAnalytics();
  const selectedRef = useRef<HTMLAnchorElement>(null);

  const hasResults = results.products.length > 0 || results.collections.length > 0;
  const showRecentSearches = !searchQuery && recentSearches.length > 0;

  // Crear array plano de todos los items para navegación con teclado
  const allItems: SearchItem[] = useMemo(() => {
    if (showRecentSearches) {
      return recentSearches.map((query) => ({
        type: 'recent' as const,
        id: `recent-${query}`,
        title: query,
        url: `/search?q=${encodeURIComponent(query)}`
      }));
    }

    const items: SearchItem[] = [];

    results.products.forEach((product) => {
      items.push({
        type: 'product',
        id: product.id,
        title: product.title,
        url: `/products/${product.handle}`,
        image: product.featuredImage?.url,
        imageAlt: product.featuredImage?.altText,
        price: new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: product.priceRange.minVariantPrice.currencyCode
        }).format(parseFloat(product.priceRange.minVariantPrice.amount) || 0)
      });
    });

    results.collections.forEach((collection) => {
      items.push({
        type: 'collection',
        id: collection.id,
        title: collection.title,
        url: `/search/${collection.handle}`
      });
    });

    if (searchQuery && hasResults) {
      items.push({
        type: 'viewAll',
        id: 'view-all',
        title: `Ver todos los resultados para "${searchQuery}"`,
        url: `/search?q=${encodeURIComponent(searchQuery)}`
      });
    }

    return items;
  }, [results, searchQuery, hasResults, recentSearches, showRecentSearches]);

  // Scroll al elemento seleccionado
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Track cuando no hay resultados
  useEffect(() => {
    if (searchQuery && !isLoading && !hasResults) {
      trackNoResults(searchQuery);
    }
  }, [searchQuery, isLoading, hasResults, trackNoResults]);

  const handleItemClick = (item: SearchItem) => {
    if (item.type === 'recent') {
      onRecentSearchClick(item.title);
    } else if (item.type !== 'viewAll') {
      trackClick(searchQuery, item.type, item.id, item.title);
    }
    onClose();
  };

  if (!searchQuery && !showRecentSearches) {
    return null;
  }

  return (
    <div
      role="listbox"
      aria-label="Resultados de búsqueda"
      className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-black"
    >
      <div className="max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <SearchDropdownSkeleton />
          </div>
        ) : showRecentSearches ? (
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              Búsquedas recientes
            </div>
            {allItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative flex items-center justify-between"
              >
                <Link
                  ref={selectedIndex === index ? selectedRef : null}
                  href={item.url}
                  onClick={() => handleItemClick(item)}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    selectedIndex === index
                      ? 'bg-neutral-200 dark:bg-neutral-800'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <ClockIcon className="h-4 w-4 text-neutral-500" />
                  <span className="text-black dark:text-white">{item.title}</span>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveRecentSearch(item.title);
                  }}
                  className="absolute right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Eliminar "${item.title}"`}
                >
                  <XMarkIcon className="h-4 w-4 text-neutral-500 hover:text-black dark:hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : hasResults ? (
          <div className="p-2">
            {/* Productos */}
            {results.products.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                  Productos
                </div>
                {results.products.map((product, productIndex) => {
                  const itemIndex = productIndex;
                  const isSelected = selectedIndex === itemIndex;
                  return (
                    <Link
                      key={product.id}
                      ref={isSelected ? selectedRef : null}
                      href={`/products/${product.handle}`}
                      onClick={() =>
                        handleItemClick({
                          type: 'product',
                          id: product.id,
                          title: product.title,
                          url: `/products/${product.handle}`
                        })
                      }
                      role="option"
                      aria-selected={isSelected}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 ${
                        isSelected
                          ? 'bg-neutral-200 dark:bg-neutral-800'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      {product.featuredImage && (
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-black dark:text-white">
                          {highlightText(product.title, searchQuery)}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: product.priceRange.minVariantPrice.currencyCode
                          }).format(parseFloat(product.priceRange.minVariantPrice.amount) || 0)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Colecciones */}
            {results.collections.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                  Colecciones
                </div>
                {results.collections.map((collection, collectionIndex) => {
                  const itemIndex = results.products.length + collectionIndex;
                  const isSelected = selectedIndex === itemIndex;
                  return (
                    <Link
                      key={collection.id}
                      ref={isSelected ? selectedRef : null}
                      href={`/search/${collection.handle}`}
                      onClick={() =>
                        handleItemClick({
                          type: 'collection',
                          id: collection.id,
                          title: collection.title,
                          url: `/search/${collection.handle}`
                        })
                      }
                      role="option"
                      aria-selected={isSelected}
                      className={`block rounded-md px-3 py-2 text-sm ${
                        isSelected
                          ? 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white'
                          : 'text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900'
                      }`}
                    >
                      {highlightText(collection.title, searchQuery)}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Ver todos los resultados */}
            <div className="border-t border-neutral-200 pt-2 dark:border-neutral-800">
              {(() => {
                const itemIndex = results.products.length + results.collections.length;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <Link
                    ref={isSelected ? selectedRef : null}
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={onClose}
                    role="option"
                    aria-selected={isSelected}
                    className={`block rounded-md px-3 py-2 text-center text-sm font-medium ${
                      isSelected
                        ? 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white'
                        : 'text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-900'
                    }`}
                  >
                    Ver todos los resultados para &quot;{searchQuery}&quot;
                  </Link>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No se encontraron resultados para &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchDropdownSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

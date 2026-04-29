'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { CategoryDropdown } from './category-dropdown';
import { CartIcon } from '@/components/cart/CartIcon';

/**
 * NAVBAR CLIENT COMPONENT - WooCommerce
 * Maneja toda la interactividad: mobile menu, búsqueda, etc.
 */

interface Category {
  title: string;
  path: string;
}

interface WooNavbarClientProps {
  categories: Category[];
  SITE_NAME: string;
}

// Mobile Menu Button
function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open mobile menu"
      className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-700 text-white hover:bg-gray-800 transition-colors md:hidden"
    >
      <Bars3Icon className="h-6 w-6" />
    </button>
  );
}

// Search Component
function WooSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda con debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.products || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          name="q"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 mr-3 flex h-full items-center text-gray-400 hover:text-gray-600"
          aria-label="Buscar"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <MagnifyingGlassIcon className="h-4 w-4" />
          )}
        </button>
      </form>

      {/* Resultados de búsqueda */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.handle}`}
              onClick={() => {
                setShowResults(false);
                setSearchQuery('');
              }}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.altText}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.title}
                </p>
                <p className="text-sm text-gray-600">
                  {product.priceDisplay}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href={`/search?q=${encodeURIComponent(searchQuery)}`}
            onClick={() => {
              setShowResults(false);
            }}
            className="block w-full text-center py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-200"
          >
            Ver todos los resultados →
          </Link>
        </div>
      )}

      {/* Sin resultados */}
      {showResults && searchQuery.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <p className="text-sm text-gray-500 text-center">
            No se encontraron productos para "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}

// Mobile Menu
function WooMobileMenu({
  isOpen,
  onClose,
  categories,
  SITE_NAME
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  SITE_NAME: string;
}) {
  const pathname = usePathname();

  // Cerrar menú al cambiar de ruta
  if (isOpen && pathname) {
    // Se mantendrá abierto si el usuario lo quiere
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full animate-in slide-in-from-left max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <span className="text-lg font-semibold">{SITE_NAME}</span>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors"
            aria-label="Cerrar menú"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Search in mobile */}
          <div className="mb-6">
            <WooSearch />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={onClose}
              className="border-b border-gray-100 py-3 text-lg font-medium text-gray-900 hover:text-gray-600"
            >
              Inicio
            </Link>
            <Link
              href="/search"
              onClick={onClose}
              className="border-b border-gray-100 py-3 text-lg font-medium text-gray-900 hover:text-gray-600"
            >
              Ver Productos
            </Link>
            {categories.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className="border-b border-gray-100 py-3 text-lg font-medium text-gray-900 hover:text-gray-600"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

// Main Client Component
export function WooNavbarClient({ categories, SITE_NAME }: WooNavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`flex items-center justify-between border-b backdrop-blur-sm p-4 lg:px-6 transition-all duration-300 fixed top-0 left-0 right-0 z-50 ${
        isScrolled
          ? 'border-gray-700 bg-gray-900/95 shadow-lg'
          : 'border-transparent bg-transparent shadow-none'
      }`}>
        {/* Mobile Menu Button */}
        <div className="block flex-none md:hidden">
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
        </div>

        <div className="flex w-full items-center">
          {/* Logo + Categories */}
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <div className="flex h-16 w-16 flex-none items-center justify-center rounded-lg border border-gray-700 bg-gray-800 overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="Forza Sport"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden gap-6 text-sm md:flex md:items-center">
              <Link
                href="/search"
                prefetch={true}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Productos
              </Link>
              <CategoryDropdown categories={categories} />
            </div>
          </div>

          {/* Search */}
          <div className="hidden justify-center md:flex md:w-1/3 px-4">
            <WooSearch />
          </div>

          {/* Cart */}
          <div className="flex justify-end md:w-1/3">
            <CartIcon />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <WooMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        SITE_NAME={SITE_NAME}
      />
    </>
  );
}

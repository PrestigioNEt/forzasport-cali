'use client'
import Link from 'next/link';
import Image from 'next/image';

import { Search, User, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CartModal from 'components/cart/modal';
import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import type { Collection } from 'lib/shopify/types';
import SearchComponent from 'components/layout/navbar/search';

// IMPORTANTE: Verificar que estas colecciones existan en Shopify con estos handles exactos
// Ajustar los handles según las colecciones reales en tu tienda Shopify
const navLinks = [
  { href: "/search", text: "Tienda", highlight: false, hasDropdown: false },
  { href: "/search", text: "Categorías", highlight: false, hasDropdown: true },
  { href: "/search", text: "Sale", highlight: true, hasDropdown: false },
];

interface NavbarIntegratedProps {
  variant?: 'transparent' | 'solid';
  collections?: Collection[];
}

export default function NavbarIntegrated({ variant = 'transparent', collections = [] }: NavbarIntegratedProps) {
  const pathname = usePathname();
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

  // Si estamos en páginas de búsqueda/catálogo o producto, forzar variant solid
  const isSearchOrProductPage = pathname?.startsWith('/search') || pathname?.startsWith('/products');
  const isSolidVariant = variant === 'solid' || isSearchOrProductPage;

  const [isScrolled, setIsScrolled] = useState(isSolidVariant);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  // Filtrar colecciones visibles (excluir "All" y las ocultas)
  const visibleCollections = collections.filter(c => c.handle !== '' && !c.handle.startsWith('hidden'));

  useEffect(() => {
    // Si la variante es sólida, no necesitamos el listener de scroll.
    if (isSolidVariant) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSolidVariant]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);


  // Cerrar dropdown de categorías al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesOpen]);

  // Cerrar dropdowns cuando cambia la ruta
  useEffect(() => {
    setIsCategoriesOpen(false);
    setIsMobileCategoriesOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-10 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || isSolidVariant
            ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800'
            : 'bg-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 py-3 flex items-center justify-between relative">

            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 2).map((link) => (
                link.hasDropdown ? (
                  <div key={link.text} className="relative" ref={categoriesDropdownRef}>
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="font-belleza text-lg tracking-wider transition-colors duration-300 relative group flex items-center gap-1 text-white hover:text-gray-200"
                    >
                      {link.text}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white"></span>
                    </button>

                    {/* Dropdown de categorías */}
                    {isCategoriesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden z-[100] animate-slideDownFade">
                        <div className="p-4">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorías</p>
                          <div className="space-y-2">
                            {visibleCollections.map((collection) => (
                              <Link
                                key={collection.handle}
                                href={`/search/${collection.handle}`}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2d7a3e] rounded-md transition-colors"
                                onClick={() => setIsCategoriesOpen(false)}
                              >
                                {collection.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link key={link.text} href={link.href} className="font-belleza text-lg tracking-wider transition-colors duration-300 relative group text-white hover:text-gray-200">
                    {link.text}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-white"></span>
                  </Link>
                )
              ))}
            </nav>

            {/* Logo - Center */}
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <Link href="/" className="pointer-events-auto">
                <div className="h-16 w-16">
                  <img
                    src="/logo.png"
                    alt="Forza Sport"
                    className="h-full w-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Right Navigation & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.slice(2).map((link) => (
                  <Link key={link.text} href={link.href} className={`font-belleza text-lg tracking-wider transition-colors duration-300 relative group text-white hover:text-gray-200 ${link.highlight ? 'font-semibold' : 'font-medium'}`}>
                    {link.text}
                    <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 group-hover:w-full ${link.highlight ? 'w-full' : 'w-0'} bg-white`}></span>
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                {/* Search Component con búsqueda predictiva */}
                <div className="hidden lg:block">
                  <Suspense
                    fallback={
                      <div className="w-80">
                        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                      </div>
                    }
                  >
                    <SearchComponent />
                  </Suspense>
                </div>

                {/* Search Button - Mobile */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="lg:hidden p-2 transition-colors hover:bg-white/20"
                  aria-label="Abrir búsqueda"
                >
                  <Search className="h-5 w-5 text-white" />
                </button>

                {/* Search Dropdown - Solo Mobile */}
                {isSearchOpen && (
                  <div className="lg:hidden fixed inset-0 z-[100] bg-black/50" onClick={() => setIsSearchOpen(false)}>
                    <div
                      className="absolute top-[156px] left-0 right-0 bg-white shadow-2xl p-4 animate-slideDownFade"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                        <SearchComponent />
                      </Suspense>
                    </div>
                  </div>
                )}

                <Link href="/account" className="p-2 rounded-full transition-colors hover:bg-white/20" aria-label="Mi cuenta">
                  <User className="h-5 w-5 text-white" />
                </Link>
                {/* Integrar carrito de Shopify */}
                <div className="[&_svg]:text-white [&_svg]:hover:text-gray-200">
                  <Suspense fallback={null}>
                    <CartModal />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 transition-colors hover:bg-white/20"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="h-12 w-12">
            <img
              src="/logo.png"
              alt="Forza Sport"
              className="h-full w-full object-contain"
            />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6 text-gray-900" />
          </button>
        </div>

        <nav className="flex flex-col p-6 space-y-6">
          {navLinks.map((link, index) => (
            link.hasDropdown ? (
              <div key={link.text}>
                <button
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  className="w-full flex items-center justify-between font-belleza text-xl tracking-wider hover:text-[#2d7a3e] transition-colors font-medium text-gray-900"
                  style={{
                    animation: isMobileMenuOpen ? `fadeInStagger 0.4s ease-out ${index * 0.1}s both` : 'none'
                  }}
                >
                  {link.text}
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Submenu de categorías */}
                {isMobileCategoriesOpen && (
                  <div className="mt-3 ml-4 space-y-3 animate-slideDownFade">
                    {visibleCollections.map((collection) => (
                      <Link
                        key={collection.handle}
                        href={`/search/${collection.handle}`}
                        className="block text-base text-gray-600 hover:text-[#2d7a3e] transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileCategoriesOpen(false);
                        }}
                      >
                        {collection.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.text}
                href={link.href}
                className={`font-belleza text-xl tracking-wider hover:text-[#2d7a3e] transition-colors ${link.highlight ? 'font-semibold text-[#2d7a3e]' : 'font-medium text-gray-900'}`}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  animation: isMobileMenuOpen ? `fadeInStagger 0.4s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                {link.text}
              </Link>
            )
          ))}
        </nav>

        <div className="p-6 border-t space-y-4">
          {/* <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors"
          >
            <Search className="h-5 w-5 text-gray-900" />
            <span className="text-gray-900">Buscar</span>
          </button> */}
          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors">
            <User className="h-5 w-5 text-gray-900" />
            <span className="text-gray-900">Mi Cuenta</span>
          </button>
        </div>
      </div>

    </>
  );
}

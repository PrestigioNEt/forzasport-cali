'use client'
import { useRef, useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from "lucide-react";

import Link from 'next/link';

interface Collection {
  title: string;
  handle: string;
  path: string;
  image?: {
    url: string;
    altText?: string;
  };
}

interface CategorySectionMinimalProps {
  collections: Collection[];
}

export default function CategorySectionMinimal({ collections }: CategorySectionMinimalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const getCategoryImage = (handle: string): string => {
    const handleLower = handle.toLowerCase();
    if (handleLower.includes('cinturon')) return '/cinturones.webp';
    if (handleLower.includes('gorra')) return '/gorras.webp';
    if (handleLower.includes('tarjetero') || handleLower.includes('billetera')) return '/tarjeteros.webp';
    if (handleLower.includes('saco')) return '/sacos.webp';
    if (handleLower.includes('maleta')) return '/sacos.webp';
    if (handleLower.includes('media')) return '/tarjeteros.webp';
    if (handleLower.includes('camiseta')) return '/sacos.webp';
    if (handleLower.includes('combo')) return '/cinturones.webp';
    return '/sacos.webp';
  };

  const validCollections = collections
    .filter(c =>
      c.handle !== '' &&
      c.handle !== 'undefined' &&
      !c.handle.toLowerCase().includes('hidden') &&
      c.handle.toLowerCase() !== 'undefined' &&
      c.title.toLowerCase() !== 'all'
    )
    .map(c => ({
      ...c,
      imageSrc: c.image?.url || getCategoryImage(c.handle)
    }));

  // Duplicar colecciones para scroll infinito
  const infiniteCollections = [...validCollections, ...validCollections, ...validCollections];

  // Inicializar en el medio para permitir scroll en ambas direcciones
  useEffect(() => {
    if (scrollContainerRef.current && validCollections.length > 0) {
      const container = scrollContainerRef.current;
      const cardWidth = 143; // 140px + 3px gap aproximado
      const initialScroll = cardWidth * validCollections.length;
      container.scrollLeft = initialScroll;
    }
  }, [validCollections.length]);

  // Manejar el loop infinito
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isScrolling) return;

    const container = scrollContainerRef.current;
    const cardWidth = 143;
    const totalOriginalWidth = cardWidth * validCollections.length;

    // Si llegamos muy al inicio, saltar al medio
    if (container.scrollLeft < cardWidth) {
      setIsScrolling(true);
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = container.scrollLeft + totalOriginalWidth;
      container.style.scrollBehavior = 'smooth';
      setTimeout(() => setIsScrolling(false), 50);
    }

    // Si llegamos muy al final, saltar al medio
    if (container.scrollLeft > totalOriginalWidth * 2 - container.clientWidth) {
      setIsScrolling(true);
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = container.scrollLeft - totalOriginalWidth;
      container.style.scrollBehavior = 'smooth';
      setTimeout(() => setIsScrolling(false), 50);
    }
  }, [isScrolling, validCollections.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (validCollections.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative">

          {/* Botón izquierdo */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-700 shadow-md rounded-full border border-gray-300 transition-all duration-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Botón derecho */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-700 shadow-md rounded-full border border-gray-300 transition-all duration-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {infiniteCollections.map((category, index) => (
              <Link
                key={`${category.handle}-${index}`}
                href={category.path}
                className="group shrink-0 w-[120px] sm:w-[140px]"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-2">
                  <Image
                    src={category.imageSrc}
                    alt={category.title}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    sizes="140px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg" />
                </div>
                <p className="text-xs sm:text-sm text-center text-gray-700 group-hover:text-[#620c0b] transition-colors duration-300">
                  {category.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

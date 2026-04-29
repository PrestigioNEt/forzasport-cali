'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  path: string;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLUListElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicar categorías más veces para crear un efecto de carrusel infinito
  const carouselCategories = [...categories, ...categories, ...categories, ...categories, ...categories, ...categories];

  // Auto play - movimiento automático
  useEffect(() => {
    if (!categories?.length || !isAutoPlaying || isDragging) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      if (carouselRef.current && !isDragging) {
        const scrollAmount = 1;
        carouselRef.current.scrollLeft += scrollAmount;

        // Loop infinito: volver al inicio cuando llega al final
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        if (carouselRef.current.scrollLeft >= maxScroll) {
          carouselRef.current.scrollLeft = 0;
        }
      }
    }, 50); // Muy suave, 50ms

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isDragging, categories?.length]);

  if (!categories?.length) return null;

  const scroll = (direction: 'left' | 'right') => {
    setIsAutoPlaying(false); // Pausar auto-play al interactuar

    if (carouselRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Reanudar auto-play después de 3 segundos
      setTimeout(() => setIsAutoPlaying(true), 3000);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false); // Pausar auto-play al hacer drag
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Reanudar auto-play después de soltar
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    // Reanudar auto-play después de salir
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  return (
    <div className="relative w-full overflow-hidden pb-6 pt-1">
      {/* Botón anterior */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110"
        aria-label="Categorías anteriores"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Botón siguiente */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110"
        aria-label="Siguientes categorías"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <ul
        ref={carouselRef}
        className={`flex gap-4 overflow-x-auto scrollbar-thin ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {carouselCategories.map((category, i) => (
          <li
            key={`${category.id}-${i}`}
            className="w-1/3 min-w-[200px] md:w-1/6 md:min-w-[180px] lg:w-1/8 lg:min-w-[200px] flex-none"
          >
            <Link
              href={category.path}
              className="flex h-full w-full flex-col group"
              prefetch={true}
              draggable={false}
            >
              <div className="relative aspect-square h-full w-full overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-300 ease-in-out hover:shadow-lg group">
                <Image
                  src={category.image}
                  alt={category.name || 'Categoría'}
                  fill
                  className="object-cover object-center transition duration-300 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 640px) 66vw, (max-width: 1024px) 33vw, 475px"
                  draggable={false}
                />
              </div>
              <div className="mt-4 flex flex-col items-start gap-1">
                <h3 className="font-belleza text-lg text-black">{category.name}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

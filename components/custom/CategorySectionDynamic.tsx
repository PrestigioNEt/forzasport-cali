'use client'
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from 'next/image';

import Link from 'next/link';

interface Collection {
  title: string;
  handle: string;
  path: string;
  image?: {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
  };
}

interface CategorySectionDynamicProps {
  collections: Collection[];
}

export default function CategorySectionDynamic({ collections }: CategorySectionDynamicProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mapeo de imágenes estáticas por categoría (búsqueda flexible)
  const getCategoryImage = (handle: string): string => {
    const handleLower = handle.toLowerCase();

    // Mapeo de palabras clave a imágenes
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

  // Filtrar colecciones válidas y agregar imágenes
  const validCollections = collections
    .filter(c =>
      c.handle !== '' &&
      !c.handle.toLowerCase().includes('hidden') &&
      c.title.toLowerCase() !== 'all'
    )
    .map(c => ({
      ...c,
      imageSrc: c.image?.url || getCategoryImage(c.handle)
    }));

  // Calcular cuántas cards se ven a la vez según el viewport
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 640) return 1; // mobile: 1 card
    if (width < 1024) return 2; // tablet: 2 cards
    return 3; // desktop: 3 cards
  };

  const [visibleCards, setVisibleCards] = useState(getVisibleCards());

  useEffect(() => {
    const updateVisibleCards = () => {
      setVisibleCards(getVisibleCards());
    };
    
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Calcular cuántos dots (páginas) necesitamos
  const totalPages = Math.ceil(validCollections.length / visibleCards);
  const activePage = Math.floor(activeIndex / visibleCards);

  // Detectar posición del scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cards = Array.from(container.children) as HTMLElement[];
    
    if (cards.length === 0) return;

    // Encontrar la card más cercana al centro del viewport
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    // Normalizar el índice para que siempre esté entre 0 y validCollections.length - 1
    const normalizedIndex = closestIndex % validCollections.length;
    setActiveIndex(normalizedIndex);

    // Si estamos en la segunda mitad duplicada, saltar sin animación al inicio
    if (closestIndex >= validCollections.length && !container.dataset.isLooping) {
      container.dataset.isLooping = 'true';
      setTimeout(() => {
        const targetCard = cards[normalizedIndex];
        if (targetCard) {
          const scrollAmount = targetCard.getBoundingClientRect().left - containerRect.left + container.scrollLeft;
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = scrollAmount;
          container.style.scrollBehavior = 'smooth';
        }
        delete container.dataset.isLooping;
      }, 100);
    }
  }, [validCollections.length]);

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

  // Navegar a una card específica
  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = Array.from(container.children) as HTMLElement[];
    
    if (cards[index]) {
      const card = cards[index];
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      // Calcular cuánto necesitamos scrollear para centrar la card
      const scrollAmount = cardRect.left - containerRect.left + container.scrollLeft;
      
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Navegar a una página específica
  const scrollToPage = (pageIndex: number) => {
    const cardIndex = pageIndex * visibleCards;
    scrollToCard(Math.min(cardIndex, validCollections.length - 1));
  };

  // Navegación infinita
  const scrollPrev = () => {
    let newIndex = activeIndex - 1;
    if (newIndex < 0) {
      newIndex = validCollections.length - 1;
    }
    scrollToCard(newIndex);
  };

  const scrollNext = () => {
    let newIndex = activeIndex + 1;
    if (newIndex >= validCollections.length) {
      newIndex = 0;
    }
    scrollToCard(newIndex);
  };

  return (
    <div className="bg-[#364e41] py-8 sm:py-10 lg:py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8 lg:gap-12 items-center">

          {/* Caption - Izquierda */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-belleza text-2xl sm:text-3xl lg:text-5xl font-light tracking-wide mb-4 sm:mb-6 lg:mb-8 leading-tight text-white text-center lg:text-left">
              Explora más
            </h2>
            <Image
              src="/logo-servigreen.png"
              alt="Logo Servigreen"
              width={160}
              height={160}
              className="w-auto mb-4 mx-auto lg:mx-0"
              style={{
                filter: 'brightness(0) invert(1)'
              }}
            />
          </div>

          {/* Slider - Derecha */}
          <div className="lg:col-span-8">
            <div className="relative">

              {/* Scroll Container */}
              <div
                ref={scrollContainerRef}
                className="scroll-container flex gap-3 sm:gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Renderizar las cards dos veces para efecto infinito */}
                {[...validCollections, ...validCollections].map((category, index) => {
                  return (
                    <div
                      key={`${category.handle}-${index}`}
                      className="snap-start shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
                    >
                      <Link
                        href={category.path}
                        className="group relative block active:scale-[0.98] transition-transform duration-150"
                      >
                      <div className="relative aspect-[4/6] w-full overflow-hidden bg-gray-200 rounded-sm">
                          <Image
                            src={category.imageSrc}
                            alt={`Categoría ${category.title} - Explora productos de ${category.title} en servigreen`}
                            fill
                            className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-active:from-black/75 transition-all duration-300"></div>

                          {/* Contenido de texto */}
                          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-wider transform group-hover:scale-105 transition-transform duration-300">
                              {category.title}
                            </h3>
                            <p className="text-white text-sm sm:text-base mt-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                              Explorar →
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Botones de navegación - Siempre visibles, navegación infinita */}
              <button
                onClick={scrollPrev}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-30 hover:scale-110 min-w-[44px] min-h-[44px] items-center justify-center"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>

              <button
                onClick={scrollNext}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-30 hover:scale-110 min-w-[44px] min-h-[44px] items-center justify-center"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>

{/* Dots de navegación */}
<div className="flex justify-center items-center gap-1 mt-8">
  {Array.from({ length: totalPages }).map((_, pageIndex) => {
    const isActive = activePage === pageIndex;
    return (
      <button
        key={pageIndex}
        onClick={() => scrollToPage(pageIndex)}
        style={{
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: 0,
          lineHeight: 0,
        }}
        aria-label={`Ir a página ${pageIndex + 1}`}
      >
        <div
          style={{
            width: isActive ? '40px' : '20px', // activo más largo
            height: '2px',
            backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s ease',
          }}
        />
      </button>
    );
  })}
</div>



              {/* Indicador de swipe solo en mobile */}
              <div className="block sm:hidden text-center mt-4 text-white/60 text-xs animate-pulse">
                ← Desliza para ver más →
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -webkit-overflow-scrolling: touch;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-container {
            scroll-behavior: auto !important;
          }

          * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }

        @media (max-width: 640px) {
          .scroll-container {
            scroll-padding: 0;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
}
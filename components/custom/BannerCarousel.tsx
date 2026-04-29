'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const banners = [
  {
    id: 1,
    src: '/banner-forza.png',
    alt: 'Banner Forza - Forza Sport',
    link: '/search'
  },
  {
    id: 2,
    src: '/banner-forza1.png',
    alt: 'Banner Forza 1 - Forza Sport',
    link: '/search'
  },
  {
    id: 3,
    src: '/banner-forza2.png',
    alt: 'Banner Forza 2 - Forza Sport',
    link: '/search'
  },
  {
    id: 4,
    src: '/banner-forza3.png',
    alt: 'Banner Forza 3 - Forza Sport',
    link: '/search'
  }
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Banner actual */}
      <Link href={banners[currentIndex]?.link || '/search'} className="block w-full h-full">
        <img
          src={banners[currentIndex]?.src || '/banner1.webp'}
          alt={banners[currentIndex]?.alt || 'Banner'}
          className="w-full h-full object-cover object-center transition-opacity duration-500"
        />
      </Link>

      {/* Botón anterior */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Banner anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Botón siguiente */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 z-10"
        aria-label="Siguiente banner"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 w-2 hover:bg-white/70'
            }`}
            aria-label={`Ir al banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

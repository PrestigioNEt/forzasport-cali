'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type HeroSectionProps = {
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonText2?: string;
  buttonUrl?: string;
  buttonUrl2?: string;
};

export default function HeroSection({
  title = 'BIENVENIDOS A SERVIGREEN',
  description = 'Descubre nuestra selección de plantas, bonsáis y productos de jardinería.\nTransforma tu espacio con naturaleza.',
  image = 'https://images.unsplash.com/photo-141687957682-63fb69739953?w=1920&q=80',
  buttonText = 'Explorar productos',
  buttonText2 = 'Ver categorías',
  buttonUrl = '/search/todos',
  buttonUrl2 = '/search/todos'
}: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[90vh] sm:h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <div
          className="relative w-full h-full"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <Image
            src={image}
            alt={`Banner servigreen - ${title}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
            fetchPriority="high"
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          opacity: Math.max(0, 1 - scrollY / 400),
          transform: `translateY(${scrollY * 0.2}px)`
        }}
      >
        <h1 className="font-belleza text-4xl sm:text-5xl lg:text-7xl font-light tracking-wide mb-6 sm:mb-8 leading-tight">
          {title}
        </h1>

        <p className="font-light text-base sm:text-lg lg:text-xl mb-10 sm:mb-12 max-w-2xl mx-auto opacity-90 leading-relaxed whitespace-pre-line">
          {description}
        </p>

        {/* Botones estilo editorial */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Botón primario - Underline style */}
          <a
            href={buttonUrl}
            className="group inline-flex items-center gap-3 text-white text-sm sm:text-base tracking-[0.2em] uppercase font-medium border-b-2 border-white pb-2 hover:border-white/60 transition-all duration-300"
          >
            {buttonText}
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          {/* Botón secundario - Minimal outline */}
          <button
            onClick={() => {
              if (buttonUrl2?.startsWith('/#')) {
                const id = buttonUrl2.substring(2);
                const element = document.getElementById(id);
                element?.scrollIntoView({ behavior: 'smooth' });
              } else if (buttonUrl2) {
                window.location.href = buttonUrl2;
              }
            }}
            className="inline-flex items-center gap-3 text-white text-sm sm:text-base tracking-[0.15em] uppercase font-light border border-white/50 px-8 py-3 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
          >
            {buttonText2}
          </button>
        </div>
      </div>

      {/* Scroll indicator - más elegante */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <p className="text-white text-xs tracking-[0.2em] uppercase font-light opacity-70">
          Scroll
        </p>
        <div className="w-px h-12 bg-white/40">
          <div className="w-px h-6 bg-white animate-scroll"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

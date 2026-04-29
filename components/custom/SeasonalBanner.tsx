'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Slide = {
  id: string;
  image?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
};

type SeasonalBannerProps = {
  slides?: Slide[];
};

const defaultSlides: Slide[] = [
  {
    id: '1',
    image: '/nueva-coleccion-banner.jpg',
    tag: 'Descubre lo nuevo',
    title: 'NUEVAS PLANTAS',
    subtitle: 'Explora nuestra selección recién llegada de plantas exóticas y bonsáis.',
    buttonText: 'Ver catálogo',
    href: '/search/new',
  },
  {
    id: '2',
    image: '/cinturones.webp',
    tag: 'Jardinería Premium',
    title: 'Transforma tu Espacio',
    subtitle: 'Descubre herramientas y accesorios para crear el jardín de tus sueños.',
    buttonText: 'Explorar productos',
    href: '/search/accesorios',
  },
];

export default function SeasonalBanner({ slides = defaultSlides }: SeasonalBannerProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    fade: true,
    cssEase: 'ease-in-out',
    arrows: false,
    dotsClass: "slick-dots seasonal-dots",
  };

  return (
    <div id='seasonal' className="w-full overflow-hidden bg-[#364e41]">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <div className="h-[65vh] sm:h-[75vh] lg:h-[85vh] w-full relative">
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={`${slide.title} - ${slide.subtitle || 'Banner promocional de servigreen'}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              )}
              {/* Overlay más oscuro para mejor legibilidad */}
              <div className="absolute inset-0 bg-black/60"></div>

              {/* Contenido - Centrado */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white max-w-4xl px-6 sm:px-12 text-center">
                  {/* Tag pequeño */}
                  {slide.tag && (
                    <div className="mb-6 sm:mb-8">
                      <span className="inline-block text-xs sm:text-sm tracking-[0.3em] uppercase font-medium border border-white/70 px-4 sm:px-6 py-2 sm:py-3">
                        {slide.tag}
                      </span>
                    </div>
                  )}

                  {/* Título */}
                  {slide.title && (
                    <h2 className="font-belleza text-3xl sm:text-4xl lg:text-6xl font-light tracking-wide mb-6 sm:mb-8 leading-tight text-white text-center">
                      {slide.title}
                    </h2>
                  )}

                  {/* Subtítulo */}
                  {slide.subtitle && (
                    <p className="font-moderat text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 font-light leading-relaxed max-w-2xl mx-auto">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* Botón elegante pero legible */}
                  {slide.buttonText && slide.href && (
                    <a
                      href={slide.href}
                      className="group inline-flex items-center justify-center gap-3 font-moderat bg-[#2d7a3e] text-white px-8 sm:px-10 py-4 text-sm sm:text-base tracking-[0.15em] uppercase font-semibold hover:bg-[#1e5a2a] transition-all duration-300 shadow-lg"
                    >
                      {slide.buttonText}
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

<style jsx global>{`
  .seasonal-dots {
    display: flex !important;
    justify-content: center; /* centrado debajo del slider */
    gap: 4px; /* espacio pequeño entre barras */
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  @media (min-width: 640px) {
    .seasonal-dots {
      bottom: 4rem;
    }
  }

  @media (min-width: 1024px) {
    .seasonal-dots {
      bottom: 5rem;
    }
  }

  .seasonal-dots li {
    margin: 0;
  }

  .seasonal-dots li button {
    width: 20px; /* ancho inactivo */
    height: 2px;
    padding: 0;
    background-color: rgba(255, 255, 255, 0.4);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0;
    line-height: 0;
  }

  .seasonal-dots li button:hover {
    background-color: rgba(255, 255, 255, 0.7);
  }

  .seasonal-dots li.slick-active button {
    width: 40px; /* ancho activo */
    background-color: #ffffff;
  }

  .seasonal-dots li button:before {
    display: none;
  }
`}</style>

    </div>
  );
}
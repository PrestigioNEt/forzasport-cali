'use client'

import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/fade-in';

export default function BrandPhilosophy() {
  return (
    <div id="filosofia">

      {/* Split Editorial Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Imagen Izquierda */}
        <div className="relative h-[500px] lg:h-[700px]">
          <Image
            src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&h=1400&fit=crop"
            alt="Bonsai y plantas de colección"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Contenido Derecha */}
        <div className="bg-[#f8f7f4] flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-24">
          <FadeIn delay={0.2} direction="left">
            <div className="max-w-lg space-y-6">
              <p className="text-[#2d7a3e] text-xs tracking-[0.3em] uppercase font-medium mb-6">
                Nuestra Filosofía
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                Creemos en el poder transformador de la naturaleza,<br />
                y en cómo una planta puede convertirse en el centro de tu hogar.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                Cada bonsai cuenta una historia de paciencia y dedicación,<br />
                cada planta ornamental trae vida y armonía a tu espacio.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                No solo vendemos plantas, compartimos una pasión<br />
                por cultivar conexiones genuinas entre las personas y la naturaleza.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                Nuestra colección es un homenaje a la belleza natural,<br />
                cuidadosamente seleccionada para inspirar serenidad y bienestar.
              </p>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                Más que una tienda, somos una comunidad de amantes de las plantas.<br />
                Juntos creamos espacios más verdes y conscientes.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Quote Section - Full Width */}
      <div className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-8 sm:px-12 text-center">
          <FadeIn delay={0.3} direction="none">
            <div className="space-y-8">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-[#620c0b]/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 leading-relaxed italic">
                Donde crece una planta, florece el alma
              </blockquote>
              <p className="text-gray-500 text-sm tracking-[0.2em] uppercase font-medium">
                — Vivero Botánico
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Bottom Editorial Image */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Contenido Izquierda */}
        <div className="bg-[#2d7a3e] text-white flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-24 order-2 lg:order-1">
          <FadeIn delay={0.2} direction="right">
            <div className="max-w-lg space-y-6">
              <p className="text-white/70 text-xs tracking-[0.3em] uppercase font-medium">
                Plantas Saludables
              </p>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
                Cultivadas con amor
              </h3>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed font-light">
                Cada planta es cultivada con dedicación y cuidado. Seleccionamos ejemplares saludables y robustos, garantizando que recibes especímenes de la más alta calidad para tu hogar.
              </p>
              <div className="pt-4">
                <Link href="/search" className="font-moderat inline-block text-white text-sm tracking-[0.2em] uppercase font-medium border-b-2 border-white/50 hover:border-white transition-colors pb-1">
                  Explorar Plantas
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Imagen Derecha */}
        <div className="relative h-[500px] lg:h-[700px] order-1 lg:order-2">
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=1400&fit=crop"
            alt="Plantas cultivadas con cuidado"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
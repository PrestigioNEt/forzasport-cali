'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageZoomModal } from '@/components/ui/image-zoom-modal';

export function GalleryCustom({ images }: { images: { src: string; altText: string }[] }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  // Tomar las primeras 4 imágenes para el grid
  const gridImages = images.slice(0, 4);
  const hasMoreImages = images.length > 4;

  return (
    <div className="flex flex-col gap-4">
      {/* Grid de 4 Imágenes - 2x2 */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
        {gridImages.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedImage(index);
              setIsModalOpen(true);
            }}
            className="group relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm transition-all duration-300 cursor-zoom-in hover:shadow-lg"
          >
            <Image
              src={image.src}
              alt={image.altText}
              fill
              priority={index < 2}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Overlay sutil en hover */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

            {/* Icono de zoom */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>

            {/* Indicador si hay más imágenes (en la última imagen del grid) */}
            {index === 3 && hasMoreImages && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-moderat text-base md:text-lg font-medium uppercase tracking-wider">
                  +{images.length - 4} más
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Thumbnails para el resto de imágenes (si hay más de 4) */}
      {hasMoreImages && (
        <div className="relative">
          {/* Indicador visual de scroll izquierdo */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />

          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            {images.slice(4).map((image, index) => {
              const actualIndex = index + 4;
              return (
                <button
                  key={actualIndex}
                  onClick={() => {
                    setSelectedImage(actualIndex);
                    setIsModalOpen(true);
                  }}
                  className="relative flex-shrink-0 h-24 w-24 md:h-28 md:w-28 overflow-hidden rounded-sm border-2 border-gray-200 hover:border-gray-900 transition-all duration-200 cursor-zoom-in hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <Image
                    src={image.src}
                    alt={image.altText}
                    fill
                    className="object-cover object-center"
                    sizes="112px"
                  />
                </button>
              );
            })}
          </div>

          {/* Indicador visual de scroll derecho */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      )}

      {/* Image Zoom Modal Premium */}
      <ImageZoomModal
        images={images}
        currentIndex={selectedImage ?? 0}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

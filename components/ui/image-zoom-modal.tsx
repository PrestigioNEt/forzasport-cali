'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageZoomModalProps {
  images: { src: string; altText: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomModal({ images, currentIndex, isOpen, onClose }: ImageZoomModalProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setActiveIndex(currentIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrevious, handleNext]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
    if (zoom <= 1.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom === 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white text-sm font-light">
          {activeIndex + 1} / {images.length}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            disabled={zoom === 1}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            onClick={handleZoomIn}
            disabled={zoom === 3}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors ml-2"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="relative w-full h-full flex items-center justify-center cursor-move"
          onMouseMove={handleMouseMove}
        >
          {images[activeIndex] && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].altText}
                fill
                className="object-contain transition-transform duration-300"
                sizes="100vw"
                priority
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: zoom > 1 ? `${position.x}% ${position.y}%` : 'center'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-all hover:scale-110"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-all hover:scale-110"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 pt-8 px-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
          <div className="flex gap-2 md:gap-3 justify-start md:justify-center overflow-x-auto pb-3 px-2 scroll-smooth scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setZoom(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-sm overflow-hidden transition-all duration-300 ${
                  index === activeIndex
                    ? 'ring-2 ring-white scale-110 shadow-lg'
                    : 'opacity-60 hover:opacity-100 hover:scale-105 shadow-md'
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.altText}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {/* Indicador de imagen activa */}
                {index === activeIndex && (
                  <div className="absolute inset-0 border-2 border-white pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

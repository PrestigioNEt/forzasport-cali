'use client';

import { Instagram } from 'lucide-react';

export default function ElfsightInstagramFeed() {
  return (
    <div className="bg-gray-900 py-10 sm:py-14">
      {/* Título */}
      <div className="text-center mb-8">
        <h2 className="font-belleza text-2xl sm:text-3xl lg:text-5xl font-light tracking-wide mb-6 leading-tight text-white">
          Síguenos en Instagram
        </h2>
        <a
          href="https://www.instagram.com/servigreen.sa/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-moderat text-base sm:text-lg text-white/80 hover:text-white transition-colors duration-300"
        >
          <Instagram className="h-6 w-6" />
          @servigreen.sa
        </a>
      </div>

      {/* Widget Elfsight - DESACTIVADO temporalmente por límite de plan */}
      {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" async />
        <div className="elfsight-app-930ea585-25e0-4ea1-9e52-ee013d7df469" data-elfsight-app-lazy></div>
      </div> */}
    </div>
  );
}

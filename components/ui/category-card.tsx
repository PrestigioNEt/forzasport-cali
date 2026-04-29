'use client';

import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  path: string;
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.path}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg drop-shadow-lg">
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

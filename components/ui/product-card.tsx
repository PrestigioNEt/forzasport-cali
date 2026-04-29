'use client';

import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

export function ProductCard({ product }: { product: Product }) {
  console.log('🎴 ProductCard recibió:', product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name || 'Sin nombre'}
        </h3>
        <p className="text-lg text-gray-700 font-medium">
          {product.price || 'Sin precio'}
        </p>
      </div>
    </Link>
  );
}

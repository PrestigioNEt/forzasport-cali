'use client';

import Image from 'next/image';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
  const { recentProducts } = useRecentlyViewed();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Filter out current product
  const displayProducts = recentProducts.filter((p) => p.id !== currentProductId);

  if (displayProducts.length === 0) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-belleza text-2xl lg:text-3xl font-light tracking-wide mb-10 text-gray-900 text-center">
          Vistos Recientemente
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
          {displayProducts.slice(0, 4).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group relative block product-card"
              prefetch={true}
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative mb-3 rounded-sm">
                {product.featuredImage && (
                  <Image
                    src={product.featuredImage.url}
                    alt={`${product.title} - Producto visto recientemente en servigreen`}
                    fill
                    className="object-cover object-center image-hover-zoom"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                )}
                {/* Overlay sutil en hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 image-overlay" />
              </div>

              {/* Info debajo de la imagen */}
              <div className="text-left">
                <h3 className="font-belleza text-sm font-light text-gray-900 tracking-wide mb-1">
                  {product.title}
                </h3>
                <p className="font-moderat text-sm font-semibold text-gray-900">
                  $
                  {parseFloat(product.priceRange.maxVariantPrice.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

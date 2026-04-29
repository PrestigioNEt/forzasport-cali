'use client';

import { useEffect, useRef } from 'react';
import { useRecentlyViewed } from '@/components/providers/RecentlyViewedProvider';
import { RecentlyViewedProducts } from './RecentlyViewed';

interface ProductViewTrackerProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price?: string;
    image?: string;
  };
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  const { addProduct } = useRecentlyViewed();
  const trackedIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Solo agregar si es un producto diferente
    if (trackedIdRef.current !== product.id) {
      trackedIdRef.current = product.id;

      // Agregar producto a vistos recientemente
      addProduct({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        viewedAt: Date.now()
      });
    }
  }, [product.id, product.slug, product.name, product.price, product.image, addProduct]);

  return (
    <RecentlyViewedProducts
      currentProductId={product.id}
      title="Quizás te guste"
      maxProducts={6}
    />
  );
}

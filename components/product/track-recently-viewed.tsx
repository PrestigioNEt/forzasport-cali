'use client';

import { useEffect } from 'react';
import { Product } from 'lib/shopify/types';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export function TrackRecentlyViewed({ product }: { product: Product }) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    // Add product to recently viewed when component mounts
    if (product) {
      addRecentlyViewed(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]); // Only run when product ID changes

  return null; // This component doesn't render anything
}

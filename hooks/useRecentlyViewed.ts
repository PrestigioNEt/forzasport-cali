'use client';

import { useEffect, useState, useCallback } from 'react';
import { Product } from 'lib/shopify/types';

const STORAGE_KEY = 'juan-becerra-recently-viewed';
const MAX_ITEMS = 8;

interface RecentlyViewedProduct {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  timestamp: number;
}

export function useRecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<RecentlyViewedProduct[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const products = JSON.parse(stored);
        setRecentProducts(products);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading recently viewed:', e);
        }
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addRecentlyViewed = useCallback((product: Product) => {
    const recentProduct: RecentlyViewedProduct = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      featuredImage: product.featuredImage,
      priceRange: product.priceRange,
      timestamp: Date.now()
    };

    setRecentProducts((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to the beginning
      const updated = [recentProduct, ...filtered].slice(0, MAX_ITEMS);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentlyViewed = () => {
    setRecentProducts([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    recentProducts,
    addRecentlyViewed,
    clearRecentlyViewed
  };
}

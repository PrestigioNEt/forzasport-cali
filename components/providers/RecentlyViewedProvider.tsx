'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  RecentlyViewedProduct,
  getRecentlyViewed,
  setRecentlyViewed,
  clearRecentlyViewed
} from '@/lib/cookies/recently-viewed';

interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedProduct[];
  addProduct: (product: RecentlyViewedProduct) => void;
  clearProducts: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewedState] = useState<RecentlyViewedProduct[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Cargar productos desde cookies al montar el componente
  useEffect(() => {
    setIsClient(true);
    const products = getRecentlyViewed();
    setRecentlyViewedState(products);
  }, []);

  const addProduct = useCallback((product: RecentlyViewedProduct) => {
    // Actualizar estado local
    setRecentlyViewedState(current => {
      const filtered = current.filter(p => p.id !== product.id);
      const updated = [
        {
          ...product,
          viewedAt: Date.now()
        },
        ...filtered
      ].slice(0, 12); // Máximo 12 productos

      // Actualizar cookie
      setRecentlyViewed(updated);

      return updated;
    });
  }, []);

  const clearProducts = useCallback(() => {
    setRecentlyViewedState([]);
    clearRecentlyViewed();
  }, []);

  const value = {
    recentlyViewed: isClient ? recentlyViewed : [],
    addProduct,
    clearProducts
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}

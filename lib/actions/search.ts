'use server';

import { getPredictiveSearch } from 'lib/shopify';
import { PredictiveSearchResult } from 'lib/shopify/types';

export async function searchPredictive(
  query: string
): Promise<PredictiveSearchResult> {
  if (!query || query.trim().length < 2) {
    return {
      queries: [],
      products: [],
      collections: []
    };
  }

  try {
    const results = await getPredictiveSearch(query);
    return results;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en búsqueda predictiva:', error);
    }
    return {
      queries: [],
      products: [],
      collections: []
    };
  }
}

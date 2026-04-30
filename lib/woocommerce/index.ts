/**
 * WOOCOMMERCE GRAPHQL CLIENT
 *
 * Cliente GraphQL para conectar con WooCommerce vía WPGraphQL
 * Basado en la estructura de Shopify pero adaptado para WooCommerce
 */

import { revalidateTag } from 'next/cache';
import { cache } from 'react';
import {
  addToCartMutation,
  updateCartItemMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import { getCollectionQuery, getCollectionsQuery } from './queries/collection';
import {
  getProductQuery,
  getProductsQuery
} from './queries/product';
import { getSearchProductsQuery } from './queries/search';
import {
  WooCart,
  WooCartOperation,
  WooAddToCartOperation,
  WooUpdateCartOperation,
  WooCollection,
  WooCollectionOperation,
  WooCollectionsOperation,
  WooProduct,
  WooProductOperation,
  WooProductsOperation,
  WooSearchOperation,
  Product,
  Collection
} from './types';

// URL del endpoint GraphQL - Usar proxy local para evitar CORS
const GRAPHQL_ENDPOINT = '/api/graphql';

const domain = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL
  ? process.env.NEXT_PUBLIC_WOOCOMMERCE_URL.replace(/\/$/, '') // Remover trailing slash
  : '';

// Endpoint directo (para referencia)
const directEndpoint = `${domain}/graphql`;

// Tags de caché para revalidación
const TAGS = {
  products: 'woo-products',
  collections: 'woo-collections',
  product: (slug: string) => `woo-product-${slug}`,
  collection: (slug: string) => `woo-collection-${slug}`,
};

// Configuración
const FETCH_CONFIG = {
  retries: 0 // Sin reintentos - el servidor es lento y mejor fallar rápido
};

/**
 * Cliente fetch para WooCommerce GraphQL
 */
export async function woocommerceFetch<T>({
  headers,
  query,
  variables,
  tags
}: {
  headers?: HeadersInit;
  query: string;
  variables?: object;
  tags?: string[];
}): Promise<{ status: number; body: T } | never> {
  try {
    const isServer = typeof window === 'undefined';
    const endpoint = isServer ? directEndpoint : GRAPHQL_ENDPOINT;

    console.log(`🔵 Fetching WooCommerce (${isServer ? 'Server' : 'Client'}): ${endpoint}`);

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    };

    if (!isServer) {
      fetchOptions.credentials = 'include';
    }

    const result = await fetch(endpoint, fetchOptions);

    const body = await result.json();

    // Verificar si el body es un error HTML camuflado
    if (typeof body === 'string' && body.startsWith('<!DOCTYPE')) {
      console.error('❌ WooCommerce devolvió HTML en vez de JSON:', {
        status: result.status,
        url: endpoint
      });
      throw new Error(`WooCommerce API no disponible`);
    }

    if (!result.ok) {
      console.error('❌ WooCommerce fetch error:', {
        status: result.status,
        statusText: result.statusText,
        body
      });
      throw new Error(`HTTP ${result.status}: ${result.statusText}`);
    }

    if (body.errors) {
      console.error('❌ GraphQL errors:', body.errors);
      const errorMessage = body.errors[0]?.message || 'Error desconocido en GraphQL';
      throw new Error(errorMessage);
    }

    console.log('✅ WooCommerce fetch successful');

    return {
      status: result.status,
      body
    };
  } catch (e: any) {
    console.error('❌ WooCommerce fetch exception:', {
      message: e.message,
      cause: e.cause,
      status: e.status,
      query: query?.substring(0, 100)
    });
    throw {
      cause: e.cause?.toString() || 'unknown',
      status: e.status || 500,
      message: e.message,
      query
    };
  }
}

/**
 * Parsear precio de WooCommerce (HTML string → número)
 * WooCommerce devuelve precios como HTML: <span class="...">$50.00</span>
 */
function parsePrice(priceHtml: string | undefined): { amount: string; currencyCode: string } {
  console.log('🔍 parsePrice recibió:', { priceHtml, tipo: typeof priceHtml });

  if (!priceHtml) {
    return { amount: '0', currencyCode: 'USD' };
  }

  // Limpiar HTML y HTML entities (usar regex global)
  const priceHtmlStr = String(priceHtml);
  console.log('🔍 priceHtml recibido:', JSON.stringify(priceHtmlStr));
  console.log('🔍 priceHtml hex:', priceHtmlStr.split('').map(c => c.charCodeAt(0).toString(16)).join(' '));

  // Primero convertir HTML entities comunes (con regex global)
  let cleanPrice = priceHtmlStr
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/[ ​-‏﻿]/g, ' '); // Todos los espacios especiales

  // Limpiar tags HTML
  cleanPrice = cleanPrice.replace(/<[^>]*>/g, '').trim();
  cleanPrice = cleanPrice.replace(/\s+/g, ' '); // Normalizar múltiples espacios

  console.log('🔍 cleanPrice final:', JSON.stringify(cleanPrice));

  // Extraer valor numérico (admite formatos: $50,000.00, 50.000, $50.000)
  const priceMatch = cleanPrice.match(/[\$€£¥]?\s*([\d,.]+)/);
  const currencyMatch = cleanPrice.match(/[\$€£¥]/);

  if (!priceMatch) {
    return { amount: '0', currencyCode: 'USD' };
  }

  const amount = priceMatch[1]?.replace(/,/g, '.') || '0'; // Primer grupo capturado (sin símbolo)
  const currencySymbol = currencyMatch ? currencyMatch[0] : '$';
  const currencyCode = mapCurrencyCode(currencySymbol);

  return { amount, currencyCode };
}

function mapCurrencyCode(symbol: string): string {
  const currencyMap: Record<string, string> = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY'
  };
  return currencyMap[symbol] || 'USD';
}

/**
 * Reshape de producto WooCommerce → formato estándar del app
 */
const reshapeProduct = (product: WooProduct): Product => {
  if (!product) {
    return {} as Product;
  }

  // Parsear precios
  const { amount: price, currencyCode } = parsePrice(product.price || '');
  const { amount: regularPrice } = parsePrice(product.regularPrice || '');

  return {
    id: product.id,
    handle: product.slug,
    title: product.name,
    description: product.description || '',
    descriptionHtml: product.description || '',
    availableForSale: product.stockStatus === 'IN_STOCK',
    priceRange: {
      minVariantPrice: { amount: price, currencyCode },
      maxVariantPrice: { amount: price, currencyCode }
    },
    variants: product.variations?.nodes.map((v) => ({
      id: v.id,
      title: v.name || product.name,
      availableForSale: v.stockStatus === 'IN_STOCK',
      quantityAvailable: v.stockQuantity,
      selectedOptions: v.attributes?.nodes.map(attr => ({
        name: attr.name,
        value: attr.value
      })) || [],
      price: parsePrice(v.price || ''),
      compareAtPrice: v.regularPrice ? parsePrice(v.regularPrice) : undefined
    })) || [],
    featuredImage: product.image ? {
      url: product.image.sourceUrl,
      altText: product.image.altText || product.name,
      width: 0,
      height: 0
    } : {
      url: '',
      altText: product.name,
      width: 0,
      height: 0
    },
    images: product.galleryImages?.nodes.map(img => ({
      url: img.sourceUrl,
      altText: img.altText || product.name,
      width: 0,
      height: 0
    })) || [],
    seo: {
      title: product.name,
      description: product.shortDescription || product.description || ''
    },
    tags: [],
    updatedAt: product.modified || new Date().toISOString(),
    collections: []
  };
};

const reshapeProducts = (products: WooProduct[]): Product[] => {
  return products.filter(Boolean).map(reshapeProduct);
};

/**
 * Reshape de colección WooCommerce → formato estándar
 */
const reshapeCollection = (collection: WooCollection): Collection => {
  if (!collection) {
    return {} as Collection;
  }

  return {
    handle: collection.slug,
    title: collection.name,
    description: collection.description || '',
    path: `/search/${collection.slug}`, // ✅ Agregado path
    seo: {
      title: collection.name,
      description: collection.description || ''
    },
    updatedAt: new Date().toISOString(),
    image: collection.image ? {
      url: collection.image.sourceUrl,
      altText: collection.image.altText || collection.name,
      width: 0,
      height: 0
    } : undefined
  };
};

const reshapeCollections = (collections: WooCollection[]): Collection[] => {
  return collections.filter(Boolean).map(reshapeCollection);
};

/**
 * Reshape de carrito WooCommerce → formato estándar
 */
const reshapeCart = (cart: WooCart): any => {
  if (!cart) {
    return undefined;
  }

  return {
    id: 'cart', // WooCommerce no tiene cart ID, usa sesión
    checkoutUrl: '', // Se implementará más tarde
    cost: {
      subtotalAmount: parsePrice(cart.subtotal),
      totalAmount: parsePrice(cart.total),
      totalTaxAmount: parsePrice(cart.totalTax || '0')
    },
    lines: {
      edges: cart.contents?.nodes.map(item => ({
        node: {
          id: item.key,
          quantity: item.quantity,
          cost: {
            totalAmount: parsePrice(item.total)
          },
          merchandise: {
            id: item.product?.node?.id || '',
            title: item.product?.node?.name || '',
            selectedOptions: [],
            product: {
              id: item.product?.node?.id || '',
              handle: item.product?.node?.slug || '',
              title: item.product?.node?.name || '',
              featuredImage: item.product?.node?.image ? {
                url: item.product.node.image.sourceUrl,
                altText: item.product.node.image.altText || '',
                width: 0,
                height: 0
              } : {
                url: '',
                altText: '',
                width: 0,
                height: 0
              }
            }
          }
        }
      }))
    },
    totalQuantity: cart.contents?.nodes.reduce((sum, item) => sum + item.quantity, 0) || 0
  };
};

// ============================================================================
// QUERIES - PRODUCTOS
// ============================================================================

export async function getProduct(handle: string): Promise<Product | undefined> {
  // Intentar con la query principal por slug
  const res = await woocommerceFetch<WooProductOperation>({
    query: getProductQuery,
    variables: { slug: handle },
    tags: [TAGS.products, TAGS.product(handle)]
  });

  let product = res.body.data.product;

  // Si no encuentra por slug, buscar por búsqueda fuzzy
  if (!product) {
    console.log(`🔍 Producto no encontrado por slug "${handle}", intentando búsqueda...`);

    const searchRes = await woocommerceFetch<WooProductsOperation>({
      query: `
        query SearchProduct($search: String!) {
          products(where: {search: $search}, first: 5) {
            nodes {
              id
              slug
              name
              ... on SimpleProduct {
                price
                image { sourceUrl altText }
              }
              ... on VariableProduct {
                price
                image { sourceUrl altText }
              }
            }
          }
        }
      `,
      variables: { search: handle }
    });

    // Buscar coincidencia exacta de slug
    const found = searchRes.body.data.products?.nodes.find(
      (p: any) => p.slug === handle
    );

    if (found) {
      // Hacer query completa del producto encontrado
      const fullRes = await woocommerceFetch<WooProductOperation>({
        query: getProductQuery,
        variables: { slug: found.slug }
      });
      product = fullRes.body.data.product;
    }
  }

  if (!product) {
    console.warn(`⚠️ Producto no encontrado: ${handle}`);
    return undefined;
  }

  // Manejar diferentes tipos de productos
  if (product.__typename === 'SimpleProduct') {
    return reshapeProduct({
      ...product,
      price: (product as any).price,
      regularPrice: (product as any).regularPrice,
      variations: { nodes: [] }
    } as WooProduct);
  }

  if (product.__typename === 'VariableProduct') {
    return reshapeProduct(product);
  }

  return reshapeProduct(product);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  // Por ahora, pasar solo la query
  // Los parámetros orderby y order no están disponibles en WooCommerce GraphQL

  const res = await woocommerceFetch<WooProductsOperation>({
    query: getProductsQuery,
    variables: {
      search: query
    },
    tags: [TAGS.products]
  });

  const products = res.body.data.products?.nodes || [];
  return reshapeProducts(products);
}

// ============================================================================
// QUERIES - COLECCIONES
// ============================================================================

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await woocommerceFetch<WooCollectionOperation>({
    query: getCollectionQuery,
    variables: { slug: handle },
    tags: [TAGS.collections, TAGS.collection(handle)]
  });

  const collection = res.body.data.productCategory;
  if (!collection) {
    return undefined;
  }

  return reshapeCollection(collection);
}

// Usar cache para evitar múltiples llamadas a getCollections
export const getCollections = cache(async (): Promise<Collection[]> => {
  try {
    const res = await woocommerceFetch<WooCollectionsOperation>({
      query: getCollectionsQuery,
      tags: [TAGS.collections]
    });

    const wooCollections = res.body.data.productCategories?.nodes || [];

    // Filtrar categorías sin slug válido o con slug 'undefined'
    const validCollections = wooCollections.filter((collection: WooCollection) =>
      collection.slug &&
      collection.slug !== 'undefined' &&
      collection.slug !== '' &&
      !collection.slug.toLowerCase().includes('uncategorized')
    );

    return [
      {
        handle: '',
        title: 'All',
        description: 'All products',
        seo: {
          title: 'All',
          description: 'All products'
        },
        path: '/search',
        updatedAt: new Date(0).toISOString()
      },
      ...reshapeCollections(validCollections)
    ];
  } catch (error) {
    console.error('Error fetching collections:', error);
    // Retornar array vacío en caso de error para evitar loops
    return [];
  }
});

// ============================================================================
// QUERIES - BÚSQUEDA
// ============================================================================

export async function getSearchResults(searchQuery: string): Promise<Product[]> {
  const res = await woocommerceFetch<WooSearchOperation>({
    query: getSearchProductsQuery,
    variables: { search: searchQuery },
    tags: [TAGS.products]
  });

  const products = res.body.data.products?.nodes || [];
  return reshapeProducts(products);
}

// ============================================================================
// MUTATIONS - CARRITO
// ============================================================================

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<any> {
  // NOTA: WooCommerce addToCart es diferente por producto simple vs variable
  // Por ahora implementamos solo para productos simples
  const line = lines[0];
  if (!line) {
    throw new Error('No items provided');
  }

  const res = await woocommerceFetch<WooAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      productId: parseInt(line.merchandiseId),
      quantity: line.quantity
    }
  });

  return reshapeCart(res.body.data.addToCart?.cart || {} as WooCart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<any> {
  // WooCommerce usa key del item, no merchandiseId
  const items = lines.map(line => ({
    key: line.id,
    quantity: line.quantity
  }));

  const res = await woocommerceFetch<WooUpdateCartOperation>({
    query: updateCartItemMutation,
    variables: { items }
  });

  return reshapeCart(res.body.data.updateCartItems?.cart || {} as WooCart);
}

export async function getCart(): Promise<any | undefined> {
  try {
    const res = await woocommerceFetch<WooCartOperation>({
      query: getCartQuery
    });

    const cart = res.body.data.cart;
    if (!cart || !cart.contents?.nodes.length) {
      return undefined;
    }

    return reshapeCart(cart);
  } catch (e) {
    // Carrito vacío o sin sesión
    return undefined;
  }
}

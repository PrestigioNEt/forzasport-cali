import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import { ensureStartsWith } from 'lib/utils';
import { logError } from 'lib/utils/logger';
import {
  revalidateTag
} from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import { getPredictiveSearchQuery } from './queries/search';
import { getMetaobjectQuery, getMetaobjectsQuery } from './queries/metaobject';
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  PredictiveSearchResult,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyPredictiveSearchOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  Metaobject,
  // MetaobjectField, // Comentado - no usado actualmente, necesario para funciones helper metaobject
  ShopifyMetaobjectOperation,
  ShopifyMetaobjectsOperation,
  HomeHero,
  HomeSlide,
  HomeBrandSection,
  HomeNewsletter,
  HomeAnnouncement
} from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;

// NOTA: Shopify es legado. Migrando a WooCommerce.
// Las variables de Shopify ahora son opcionales para no romper el build.
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// Solo validar si estamos usando Shopify (no WooCommerce)
if (key && !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set. Shopify features will be disabled.');
  }
}

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (
  collection: ShopifyCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, collections, ...rest } = product;

  return {
    ...rest,
    collections: collections ? removeEdgesAndNodes(collections) : [],
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  let cartId: string;
  const existingCartId = (await cookies()).get('cartId')?.value;

  if (!existingCartId) {
    const newCart = await createCart();
    if (!newCart.id) {
      throw new Error('Failed to create cart');
    }
    cartId = newCart.id;
  } else {
    cartId = existingCartId;
  }

  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    throw new Error('No cart found');
  }

  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    throw new Error('No cart found');
  }

  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  // 'use cache'; // Not available in Next.js 14
  // cacheTag(TAGS.collections); // Not available in Next.js 14
  // cacheLife('days'); // Not available in Next.js 14

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  // 'use cache'; // Not available in Next.js 14
  // cacheTag(TAGS.collections, TAGS.products); // Not available in Next.js 14
  // cacheLife('days'); // Not available in Next.js 14

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    if (process.env.NODE_ENV === 'development') {
      // console.log(`No collection found for \`${collection}\``);
    }
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

export async function getCollections(): Promise<Collection[]> {
  // 'use cache'; // Not available in Next.js 14
  // cacheTag(TAGS.collections); // Not available in Next.js 14
  // cacheLife('days'); // Not available in Next.js 14

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
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
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  // 'use cache'; // Not available in Next.js 14
  // cacheTag(TAGS.collections); // Not available in Next.js 14
  // cacheLife('days'); // Not available in Next.js 14

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle
    }
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, '')
        .replace('/collections', '/search')
        .replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  // 'use cache'; // Not available in Next.js 14
  // cacheTag(TAGS.products); // Not available in Next.js 14
  // cacheLife('days'); // Not available in Next.js 14

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  // 'use cache'; // Not available in Next.js 14
  // cacheTag(TAGS.products); // Not available in Next.js 14
  // cacheLife('days'); // Not available in Next.js 14

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
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
  // 'use cache'; // Not available in Next.js 14
  // cacheTag(TAGS.products); // Not available in Next.js 14
  // cacheLife('days'); // Not available in Next.js 14

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getPredictiveSearch(
  searchQuery: string
): Promise<PredictiveSearchResult> {
  const res = await shopifyFetch<ShopifyPredictiveSearchOperation>({
    query: getPredictiveSearchQuery,
    variables: {
      query: searchQuery,
      limit: 10
    }
  });

  return res.body.data.predictiveSearch;
}

// Metaobject helper functions
// Nota: Estas funciones helper están comentadas temporalmente ya que no se usan en modo demo
// Descomentar cuando se active la integración completa con metaobjects de Shopify
/*
function getMetaobjectFieldValue(fields: MetaobjectField[], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

function getMetaobjectImageUrl(fields: MetaobjectField[], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.reference?.image?.url || '';
}
*/

export async function getMetaobject(handle: string, type: string): Promise<Metaobject | null> {
  try {
    const res = await shopifyFetch<ShopifyMetaobjectOperation>({
      query: getMetaobjectQuery,
      variables: { handle, type }
    });

    return res.body.data.metaobject;
  } catch (error) {
    logError(`Error fetching metaobject ${handle}`, error);
    return null;
  }
}

export async function getMetaobjects(type: string, first: number = 10): Promise<Metaobject[]> {
  try {
    const res = await shopifyFetch<ShopifyMetaobjectsOperation>({
      query: getMetaobjectsQuery,
      variables: { type, first }
    });

    return removeEdgesAndNodes(res.body.data.metaobjects);
  } catch (error) {
    logError(`Error fetching metaobjects of type ${type}`, error);
    return [];
  }
}

// Funciones específicas para obtener contenido del home
// ⚠️ MODO DEMO: Contenido estático para demostración rápida
// Edita estos valores según necesites
export async function getHomeHero(): Promise<HomeHero | null> {
  // const metaobject = await getMetaobject('home-hero', 'home_hero');
  // if (!metaobject) {
  //   return null;
  // }
  // const fields = metaobject.fields;

  // Contenido estático para demo - EDÍTALO AQUÍ
  return {
    title: 'Bonsais y Plantas de Colección',
    description: 'Descubre nuestra exclusiva selección de bonsais y plantas ornamentales. Transforma tu espacio con la naturaleza.',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1920&h=1080&fit=crop',
    buttonText: 'Ver Productos',
    buttonText2: 'Conócenos',
    buttonUrl: '/search',
    buttonUrl2: '/#filosofia'
  };
}

export async function getHomeSlides(): Promise<HomeSlide[]> {
  // const metaobjects = await getMetaobjects('seasonal_banner_slide', 20);

  // Contenido estático para demo - EDÍTALO AQUÍ
  return [
    {
      id: 'slide-1',
      image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1920&h=600&fit=crop',
      tag: 'OFERTA ESPECIAL',
      title: 'Colección de Plantas',
      subtitle: 'Hasta 40% de descuento en plantas seleccionadas',
      buttonText: 'Ver Ofertas',
      href: '/search'
    },
    {
      id: 'slide-2',
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=1920&h=600&fit=crop',
      tag: 'NUEVO',
      title: 'Bonsais Exclusivos',
      subtitle: 'Descubre nuestra colección premium de bonsais',
      buttonText: 'Explorar',
      href: '/search'
    },
    {
      id: 'slide-3',
      image: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=1920&h=600&fit=crop',
      tag: 'ENVÍO GRATIS',
      title: 'En Pedidos +$50',
      subtitle: 'Recibe tus plantas en 24-48 horas',
      buttonText: 'Comprar Ahora',
      href: '/search'
    }
  ];
}

export async function getHomeBrandSection(): Promise<HomeBrandSection | null> {
  // const metaobject = await getMetaobject('brand-philosophy', 'home_brand_section');
  // if (!metaobject) {
  //   return null;
  // }
  // const fields = metaobject.fields;

  // Contenido estático para demo - EDÍTALO AQUÍ
  return {
    title: 'Nuestra Filosofía',
    description: 'En Servigreen creemos que cada pequeña acción cuenta. Trabajamos diariamente para ofrecerte productos sostenibles que reduzcan tu huella ecológica sin sacrificar calidad o estilo.',
    quote: 'El cambio comienza en casa',
    image1: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
    image2: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop'
  };
}

export async function getHomeNewsletter(): Promise<HomeNewsletter | null> {
  // const metaobject = await getMetaobject('newsletter', 'home_newsletter');
  // if (!metaobject) {
  //   return null;
  // }
  // const fields = metaobject.fields;

  // Contenido estático para demo - EDÍTALO AQUÍ
  return {
    title: 'Únete a Nuestra Comunidad',
    description: 'Suscríbete y recibe ofertas exclusivas, consejos de sostenibilidad y novedades antes que nadie.'
  };
}

export async function getHomeAnnouncement(): Promise<HomeAnnouncement | null> {
  // const metaobject = await getMetaobject('announcement', 'home_announcement');
  // if (!metaobject) {
  //   return null;
  // }
  // const fields = metaobject.fields;
  // const enabled = getMetaobjectFieldValue(fields, 'enabled');

  // Contenido estático para demo - EDÍTALO AQUÍ
  return {
    text: '🎉 ¡ENVÍO GRATIS en pedidos superiores a $50! Usa el código: ECOfree',
    enabled: true
  };
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update'
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update'
  ];
  const topic = (await headers()).get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Invalid revalidation secret.');
    }
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

/**
 * COOKIES - Recently Viewed Products
 * Sistema de tracking de productos vistos recientemente usando cookies
 */

export interface RecentlyViewedProduct {
  id: string;
  slug: string;
  name: string;
  price?: string;
  image?: string;
  viewedAt: number; // timestamp
}

const COOKIE_NAME = 'pinneacle_recently_viewed';
const MAX_PRODUCTS = 12; // Máximo 12 productos
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días en segundos

/**
 * Establecer una cookie
 */
function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

/**
 * Obtener una cookie
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

/**
 * Obtener la lista de productos vistos recientemente
 */
export function getRecentlyViewed(): RecentlyViewedProduct[] {
  try {
    const cookie = getCookie(COOKIE_NAME);
    if (!cookie) return [];

    const products: RecentlyViewedProduct[] = JSON.parse(decodeURIComponent(cookie));

    // Filtrar productos antiguos (más de 30 días)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const validProducts = products.filter(p => p.viewedAt > thirtyDaysAgo);

    // Si filtramos productos, actualizar la cookie
    if (validProducts.length !== products.length) {
      setRecentlyViewed(validProducts);
    }

    return validProducts;
  } catch (error) {
    console.error('Error reading recently viewed cookie:', error);
    return [];
  }
}

/**
 * Guardar la lista de productos vistos recientemente
 */
export function setRecentlyViewed(products: RecentlyViewedProduct[]): void {
  try {
    // Mantener solo los MAX_PRODUCTS más recientes
    const sortedProducts = products
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .slice(0, MAX_PRODUCTS);

    const cookieValue = encodeURIComponent(JSON.stringify(sortedProducts));
    setCookie(COOKIE_NAME, cookieValue, COOKIE_MAX_AGE);
  } catch (error) {
    console.error('Error setting recently viewed cookie:', error);
  }
}

/**
 * Agregar un producto a la lista de vistos recientemente
 */
export function addRecentlyViewed(product: RecentlyViewedProduct): void {
  const current = getRecentlyViewed();

  // Remover si ya existe (para actualizarlo al inicio)
  const filtered = current.filter(p => p.id !== product.id);

  // Agregar el nuevo producto al inicio
  const updated = [
    {
      ...product,
      viewedAt: Date.now()
    },
    ...filtered
  ];

  setRecentlyViewed(updated);
}

/**
 * Limpiar la lista de productos vistos recientemente
 */
export function clearRecentlyViewed(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
}

/**
 * Obtener productos recomendados basados en los vistos recientemente
 * (puede extenderse con lógica más compleja)
 */
export function getRecommendedProducts(currentProductId: string, allProducts: any[], limit = 4): any[] {
  const recentlyViewed = getRecentlyViewed();
  const viewedIds = new Set(recentlyViewed.map(p => p.id));

  // Filtrar productos que no sean el actual ni ya vistos
  const available = allProducts.filter(p =>
    p.id !== currentProductId &&
    !viewedIds.has(p.id)
  );

  // Retornar productos aleatorios de los disponibles
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

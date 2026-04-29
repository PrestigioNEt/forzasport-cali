import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * PÁGINA DE CATEGORÍA - WooCommerce
 */

import {
  getProducts as getWooProducts,
  getCollections as getWooCollections
} from '@/lib/woocommerce';

import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;

  const collections = await getWooCollections();
  const category = collections.find((c: any) => c.slug === collection || c.handle === collection);

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: category.title || category.name,
    description: category.description || `Productos de ${category.title || category.name}`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { collection } = await props.params;
  const searchParams = await props.searchParams;

  // Obtener categoría actual
  const collections = await getWooCollections();
  const category = collections.find((c: any) => c.slug === collection || c.handle === collection);

  if (!category) {
    notFound();
  }

  // Obtener productos de esta categoría usando query específico
  const { woocommerceFetch } = await import('@/lib/woocommerce');
  const { getProductsByCategoryQuery } = await import('@/lib/woocommerce/queries/product');

  let products: any[] = [];
  try {
    const res = await woocommerceFetch<any>({
      query: getProductsByCategoryQuery,
      variables: { category: collection }
    });
    products = res.body.data.products?.nodes || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    // Fallback a todos los productos si falla
    products = await getWooProducts({});
  }

  // Adaptar productos al formato simple
  const adaptedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name || 'Sin nombre',
    slug: product.slug,
    price: product.price || 'Precio no disponible',
    image: product.image?.sourceUrl || product.image?.url || '/placeholder.jpg',
    stockStatus: product.stockStatus
  }));

  return (
    <main className="min-h-screen bg-gray-50 pt-4">
      {/* Breadcrumb simple */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Inicio
              </Link>
            </li>
            <li className="text-gray-300">›</li>
            <li>
              <Link href="/search" className="text-gray-500 hover:text-gray-700">
                Categorías
              </Link>
            </li>
            <li className="text-gray-300">›</li>
            <li className="text-gray-900 font-medium">{category.title || category.name}</li>
          </ol>
        </div>
      </nav>

      {/* Header de categoría */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category.title || category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-lg text-gray-600">
              {category.description}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            {adaptedProducts.length} {adaptedProducts.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {adaptedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No se encontraron productos en esta categoría.</p>
            <Link
              href="/search"
              className="mt-4 inline-block text-gray-900 hover:text-gray-700 font-semibold"
            >
              ← Ver otras categorías
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {adaptedProducts.map((product) => (
              <Link
                key={product.id}
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
                    {product.name}
                  </h3>
                  <p className="text-lg text-gray-700 font-medium">
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * NUEVA HOME PAGE - WooCommerce
 * Versión limpia sin dependencias de Shopify
 */

// Conexión WooCommerce
import {
  getProducts as getWooProducts,
  getCollections as getWooCollections
} from '@/lib/woocommerce';

// Componentes simples
import { ProductCard } from '@/components/ui/product-card';
import { CategoryCard } from '@/components/ui/category-card';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';
import { BannerCarousel } from '@/components/custom/BannerCarousel';
import { CategoryCarousel } from '@/components/custom/CategoryCarousel';

export const metadata = {
  title: 'Forza Sport - Tu Tienda Online de Deportes y Fitness',
  description: 'Descubre los mejores productos deportivos, fitness y accesorios en Forza Sport. Calidad premium y los mejores precios.',
  keywords: 'deportes, fitness, accesorios deportivos, tienda online, Forza Sport',
};

async function getFeaturedProducts() {
  try {
    console.log('📦 Fetching productos...');

    // Importar directamente los tipos y query necesarios
    const { woocommerceFetch } = await import('@/lib/woocommerce');
    const { getProductsQuery } = await import('@/lib/woocommerce/queries/product');

    // Hacer fetch directo a WooCommerce sin reshape
    const res = await woocommerceFetch<any>({
      query: getProductsQuery,
      variables: {}
    });

    const products = res.body.data.products?.nodes || [];

    console.log('✅ Productos OBTENIDOS DIRECTAMENTE DE WOOCOMMERCE:');
    console.table(products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      hasImage: !!p.image
    })));

    if (!products || products.length === 0) {
      console.log('⚠️ No hay productos');
      return [];
    }

    // Adaptar a formato simple
    const adapted = products.slice(0, 8).map((product: any) => {
      const adaptedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price || 'Precio no disponible',
        image: product.image?.sourceUrl || product.image?.url || '/placeholder.jpg',
        category: 'Accesorios',
        description: product.description || product.shortDescription || ''
      };
      console.log('🔄 Producto adaptado:', adaptedProduct);
      return adaptedProduct;
    });

    console.log('✅ Productos adaptados:', adapted);

    return adapted;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    console.error('Error completo:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const collections = await getWooCollections();

    if (!collections || collections.length === 0) {
      return [];
    }

    // Adaptar a formato simple - WooCommerce usa campos diferentes
    // Filtrar categorías inválidas (undefined, vacías, uncategorized, 'All')
    return collections
      .filter((collection: any) =>
        collection.handle &&
        collection.handle !== 'undefined' &&
        collection.handle !== '' &&
        collection.handle !== 'all' &&
        !collection.handle.toLowerCase().includes('uncategorized')
      )
      .map((collection: any) => ({
        id: collection.handle, // Usar handle como ID único
        name: collection.title || collection.name,
        slug: collection.handle,
        image: collection.image?.url || collection.image?.sourceUrl || '/placeholder-category.jpg',
        path: collection.path || `/search/${collection.handle}`
      }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  // Obtener datos en paralelo
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ]);

  return (
    <>
      <WooNavbar />
      <main className="min-h-screen bg-gray-50">
      {/* Banner Carousel */}
      <div className="pt-20">
        <BannerCarousel />
      </div>

      {/* Categorías - Carrusel continuo */}
      {categories.length > 0 && <CategoryCarousel categories={categories} />}

      {/* Productos Destacados */}
      {products.length > 0 && (
        <section className="py-16 bg-[#f5f5f5]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Productos Destacados
              </h2>
              <Link
                href="/search"
                className="text-green-700 hover:text-green-800 font-semibold"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterCustom />
    </main>
    </>
  );
}

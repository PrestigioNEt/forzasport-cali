import Link from 'next/link';
import { WooNavbar } from '@/components/layout/navbar/woo-navbar';
import FooterCustom from '@/components/custom/FooterCustom';
import { ProductDescriptionWoo } from '@/components/product/ProductDescriptionWoo';
import { ProductViewTracker } from '@/components/product/ProductViewTracker';

/**
 * PÁGINA INDIVIDUAL DE PRODUCTO - WooCommerce
 * Next.js 15: params es async y debe ser awaited
 */

// ISR: Revalidar automáticamente cada 60 segundos
export const revalidate = 60;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { woocommerceFetch } = await import('@/lib/woocommerce');
    const { getProductQuery } = await import('@/lib/woocommerce/queries/product');

    const res = await woocommerceFetch<any>({
      query: getProductQuery,
      variables: { slug }
    });

    const product = res.body.data.product;

    if (!product) {
      return {
        title: 'Producto no encontrado'
      };
    }

    return {
      title: product.name,
      description: product.shortDescription || product.description?.slice(0, 160) || ''
    };
  } catch {
    return {
      title: 'Producto'
    };
  }
}

async function getProduct(slug: string) {
  try {
    const { woocommerceFetch } = await import('@/lib/woocommerce');
    const { getProductQuery } = await import('@/lib/woocommerce/queries/product');

    const res = await woocommerceFetch<any>({
      query: getProductQuery,
      variables: { slug }
    });

    // Log temporal para depuración de la respuesta cruda
    // eslint-disable-next-line no-console
    console.log('RESPUESTA CRUDA DEL FETCH:', res.body.data);

    return res.body.data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  // Log temporal para depuración de variaciones
  // eslint-disable-next-line no-console
  console.log('PRODUCTO INDIVIDUAL:', product);
  // eslint-disable-next-line no-console
  console.log('VARIACIONES:', product?.variations?.nodes);
  // eslint-disable-next-line no-console
  console.log('TYPENAME:', product?.__typename);
  // eslint-disable-next-line no-console
  console.log('ATTRIBUTES:', product?.attributes?.nodes);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const price = product.price || 'Precio no disponible';
  const image = product.image?.sourceUrl || product.image?.url || '/placeholder.jpg';
  const galleryImages = product.galleryImages?.nodes || [];

  // Preparar datos para el tracker de productos vistos
  const productForTracker = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image?.sourceUrl || product.image?.url
  };

  // Función simple para limpiar HTML - solo extraer texto
  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const shortDescription = product.shortDescription ? stripHtml(product.shortDescription) : '';
  const description = product.description ? stripHtml(product.description) : '';

  return (
    <>
      <WooNavbar />
      <main className="min-h-screen bg-white pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Inicio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
          {/* Galería de imágenes - 60% (3 columnas) */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={image}
                  alt={product.name || 'Producto'}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {galleryImages.map((img: any, index: number) => (
                    <div
                      key={img.sourceUrl || index}
                      className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-75"
                    >
                      <img
                        src={img.sourceUrl}
                        alt={`${product.name || 'Producto'} - ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info del producto - 40% (2 columnas) - Sticky */}
          <div className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
            <ProductDescriptionWoo product={product} />
          </div>
        </div>
      </div>
    </main>

    <ProductViewTracker product={productForTracker} />

    <FooterCustom />
    </>
  );
}

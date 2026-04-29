import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NextImage from 'next/image';

import FooterCustom from '@/components/custom/FooterCustom';
import AnnouncementBar from '@/components/custom/AnnouncementBar';
import { GalleryCustom } from 'components/product/gallery-custom';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescriptionCustom } from 'components/product/product-description-custom';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { Image } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { StickyAddToCart } from 'components/product/sticky-add-to-cart';
import { TrustBadges } from '@/components/ui/trust-badges';
import { TrackRecentlyViewed } from 'components/product/track-recently-viewed';
import { RecentlyViewed } from 'components/product/recently-viewed';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <TrackRecentlyViewed product={product} />
      <AnnouncementBar />

      {/* Product Detail Section - Diseño elegante con identidad servigreen */}
      <div className="bg-white pt-32 pb-16">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: 'Productos', href: '/search' },
                { label: product.title }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
            {/* Gallery - 60% width (3 columns) */}
            <div className="lg:col-span-3">
              <Suspense
                fallback={
                  <div className="relative aspect-square h-full w-full overflow-hidden bg-gray-100" />
                }
              >
                <GalleryCustom
                  images={product.images.map((image: Image) => ({
                    src: image.url,
                    altText: image.altText
                  }))}
                />
              </Suspense>
            </div>

            {/* Product Info - 40% width (2 columns) - Sticky */}
            <div className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start">
              <Suspense fallback={null}>
                <ProductDescriptionCustom product={product} />
              </Suspense>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16">
            <TrustBadges />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <Suspense fallback={<div className="py-16 text-center">Cargando productos relacionados...</div>}>
        <RelatedProducts id={product.id} />
      </Suspense>

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart product={product} />

      <FooterCustom />
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-belleza text-2xl lg:text-3xl font-light tracking-wide mb-10 text-gray-900 text-center">
          También podría gustarte
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
          {relatedProducts.map((product) => (
            <Link
              key={product.handle}
              href={`/products/${product.handle}`}
              className="group relative block product-card"
              prefetch={true}
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative mb-3 rounded-sm">
                {product.featuredImage && (
                  <NextImage
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    className="object-cover object-center image-hover-zoom"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                )}
                {/* Badge de Agotado */}
                {!product.availableForSale && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium tracking-wider uppercase bg-gray-900 text-white">
                      Agotado
                    </span>
                  </div>
                )}
                {/* Overlay sutil en hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 image-overlay" />
              </div>

              {/* Info debajo de la imagen - estilo Versace */}
              <div className="text-left">
                <h3 className="font-belleza text-sm font-light text-gray-900 tracking-wide mb-1">
                  {product.title}
                </h3>
                <p className="font-moderat text-sm font-semibold text-gray-900">
                  ${parseFloat(product.priceRange.maxVariantPrice.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

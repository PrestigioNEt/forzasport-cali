import { getCollectionProducts } from 'lib/shopify';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import Price from './price';

export async function Carousel() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const products = await getCollectionProducts({ collection: 'hidden-homepage-carousel' });

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.handle}${i}`}
            className="w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link
              href={`/products/${product.handle}`}
              className="flex h-full w-full flex-col"
              prefetch={true}
            >
              <div className="relative aspect-square h-full w-full">
                <GridTileImage
                  alt={`${product.title} - Producto destacado en servigreen`}
                  src={product.featuredImage?.url}
                />
              </div>
              <div className="mt-4 flex flex-col items-start gap-1">
                <h3 className="font-belleza text-lg text-black">{product.title}</h3>
                <Price amount={product.priceRange.maxVariantPrice.amount} currencyCode={product.priceRange.maxVariantPrice.currencyCode} className="text-sm text-gray-700" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

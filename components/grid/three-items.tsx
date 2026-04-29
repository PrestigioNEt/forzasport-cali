import { GridTileImage } from 'components/grid/tile';
import Price from 'components/price';
import { ProductBadge } from 'components/product-badge';
import { getCollectionProducts } from 'lib/shopify';
import type { Product } from 'lib/shopify/types';
import Link from 'next/link';

function ThreeItemGridItem({
  item,
  size
}: {
  item: Product;
  size: 'full' | 'half';
}) {
  const compareAtPrice = parseFloat(item.variants[0]?.compareAtPrice?.amount || '0');
  const currentPrice = parseFloat(item.priceRange.maxVariantPrice.amount);
  const hasDiscount = item.variants[0]?.compareAtPrice?.amount &&
    !isNaN(compareAtPrice) && !isNaN(currentPrice) && compareAtPrice > currentPrice;

  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative flex h-full w-full flex-col"
        href={`/products/${item.handle}`}
        prefetch={true}
      >
        <div className="relative h-full w-full aspect-square">
          {hasDiscount && <ProductBadge />}
          <GridTileImage
            src={item.featuredImage.url}
            alt={item.title}
          />
        </div>

        <div className="mt-4 flex flex-col items-start gap-1">
          <h3 className="font-belleza text-lg text-black">{item.title}</h3>
          <Price
            amount={item.priceRange.maxVariantPrice.amount}
            currencyCode={item.priceRange.maxVariantPrice.currencyCode}
            compareAtAmount={item.variants[0]?.compareAtPrice?.amount}
            className="text-sm text-gray-700"
          />
        </div>
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getCollectionProducts({
    collection: 'hidden-homepage-featured-items'
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={firstProduct} />
      <ThreeItemGridItem size="half" item={secondProduct} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}

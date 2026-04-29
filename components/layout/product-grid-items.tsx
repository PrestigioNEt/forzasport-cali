import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => {
        return (
          <Grid.Item key={product.handle} className="animate-fadeIn group">
            <Link
              className="flex h-full w-full flex-col"
              href={`/products/${product.handle}`}
              prefetch={true}
            >
              <div className="relative h-full w-full aspect-[4/5]">
                <GridTileImage
                  alt={`${product.title} - Producto disponible en servigreen`}
                  src={product.featuredImage?.url}
                />
                {/* Badge de Agotado */}
                {!product.availableForSale && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium tracking-wider uppercase bg-gray-900 text-white">
                      Agotado
                    </span>
                  </div>
                )}
              </div>
            <div className="mt-4 flex flex-col items-start gap-1">
              <h3 className="font-belleza text-lg text-black">{product.title}</h3>
              <Price
                amount={product.priceRange.maxVariantPrice.amount}
                currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                compareAtAmount={product.variants[0]?.compareAtPrice?.amount}
                className="text-sm text-gray-700"
              />
            </div>
          </Link>
        </Grid.Item>
        );
      })}
    </>
  );
}

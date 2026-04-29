import { Suspense } from 'react';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';
import { ProductGridSkeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Tienda',
}

async function AllProductsGrid({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return products.length > 0 ? (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
      <ProductGridItems products={products} />
    </Grid>
  ) : (
    <div className="text-center py-8 col-span-full">
      <p className="text-lg text-gray-900 mb-2">
        No se encontraron productos para <span className="font-bold">&quot;{searchValue}&quot;</span>.
      </p>
      <p className="text-sm text-gray-600">
        Intenta buscar con otras palabras o navega por nuestras categorías.
      </p>
    </div>
  );
}

export default async function AllProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = (await props.searchParams) || {};
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Todos los productos</h1>
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <AllProductsGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
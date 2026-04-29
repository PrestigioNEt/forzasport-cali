import { getCollection, getCollectionProducts, getCollections } from 'lib/shopify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import AnnouncementBar from '@/components/custom/AnnouncementBar';
import CategorySectionMinimal from '@/components/custom/CategorySectionMinimal';
import FooterCustom from '@/components/custom/FooterCustom';

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} productos`,
    openGraph: {
      type: 'website',
      title: collection.seo?.title || collection.title,
      description: collection.seo?.description || collection.description || `${collection.title} productos`
    }
  };
}

export default async function CategoryPage({
  params: promiseParams,
  searchParams: promiseSearchParams
}: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sort } = ((await promiseSearchParams) || {}) as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const params = await promiseParams;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  const [products, collections] = await Promise.all([
    getCollectionProducts({ collection: params.collection, sortKey, reverse }),
    getCollections()
  ]);

  return (
    <section>
      <AnnouncementBar />

      {/* Categorías minimalistas */}
      <div className="bg-white">
        <CategorySectionMinimal collections={collections} />
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-screen-2xl px-4 py-12">
        <h1 className="font-belleza text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide mb-8 text-gray-900">
          {collection.title}
        </h1>

        {products.length === 0 ? (
          <p className="py-3 text-lg text-gray-600">No hay productos disponibles en esta categoría.</p>
        ) : (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductGridItems products={products} />
          </Grid>
        )}
      </div>

      <FooterCustom />
    </section>
  );
}